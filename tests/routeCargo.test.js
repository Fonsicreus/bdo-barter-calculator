import { describe, expect, test } from "bun:test";
import { simulateRoute } from "../src/utils/calculator";
import { getRouteCargoMetrics } from "../src/utils/routeCargo";

const stop = (inputTierLevel, outputTierLevel, ratioInput, ratioOutput, tradeCount = 1) => ({
  inputTierLevel,
  outputTierLevel,
  ratioInput,
  ratioOutput,
  tradeCount,
});

describe("route cargo overview", () => {
  test("finds the peak and the space available for the entire mixed route", () => {
    const route = simulateRoute(
      [stop(1, 2, 1, 2), stop(2, 3, 1, 3), stop(6, 7, 1, 1)],
      19300,
      0,
      true,
    );
    expect(getRouteCargoMetrics(route, 19300, null)).toEqual({
      peakWeight: 5100,
      additionalCargo: 14200,
    });
    const withSupplies = simulateRoute(
      [stop(1, 2, 1, 2), stop(2, 3, 1, 3), stop(6, 7, 1, 1)],
      19300,
      2000,
      true,
    );
    expect(getRouteCargoMetrics(withSupplies, 19300, null)).toEqual({
      peakWeight: 7100,
      additionalCargo: 12200,
    });
  });

  test("checks the normal limit before the final offer and the overload limit after it", () => {
    const route = simulateRoute([stop(1, 2, 1, 3, 10)], 11500, 0, true, 17250);
    expect(getRouteCargoMetrics(route, 11500, 17250)).toEqual({
      peakWeight: 12000,
      additionalCargo: 5250,
    });
  });

  test("does not claim extra capacity for overloaded or unknown routes", () => {
    const overloaded = simulateRoute([stop(1, 2, 1, 3, 15)], 11500, 0, true, 17250);
    expect(getRouteCargoMetrics(overloaded, 11500, 17250)).toEqual({
      peakWeight: 18000,
      additionalCargo: null,
    });
    const unknown = simulateRoute([stop("ship_materials", 2, 1, 1)], 11500, 0, true);
    expect(getRouteCargoMetrics(unknown, 11500, null)).toEqual({
      peakWeight: null,
      additionalCargo: null,
    });
    const invalid = simulateRoute([stop(1, 2, 1, 2)], null, 0, false);
    expect(getRouteCargoMetrics(invalid, null, null)).toEqual({
      peakWeight: null,
      additionalCargo: null,
    });
  });
});
