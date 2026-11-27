import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { LOCALES } from "../src/i18n/locales";
import { fleet } from "../src/ship-upgrades/fleet";
import { shipUpgradeMessages } from "../src/ship-upgrades/messages";
import { sailingMaterials, sailingQuests } from "../src/ship-upgrades/sailingSources";

const shipUpgradeSource = ["ShipUpgradeApp.jsx", "MaterialSources.jsx"]
  .map((file) => readFileSync(new URL(`../src/ship-upgrades/${file}`, import.meta.url), "utf8"))
  .join("\n");
const messageKeys = new Set([
  ...[...shipUpgradeSource.matchAll(/\bt\(\s*("(?:[^"\\]|\\.)*")/g)].map((match) =>
    JSON.parse(match[1]),
  ),
  ...fleet.routes.flatMap(({ originName, destinationName }) => [originName, destinationName]),
  ...Object.values(fleet.items).flatMap(({ name, source }) => (source ? [name, source] : [name])),
  ...sailingQuests.map(({ name }) => name),
  ...Object.values(sailingMaterials).flatMap(({ khan }) => (khan ? [khan] : [])),
  "Ship Upgrade",
  "Ship Equipment",
  "Calculators",
  "Barter Calculator",
  "Item",
  "Required",
  "Missing",
  "Acquisition",
  "Purchase cost",
  "November 24, 2026",
  "PC EU",
]);
const placeholders = (text) => [...text.matchAll(/\{\w+\}/g)].map(([key]) => key).sort();

test("every non-English site locale has a ship upgrade dictionary", () => {
  expect(Object.keys(shipUpgradeMessages).sort()).toEqual(
    LOCALES.map(({ id }) => id)
      .filter((id) => id !== "en")
      .sort(),
  );
});

test.each(Object.entries(shipUpgradeMessages))(
  "%s translates the upgrade interface and game data without changing placeholders",
  (_locale, messages) => {
    expect([...messageKeys].filter((key) => !messages[key]?.trim())).toEqual([]);
    expect(Object.keys(messages).filter((key) => !messageKeys.has(key))).toEqual([]);
    for (const [key, translation] of Object.entries(messages)) {
      expect(translation).not.toContain("�");
      expect(placeholders(translation)).toEqual(placeholders(key));
    }
  },
);
