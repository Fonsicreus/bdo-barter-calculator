import { afterEach, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Header } from "../src/components/Header";
import { ShipSelector } from "../src/components/ShipSelector";
import { DEFAULT_SHIP } from "../src/data/ships";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { LOCALES } from "../src/i18n/locales";

const previousStorage = globalThis.localStorage;
afterEach(() => {
  globalThis.localStorage = previousStorage;
});

test("ship configuration is a collapsed disclosure and keeps cargo visible", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <ShipSelector
        selectedShip={DEFAULT_SHIP}
        maxWeight={19300}
        currentCargo={0}
        isCapacityValid
        capacityBonus={9300}
        availableCapacity={19300}
      />
    </LanguageProvider>,
  );
  expect(html).toMatch(/^<details class=/);
  expect(html).toMatch(/<summary[^>]*>.*Available Cargo.*<\/summary>/);
  expect(html).toMatch(/19[,.\s]?300 LT/);
  expect(html).toContain('id="max-weight-input"');
  expect(html).toContain('aria-pressed="false"');
  expect(html).toContain("Overload");
});

test("ship overload button shows its provisional limit when enabled", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <ShipSelector
        selectedShip={DEFAULT_SHIP}
        maxWeight={19300}
        currentCargo={0}
        isCapacityValid
        capacityBonus={9300}
        availableCapacity={19300}
        overloadEnabled
        finalCargoLimit={28950}
      />
    </LanguageProvider>,
  );
  expect(html).toContain('aria-pressed="true"');
  expect(html).toMatch(/28[, .\s]?950 LT/);
  expect(html).toContain("the 150% limit is not confirmed");
});

test("language buttons show the active language without a dropdown", () => {
  for (const { id: language } of LOCALES) {
    globalThis.localStorage = { getItem: () => language };
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <Header theme="light" />
      </LanguageProvider>,
    );
    for (const { id, label, shortLabel } of LOCALES) {
      expect(html).toContain(`aria-label="${label}" aria-pressed="${language === id}"`);
      expect(html).toContain(`>${shortLabel}</button>`);
    }
    expect(html).not.toContain("<select");
  }
});
