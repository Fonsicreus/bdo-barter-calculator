import { describe, expect, test } from "bun:test";
import { calculateAutomaticTierChain } from "../src/utils/calculator";

const defaults = {
  startTier: 2,
  targetTier: 5,
  startUnits: 10,
  shipMaxWeight: 10000,
  preloadedCargoWeight: 0,
  ratios: { 2: { input: 1, output: 2 }, 3: { input: 1, output: 2 }, 4: { input: 1, output: 1 } },
};
const calculate = (overrides = {}) => calculateAutomaticTierChain({ ...defaults, ...overrides });

describe("optimized barter chains", () => {
  test("recommends only the starting goods needed to maximize the target", () => {
    const { plan } = calculate();
    expect(plan.sourceUnits).toBe(2);
    expect(plan.unitsLeftInStorage).toBe(8);
    expect(plan.remainingGoods).toEqual([{ tier: 5, units: 8, unitWeight: 1000 }]);
    expect(plan.steps.map((step) => step.weightAfter)).toEqual([3600, 8000, 8000]);
    expect(plan.remainingCapacityAtPeak).toBe(2000);
  });

  test("counts prior cargo and unused intermediate outputs", () => {
    const { plan } = calculate({
      targetTier: 4,
      startUnits: 10,
      preloadedCargoWeight: 500,
      shipMaxWeight: 5000,
      ratios: { 2: { input: 1, output: 3 }, 3: { input: 2, output: 1 } },
    });
    expect(plan.sourceUnits).toBe(1);
    expect(plan.remainingGoods).toEqual([
      { tier: 3, units: 1, unitWeight: 900 },
      { tier: 4, units: 1, unitWeight: 1000 },
    ]);
    expect(plan.maxCargoWeight).toBe(3200);
  });

  test("respects offer limits and explains when the requested tier is unreachable", () => {
    const limited = calculate({
      ratios: { ...defaults.ratios, 3: { input: 1, output: 2, offerLimit: 1 } },
    });
    expect(limited.plan.sourceUnits).toBe(1);
    expect(limited.plan.remainingGoods).toEqual([
      { tier: 3, units: 1, unitWeight: 900 },
      { tier: 5, units: 2, unitWeight: 1000 },
    ]);
    const blocked = calculate({
      ratios: { ...defaults.ratios, 3: { input: 1, output: 2, offerLimit: 0 } },
    });
    expect(blocked.plan.furthestTier).toBe(3);
    expect(blocked.plan.stopReason).toBe("target_unreachable");
  });

  test("handles weight-reducing ratios, empty stock and overloaded cargo", () => {
    const reducing = calculate({
      startTier: 3,
      targetTier: 4,
      startUnits: 8,
      shipMaxWeight: 4000,
      ratios: { 3: { input: 2, output: 1 } },
    });
    expect(reducing.plan.sourceUnits).toBe(4);
    expect(reducing.plan.remainingGoods[0].units).toBe(2);
    expect(calculate({ startUnits: 0 }).failureReason).toBe("no_start_goods");
    expect(calculate({ preloadedCargoWeight: 10001 }).failureReason).toBe("departure_capacity");
  });

  test("matches exhaustive enumeration for small custom offers", () => {
    for (const first of [
      { input: 1, output: 2 },
      { input: 2, output: 1 },
      { input: 2, output: 3 },
    ]) {
      for (const second of [
        { input: 1, output: 2 },
        { input: 2, output: 1 },
        { input: 2, output: 3 },
      ]) {
        for (const capacity of [2000, 3500, 5000, 8000]) {
          let bestOutput = 0;
          let bestLoad = Number.POSITIVE_INFINITY;
          for (let load = 1; load <= 6; load++) {
            for (let a = 1; a <= Math.floor(load / first.input); a++) {
              const remainingStart = load - a * first.input;
              const intermediate = a * first.output;
              const departure = load * 900;
              const afterFirst = remainingStart * 900 + intermediate * 1000;
              for (let b = 1; b <= Math.floor(intermediate / second.input); b++) {
                const output = b * second.output;
                const afterSecond =
                  remainingStart * 900 + (intermediate - b * second.input) * 1000 + output * 1000;
                if (Math.max(departure, afterFirst, afterSecond) > capacity) continue;
                if (output > bestOutput || (output === bestOutput && load < bestLoad)) {
                  bestOutput = output;
                  bestLoad = load;
                }
              }
            }
          }
          const { plan } = calculate({
            startTier: 3,
            targetTier: 5,
            startUnits: 6,
            shipMaxWeight: capacity,
            ratios: { 3: first, 4: second },
          });
          if (bestOutput === 0) {
            expect(plan?.furthestTier ?? 3).toBeLessThan(5);
          } else {
            expect(plan.furthestTier).toBe(5);
            expect(plan.remainingGoods.find((good) => good.tier === 5).units).toBe(bestOutput);
            expect(plan.sourceUnits).toBe(bestLoad);
          }
        }
      }
    }
  });
});
