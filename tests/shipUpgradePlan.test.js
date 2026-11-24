import { describe, expect, test } from "bun:test";
import { calculatePlan } from "../src/ship-upgrades/calculatePlan";
import { advanceCatalog } from "../src/ship-upgrades/catalog";
import { fleet } from "../src/ship-upgrades/fleet";
import { createDefaultInventory } from "../src/ship-upgrades/inventory";

const stone = {
  shop: { unitPrice: 10, bundle: { price: 150, quantity: 20, weeklyLimit: 10 } },
};

function forStones(quantity, inventory = {}) {
  return calculatePlan(
    { requirements: { stone: quantity }, gear: [], items: { stone } },
    inventory,
  );
}

function findRow(plan, id) {
  return plan.rows.find((row) => row.id === id);
}

describe("fleet upgrade routes", () => {
  const expected = {
    "31053-31001": [0, "16001", 220],
    "31053-31003": [0, "16001", 220],
    "31001-31058": [0],
    "31003-31059": [0],
    "31001-31048": [1060, "756001", 40],
    "31058-31048": [1060, "756001", 40],
    "31003-31049": [930, "756001", 40],
    "31059-31049": [930, "756001", 40],
    "31048-31054": [210_720, "756001", 120],
    "31048-31055": [209_920, "756001", 120],
    "31049-31056": [232_120, "756001", 120],
    "31049-31057": [233_000, "756001", 120],
    "9090-9124": [0],
  };

  test("all wharf routes have the correct base costs and enhancement requirements", () => {
    expect(fleet.routes.map(({ id }) => id).sort()).toEqual(Object.keys(expected).sort());
    for (const route of fleet.routes) {
      const [cost, stone, quantity] = expected[route.id];
      const plan = calculatePlan(route, createDefaultInventory());
      expect(plan.buyableCost).toBe(cost);
      expect(plan.rows.filter(({ required }) => required > 0).length).toBeGreaterThan(0);
      if (stone) {
        expect(findRow(plan, stone).required).toBe(quantity);
      } else {
        expect(route.gear.every(({ targetLevel }) => targetLevel === 0)).toBe(true);
        expect(plan.rows.some(({ id }) => fleet.items[id].category === "enhancement")).toBe(false);
      }
    }
  });

  test("Galleass recipes use their own gear and combine shared materials before pricing", () => {
    const route = fleet.routes.find(({ destination }) => destination === 31056);
    const plan = calculatePlan(route, {
      gearLevels: { 49655: 10, 49669: 4 },
      owned: { 5827: 100, 5824: 100 },
    });
    expect(findRow(plan, "49655")).toBeUndefined();
    expect(findRow(plan, "49667").missing).toBe(1);
    expect(findRow(plan, "49663").required).toBe(0);
    expect(findRow(plan, "5827")).toMatchObject({ required: 300, missing: 200, cost: 3000 });
    expect(findRow(plan, "5824")).toMatchObject({ required: 125, missing: 25, cost: 3000 });
    expect(findRow(plan, "756001").required).toBe(101);
  });
});

