import { describe, expect, test } from "bun:test";
import { simulateRoute } from "../src/utils/calculator";

const makeStop = (
  inputTierLevel,
  outputTierLevel,
  ratioInput,
  ratioOutput,
  tradeCount = 1,
  reusePrevious = true,
) => ({ inputTierLevel, outputTierLevel, ratioInput, ratioOutput, tradeCount, reusePrevious });

describe("mixed multi-trade routes", () => {
  test("links one tier chain while loading an independent level 6 trade at the start", () => {
    const stops = [makeStop(1, 2, 1, 2), makeStop(2, 3, 1, 3), makeStop(6, 7, 1, 1)];
    const route = simulateRoute(stops, 19300, 0, true);
    expect(route.initialGoods).toEqual([
      { tier: 1, units: 1 },
      { tier: 6, units: 1 },
    ]);
    expect(route.initialLoadWeight).toBe(2100);
    expect(route.stopsSummary.map((stop) => [stop.weightBefore, stop.weightAfter])).toEqual([
      [2100, 2800],
      [2800, 5100],
      [5100, 5100],
    ]);
    expect(route.stopsSummary[1].inputFromPrevious).toBe(1);
    expect(route.finalGoods).toEqual([
      { tier: 2, units: 1 },
      { tier: 3, units: 3 },
      { tier: 7, units: 1 },
    ]);
    expect(route.isSafe).toBe(true);
  });

  test("can load separate items even when an earlier stop produced the same tier", () => {
    const route = simulateRoute(
      [makeStop(1, 2, 1, 2), makeStop(2, 3, 1, 3, 1, false)],
      19300,
      0,
      true,
    );
    expect(route.initialGoods).toEqual([
      { tier: 1, units: 1 },
      { tier: 2, units: 1 },
    ]);
    expect(route.stopsSummary[1].inputFromPrevious).toBe(0);
    expect(route.finalGoods).toEqual([
      { tier: 2, units: 2 },
      { tier: 3, units: 3 },
    ]);
    expect(route.totalCargoWeight).toBe(3500);
  });

  test("loads the shortfall at the first port and flags excess at any stop", () => {
    const route = simulateRoute([makeStop(1, 2, 1, 2), makeStop(2, 3, 1, 3, 3)], 4000, 0, true);
    expect(route.initialGoods).toEqual([
      { tier: 1, units: 1 },
      { tier: 2, units: 1 },
    ]);
    expect(route.stopsSummary[1].inputFromPrevious).toBe(2);
    expect(route.stopsSummary[1].weightAfter).toBe(8100);
    expect(route.isOverweight).toBe(true);
    expect(route.isSafe).toBe(false);
  });

  test("permits provisional overload only on the final exchange and below 150%", () => {
    const finalTrade = makeStop(1, 2, 1, 3, 10);
    const allowed = simulateRoute([finalTrade], 11500, 0, true, 17250);
    expect(allowed.totalCargoWeight).toBe(12000);
    expect(allowed.hasFinalOverload).toBe(true);
    expect(allowed.isOverweight).toBe(false);
    const disabled = simulateRoute([finalTrade], 11500, 0, true);
    expect(disabled.isOverweight).toBe(true);
    const beforeFinal = simulateRoute([finalTrade, makeStop(6, 7, 1, 1)], 11500, 0, true, 17250);
    expect(beforeFinal.isOverweight).toBe(true);
    const tooMany = simulateRoute([makeStop(1, 2, 1, 3, 11)], 11500, 0, true, 17250);
    expect(tooMany.stopsSummary[0].tooHeavyBeforeLast).toBe(true);
    expect(tooMany.isOverweight).toBe(true);
  });
});
