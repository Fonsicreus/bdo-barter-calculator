import { afterEach, beforeEach, expect, test } from "bun:test";
import { advanceCatalog } from "../src/ship-upgrades/catalog";
import { fleet } from "../src/ship-upgrades/fleet";
import {
  INVENTORY_COOKIE_NAME,
  INVENTORY_VERSION,
  MAX_FRAGMENT_PRICE,
  MAX_QUANTITY,
  createDefaultInventory,
  loadInventory,
  normalizeInventory,
  parseInventoryQuantity,
  resetInventory,
  saveInventory,
} from "../src/ship-upgrades/inventory";

const catalog = {
  items: {
    timber: { name: "Timber", category: "material" },
    stone: { name: "Stone", category: "enhancement" },
    green: { name: "Green part", category: "equipment" },
    blue: { name: "Blue part", category: "equipment" },
  },
  gear: [{ id: "green" }, { id: "blue" }],
};
const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
let cookies;
let writes;

beforeEach(() => {
  cookies = new Map();
  writes = [];
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      get cookie() {
        return [...cookies].map(([key, value]) => `${key}=${value}`).join("; ");
      },
      set cookie(value) {
        writes.push(value);
        const [pair] = value.split(";");
        const separator = pair.indexOf("=");
        const key = pair.slice(0, separator);
        if (value.includes("Max-Age=-")) cookies.delete(key);
        else cookies.set(key, pair.slice(separator + 1));
      },
    },
  });
});

afterEach(() => {
  if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
  else Reflect.deleteProperty(globalThis, "document");
});

function setSaved(value) {
  cookies.set(INVENTORY_COOKIE_NAME, encodeURIComponent(JSON.stringify(value)));
}

test("the fleet loads the original cookie and retains other routes' items after switching", () => {
  const original = { owned: { 5809: 50 }, gearLevels: { 49655: 8 }, balance: 123 };
  setSaved({ version: INVENTORY_VERSION, inventory: original });
  const previous = loadInventory(fleet);
  expect(previous).toMatchObject(original);
  const next = {
    ...previous,
    routeId: "31049-31056",
    gearLevels: { ...previous.gearLevels, 49667: 0 },
  };
  expect(saveInventory(fleet, next)).toBe(true);
  expect(loadInventory(fleet)).toEqual(next);
  expect(normalizeInventory(fleet, { ...next, routeId: "31053-31054" }).routeId).toBeUndefined();
});

test("a filled fleet with realistic quantities still fits the inventory cookie", () => {
  const gearLevels = Object.fromEntries(
    fleet.gear.map(({ id, fixedLevel }) => [id, fixedLevel ? 0 : 10]),
  );
  const owned = Object.fromEntries(
    Object.keys(fleet.items)
      .filter((id) => !Object.hasOwn(gearLevels, id))
      .map((id) => [id, 1000]),
  );
  const stock = { owned, gearLevels, routeId: fleet.defaultRouteId };
  expect(saveInventory(fleet, stock)).toBe(true);
  expect(loadInventory(fleet)).toMatchObject(stock);
});

test("defaults are empty inventory, zero balance and ten boxes, without shared objects", () => {
  expect(loadInventory(catalog)).toEqual({
    owned: {},
    gearLevels: {},
    balance: 0,
    remainingStoneBoxes: 10,
  });
  const first = createDefaultInventory();
  first.owned.timber = 50;
  expect(createDefaultInventory().owned).toEqual({});
});

test("versioned cookie round-trips valid quantities, levels, balance and zero boxes", () => {
  const inventory = {
    owned: { timber: 8, stone: MAX_QUANTITY },
    gearLevels: { green: 0, blue: 10 },
    balance: MAX_QUANTITY,
    remainingStoneBoxes: 0,
  };
  expect(saveInventory(catalog, inventory)).toBe(true);
  expect(loadInventory(catalog)).toEqual(inventory);
  expect(JSON.parse(decodeURIComponent(cookies.get(INVENTORY_COOKIE_NAME))).version).toBe(
    INVENTORY_VERSION,
  );
  expect(writes[0]).toContain("path=/; SameSite=Lax");
});

test("malformed URI encodings and JSON safely fall back to defaults", () => {
  for (const raw of ["%E0%A4%A", "%ZZ", "%7Bbroken", "%00", "null", "%5B%5D"]) {
    cookies.set(INVENTORY_COOKIE_NAME, raw);
    expect(loadInventory(catalog)).toEqual(createDefaultInventory());
  }
});

test("Memory Fragment stock and a valid market override survive reload without inventing a default price", () => {
  const inventory = {
    ...createDefaultInventory(),
    owned: { 44195: 14 },
    memoryFragmentPrice: 2_270_000,
  };
  expect(saveInventory(advanceCatalog, inventory)).toBe(true);
  expect(loadInventory(advanceCatalog)).toEqual(inventory);
  for (const price of ["2270000", 0, -1, MAX_FRAGMENT_PRICE + 1]) {
    expect(
      normalizeInventory(advanceCatalog, { memoryFragmentPrice: price }).memoryFragmentPrice,
    ).toBeUndefined();
  }
});

test("unsupported or absent schema versions never reuse saved values", () => {
  for (const version of [undefined, 0, 2, "1", null]) {
    setSaved({ version, inventory: { balance: 900, remainingStoneBoxes: 0 } });
    expect(loadInventory(catalog)).toEqual(createDefaultInventory());
  }
});

