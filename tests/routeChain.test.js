import { describe, expect, test } from "bun:test";
import { simulateRoute } from "../src/utils/calculator";
import { buildRouteChain } from "../src/utils/routeChain";

describe("automatic route chain", () => {
  test("builds all steps with the selected ratios and can be mixed with an independent trade", () => {
    const result = buildRouteChain({
      startTier: 1,
      targetTier: 3,
      quantity: 1,
      ratios: { 1: { input: 1, output: 2 }, 2: { input: 1, output: 3 } },
    });
    expect(result.error).toBeNull();
    expect(result.stops.map((stop) => stop.tradeCount)).toEqual([1, 2]);
    expect(result.stops.map((stop) => stop.reusePrevious)).toEqual([true, true]);
    const independent = buildRouteChain({
      startTier: 6,
      targetTier: 7,
      quantity: 1,
      ratios: { 6: { input: 1, output: 1 } },
      reusePrevious: false,
    });
    const route = simulateRoute([...result.stops, ...independent.stops], 19300, 0, true);
    expect(route.initialGoods).toEqual([
      { tier: 1, units: 1 },
      { tier: 6, units: 1 },
    ]);
    expect(route.finalGoods).toEqual([
      { tier: 3, units: 6 },
      { tier: 7, units: 1 },
    ]);
    expect(route.totalCargoWeight).toBe(7400);
  });

  test("keeps intermediate remainders on board and uses separate source stock when selected", () => {
    const result = buildRouteChain({
      startTier: 1,
      targetTier: 3,
      quantity: 1,
      ratios: { 1: { input: 1, output: 3 }, 2: { input: 2, output: 1 } },
      reusePrevious: false,
    });
    expect(result.stops[0].reusePrevious).toBe(false);
    expect(result.stops[1].reusePrevious).toBe(true);
    const route = simulateRoute(result.stops, 19300, 0, true);
    expect(route.finalGoods).toEqual([
      { tier: 2, units: 1 },
      { tier: 3, units: 1 },
    ]);
  });

  test("rejects invalid, incomplete and overflowing requests", () => {
    expect(buildRouteChain({ startTier: 1, targetTier: 3, quantity: 0, ratios: {} }).error).toBe(
      "invalid_input",
    );
    expect(
      buildRouteChain({
        startTier: 1,
        targetTier: 2,
        quantity: 1,
        ratios: { 1: { input: 0, output: 2 } },
      }).error,
    ).toBe("invalid_ratio");
    expect(
      buildRouteChain({
        startTier: 1,
        targetTier: 2,
        quantity: 1,
        ratios: { 1: { input: 2, output: 1 } },
      }).error,
    ).toBe("insufficient_goods");
    expect(
      buildRouteChain({
        startTier: 1,
        targetTier: 2,
        quantity: Number.MAX_SAFE_INTEGER,
        ratios: { 1: { input: 1, output: 2 } },
      }).error,
    ).toBe("quantity_overflow");
  });

  test("applies an offer-specific cap and retains intermediate surplus", () => {
    const result = buildRouteChain({
      startTier: 1,
      targetTier: 3,
      quantity: 1,
      ratios: { 1: { input: 1, output: 3 }, 2: { input: 1, output: 2, offerLimit: 1 } },
    });
    expect(result.error).toBeNull();
    expect(result.stops.map((stop) => stop.tradeCount)).toEqual([1, 1]);
    const route = simulateRoute(result.stops, 19300, 0, true);
    expect(route.finalGoods).toEqual([
      { tier: 2, units: 2 },
      { tier: 3, units: 2 },
    ]);
    expect(
      buildRouteChain({
        startTier: 1,
        targetTier: 2,
        quantity: 1,
        ratios: { 1: { input: 1, output: 2, offerLimit: 0 } },
      }).error,
    ).toBe("offer_exhausted");
    expect(
      buildRouteChain({
        startTier: 1,
        targetTier: 2,
        quantity: 1,
        ratios: { 1: { input: 1, output: 2, offerLimit: -1 } },
      }).error,
    ).toBe("invalid_limit");
  });
});