describe("ship upgrade calculator", () => {
  test("worst case counts all failures and the guaranteed attempt for each unreached level", () => {
    const plan = calculatePlan(advanceCatalog, createDefaultInventory(), { worstCase: true });
    expect(plan).toMatchObject({ buyableCost: 218_280, silverCost: 32_000_000 });
    expect(findRow(plan, "756001")).toMatchObject({ required: 896, cost: 8_460 });
    expect(findRow(plan, "44195")).toMatchObject({
      required: 1504,
      missing: 1504,
      status: "market",
    });
    expect(plan.repair).toEqual({ failures: 464, durabilityLost: 3880, marketSilver: null });
  });

  test("worst case prices only missing fragments and skips owned blue gear's green chain", () => {
    const partial = {
      ...createDefaultInventory(),
      gearLevels: { 49655: 10, 49656: 10, 49657: 8, 49658: 10 },
      owned: { 5809: 180, 5812: 144, 5815: 35, 5821: 42, 5831: 35, 756001: 8, 44195: 10 },
      remainingStoneBoxes: 2,
      memoryFragmentPrice: 2_270_000,
      balance: 50,
    };
    const plan = calculatePlan(advanceCatalog, partial, { worstCase: true });
    expect(findRow(plan, "49651").required).toBe(0);
    expect(findRow(plan, "756001")).toMatchObject({ required: 68, missing: 60, cost: 500 });
    expect(findRow(plan, "44195")).toMatchObject({ required: 160, missing: 150 });
    expect(plan).toMatchObject({ buyableCost: 500, stillToEarn: 450, silverCost: 0 });
    expect(plan.repair).toEqual({ failures: 32, durabilityLost: 320, marketSilver: 340_500_000 });
    expect(
      calculatePlan(
        advanceCatalog,
        { ...partial, owned: { ...partial.owned, 44195: 160 }, memoryFragmentPrice: 0 },
        { worstCase: true },
      ).repair.marketSilver,
    ).toBe(0);
    const floor = calculatePlan(advanceCatalog, partial);
    expect(floor.repair).toBeUndefined();
    expect(findRow(floor, "44195")).toBeUndefined();
    expect(floor.buyableCost).toBe(0);
  });

  test("matches the audited Caravel to Advance budget and quantities from empty inventory", () => {
    const empty = createDefaultInventory();
    const plan = calculatePlan(advanceCatalog, empty);
    expect(plan).toMatchObject({
      buyableCost: 210_720,
      stillToEarn: 210_720,
      silverCost: 32_000_000,
      unverifiedCount: 0,
    });
    expect(findRow(plan, "756001")).toMatchObject({ required: 120, cost: 900 });
    expect(findRow(plan, "5812")).toMatchObject({ required: 144, cost: 11_520 });
    expect(findRow(plan, "5827")).toMatchObject({ required: 400, cost: 6_000 });
    expect(findRow(plan, "5828")).toMatchObject({ required: 180, cost: 5_400 });
    expect(calculatePlan(advanceCatalog, { ...empty, remainingStoneBoxes: 0 }).buyableCost).toBe(
      211_020,
    );
  });

  test("uses owned gear, shared materials, stones, weekly boxes and the balance together", () => {
    const plan = calculatePlan(advanceCatalog, {
      gearLevels: { 49657: 8 },
      owned: { 5827: 150, 756001: 15 },
      remainingStoneBoxes: 2,
      balance: 6_276,
    });
    expect(findRow(plan, "49651").required).toBe(0);
    expect(findRow(plan, "5827")).toMatchObject({ required: 200, missing: 50, cost: 750 });
    expect(findRow(plan, "756001")).toMatchObject({ required: 94, missing: 79, cost: 690 });
    expect(plan).toMatchObject({
      buyableCost: 178_260,
      stillToEarn: 171_984,
      silverCost: 24_000_000,
    });
  });

  test("a complete inventory has no remaining coin, silver, or material costs", () => {
    const plan = calculatePlan(advanceCatalog, {
      gearLevels: { 49655: 10, 49656: 10, 49657: 10, 49658: 10 },
      owned: { 5809: 180, 5812: 144, 5815: 35, 5821: 42, 5831: 35 },
    });
    expect(plan).toMatchObject({ buyableCost: 0, stillToEarn: 0, silverCost: 0 });
    expect(plan.rows.every((row) => row.missing === 0)).toBe(true);
  });

  test("combines shared recipe inputs before deducting owned stock, and rounds batches up", () => {
    const catalog = {
      requirements: { sail: 1, cannon: 1, sheet: 1 },
      gear: [{ id: "sail" }, { id: "cannon" }],
      items: {
        sail: { recipe: { ingredients: { sheet: 3 } } },
        cannon: { recipe: { ingredients: { sheet: 2 } } },
        sheet: { recipe: { quantity: 2, ingredients: { wood: 5 } } },
        wood: { shop: { unitPrice: 40 } },
      },
    };
    const plan = calculatePlan(catalog, { owned: { sheet: 1, wood: 3 } });
    expect(findRow(plan, "sheet")).toMatchObject({ required: 6, missing: 5, status: "craft" });
    expect(findRow(plan, "wood")).toMatchObject({ required: 15, missing: 12, cost: 480 });

    const withSail = calculatePlan(catalog, { owned: { sheet: 1 }, gearLevels: { sail: 10 } });
    expect(findRow(withSail, "sail")).toMatchObject({ missing: 0, status: "owned" });
    expect(findRow(withSail, "sheet")).toMatchObject({ required: 3, missing: 2 });
    expect(findRow(withSail, "wood")).toMatchObject({ required: 5, missing: 5 });
  });

  test("counts only enhancement steps above the equipment's current level", () => {
    const catalog = {
      requirements: { sail: 1 },
      gear: [{ id: "sail" }],
      enhancementSteps: Array.from({ length: 10 }, (_, index) => ({ stone: index + 1 })),
      items: { sail: { recipe: { ingredients: { wood: 1 } } }, wood: {}, stone },
    };
    const partial = calculatePlan(catalog, { gearLevels: { sail: 8 }, owned: { stone: 2 } });
    expect(findRow(partial, "stone")).toMatchObject({ required: 19, missing: 17, cost: 150 });
    expect(findRow(partial, "wood").missing).toBe(0);

    const complete = calculatePlan(catalog, { gearLevels: { sail: 10 } });
    expect(findRow(complete, "stone")).toMatchObject({ required: 0, missing: 0 });
    expect(complete.buyableCost).toBe(0);
  });

  test("skips green gear and its silver cost when the corresponding blue gear is owned", () => {
    const catalog = {
      requirements: { blue: 1 },
      gear: [{ id: "blue" }, { id: "green" }],
      enhancementSteps: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2].map((quantity) => ({ stone: quantity })),
      items: {
        blue: { recipe: { ingredients: { green: 1, wood: 3 } } },
        green: { silverPrice: 8000000 },
        wood: {},
        stone,
      },
    };

    const empty = calculatePlan(catalog, {});
    expect(findRow(empty, "stone").required).toBe(30);
    expect(empty.silverCost).toBe(8000000);

    const greenOwned = calculatePlan(catalog, { gearLevels: { green: 8 } });
    expect(findRow(greenOwned, "stone").required).toBe(19);
    expect(greenOwned.silverCost).toBe(0);

    const blueOwned = calculatePlan(catalog, { gearLevels: { blue: 8 } });
    expect(findRow(blueOwned, "stone").required).toBe(4);
    expect(findRow(blueOwned, "green").required).toBe(0);
    expect(findRow(blueOwned, "wood").required).toBe(0);
    expect(blueOwned.silverCost).toBe(0);
  });

  test("minimizes coin spend without exceeding box limits and prefers no surplus on ties", () => {
    expect(findRow(forStones(15), "stone").purchase).toEqual({
      boxes: 0,
      units: 15,
      bundleQuantity: 20,
    });
    expect(findRow(forStones(16), "stone").purchase).toEqual({
      boxes: 1,
      units: 0,
      bundleQuantity: 20,
    });
    expect(forStones(21).buyableCost).toBe(160);
    expect(forStones(21, { remainingStoneBoxes: 0 }).buyableCost).toBe(210);
    expect(forStones(220, { remainingStoneBoxes: 20 }).buyableCost).toBe(1700);
    expect(forStones(220, { remainingStoneBoxes: 2 }).buyableCost).toBe(2100);
  });

  test("subtracts the Crow Coin balance only from confirmed purchases", () => {
    const result = calculatePlan(
      {
        requirements: { pearl: 16, unknown: 1, loot: 1 },
        gear: [],
        items: {
          pearl: { shop: { unitPrice: 400 } },
          unknown: { shop: { unverified: true } },
          loot: {},
        },
      },
      { balance: 6276 },
    );
    expect(result.buyableCost).toBe(6400);
    expect(result.stillToEarn).toBe(124);
    expect(result.unverifiedCount).toBe(1);
    expect(findRow(result, "unknown")).toMatchObject({ status: "unpriced", cost: null });
    expect(findRow(result, "loot")).toMatchObject({ status: "other", cost: null });
    expect(forStones(1, { balance: 6276 }).stillToEarn).toBe(0);
  });

  test("rejects incomplete or circular catalogs instead of silently dropping requirements", () => {
    expect(() => calculatePlan({ requirements: { missing: 1 }, gear: [], items: {} }, {})).toThrow(
      "Unknown ship upgrade item: missing",
    );
    expect(() =>
      calculatePlan(
        {
          requirements: { wood: 1 },
          gear: [],
          items: { wood: { recipe: { ingredients: { wood: 1 } } } },
        },
        {},
      ),
    ).toThrow("Circular ship upgrade recipe: wood");
  });
});