test("invalid field types and bounds are dropped without discarding valid fields", () => {
  for (const invalid of [
    -1,
    1.2,
    "4",
    true,
    null,
    MAX_QUANTITY + 1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    const normalized = normalizeInventory(catalog, {
      owned: { timber: invalid, stone: 7, unknown: 99 },
      gearLevels: { green: 0, blue: 11, unknown: 10 },
      balance: invalid,
      remainingStoneBoxes: 11,
    });
    expect(normalized).toEqual({
      owned: { stone: 7 },
      gearLevels: { green: 0 },
      balance: 0,
      remainingStoneBoxes: 10,
    });
  }
});

test("gear ownership is only represented by levels, never a duplicate raw owned count", () => {
  const normalized = normalizeInventory(catalog, {
    owned: { green: 1, blue: 1, timber: 2 },
    gearLevels: { green: -1, blue: 0 },
  });
  expect(normalized.owned).toEqual({ timber: 2 });
  expect(normalized.gearLevels).toEqual({ blue: 0 });
});

test("all gear levels and weekly box counts stay inside their exact integer bounds", () => {
  for (let level = -1; level <= 10; level += 1) {
    expect(
      normalizeInventory(catalog, { gearLevels: { green: level } }).gearLevels.green ?? -1,
    ).toBe(level);
  }
  for (const level of [-2, 11, 0.5, "10", false, MAX_QUANTITY]) {
    expect(normalizeInventory(catalog, { gearLevels: { green: level } }).gearLevels).toEqual({});
  }
  for (let quantity = 0; quantity <= 10; quantity += 1) {
    expect(normalizeInventory(catalog, { remainingStoneBoxes: quantity }).remainingStoneBoxes).toBe(
      quantity,
    );
  }
  for (const quantity of [-1, 11, 0.5, "0", false]) {
    expect(normalizeInventory(catalog, { remainingStoneBoxes: quantity }).remainingStoneBoxes).toBe(
      10,
    );
  }
});

test("objects, arrays, inherited values and prototype keys cannot pollute inventory", () => {
  for (const value of [null, [], false, "inventory", 1]) {
    expect(normalizeInventory(catalog, value)).toEqual(createDefaultInventory());
  }
  expect(normalizeInventory(catalog, { owned: [10], gearLevels: [10] })).toEqual(
    createDefaultInventory(),
  );
  expect(
    normalizeInventory(catalog, {
      owned: Object.create({ timber: 100 }),
      gearLevels: Object.create({ green: 10 }),
    }),
  ).toEqual(createDefaultInventory());
  setSaved({
    version: 1,
    inventory: JSON.parse(
      '{"owned":{"__proto__":100,"constructor":50,"timber":3},"gearLevels":{"__proto__":10}}',
    ),
  });
  expect(loadInventory(catalog).owned).toEqual({ timber: 3 });
  expect({}.polluted).toBeUndefined();
});

test("normalization does not mutate the caller inventory", () => {
  const inventory = Object.freeze({
    owned: Object.freeze({ timber: 2 }),
    gearLevels: Object.freeze({ blue: 0 }),
    balance: 1,
    remainingStoneBoxes: 3,
  });
  const result = normalizeInventory(catalog, inventory);
  expect(result).toEqual(inventory);
  expect(result.owned).not.toBe(inventory.owned);
});

test("blocked cookie access cannot crash loading, saving or resetting", () => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    get() {
      throw new Error("blocked");
    },
  });
  expect(loadInventory(catalog)).toEqual(createDefaultInventory());
  expect(saveInventory(catalog, createDefaultInventory())).toBe(false);
  expect(resetInventory()).toBe(false);
});

test("ignored cookie writes report unsaved state", () => {
  Object.defineProperty(document, "cookie", { get: () => "", set: () => {} });
  expect(saveInventory(catalog, { balance: 5 })).toBe(false);
});

test("oversized cookies are not written over an earlier saved inventory", () => {
  expect(saveInventory(catalog, { balance: 7 })).toBe(true);
  const manyItems = Object.fromEntries(
    Array.from({ length: 200 }, (_, index) => [
      `long-material-id-${index}`,
      { category: "material" },
    ]),
  );
  expect(
    saveInventory(
      { items: manyItems, gear: [] },
      { owned: Object.fromEntries(Object.keys(manyItems).map((id) => [id, MAX_QUANTITY])) },
    ),
  ).toBe(false);
  expect(loadInventory(catalog).balance).toBe(7);
  expect(writes).toHaveLength(1);
});

test("reset deletes only the upgrade cookie, preserving barter settings and theme", () => {
  cookies.set("bdo_theme", "dark");
  cookies.set("bdo_ship_id", "caravel");
  cookies.set("bdo_ship_current_cargo", "120");
  saveInventory(catalog, { balance: 5 });
  expect(resetInventory()).toBe(true);
  expect(cookies.has(INVENTORY_COOKIE_NAME)).toBe(false);
  expect(cookies.get("bdo_theme")).toBe("dark");
  expect(cookies.get("bdo_ship_id")).toBe("caravel");
  expect(cookies.get("bdo_ship_current_cargo")).toBe("120");
  expect(loadInventory(catalog)).toEqual(createDefaultInventory());
});

test("numeric entry accepts only nonnegative safe whole-number quantities", () => {
  for (const [raw, expected] of [
    ["", 0],
    ["0", 0],
    ["007", 7],
    ["124", 124],
    [String(MAX_QUANTITY), MAX_QUANTITY],
  ]) {
    expect(parseInventoryQuantity(raw)).toBe(expected);
  }
  for (const raw of [
    "-1",
    "1.2",
    "1e3",
    "+2",
    " 2",
    "NaN",
    "Infinity",
    String(MAX_QUANTITY + 1),
    null,
    1,
  ]) {
    expect(parseInventoryQuantity(raw)).toBeNull();
  }
});
