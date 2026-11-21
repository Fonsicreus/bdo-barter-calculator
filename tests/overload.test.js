import { describe, expect, test } from "bun:test";
import { BARTER_TIERS } from "../src/data/barterTiers";
import { calculateAutomaticTierChain, calculateTrade } from "../src/utils/calculator";
import { getOverloadCapacity } from "../src/utils/overload";

const trade = {
  shipMaxWeight: 10000,
  currentShipWeight: 0,
  inputTier: BARTER_TIERS[2],
  outputTier: BARTER_TIERS[3],
  ownedQuantity: 10,
  ratioInput: 1,
  ratioOutput: 2,
};
const chain = {
  startTier: 2,
  targetTier: 3,
  startUnits: 10,
  shipMaxWeight: 10000,
  ratios: { 2: { input: 1, output: 2 } },
};

describe("final overload simulation", () => {
  test("uses a provisional maximum of 150% for the ship's actual capacity", () => {
    const limit = getOverloadCapacity(11500);
    expect(limit).toBe(17250);
    expect(getOverloadCapacity(null)).toBeNull();
    const bigTrade = { ...trade, shipMaxWeight: 11500, ratioOutput: 20 };
    expect(calculateTrade({ ...bigTrade, finalCargoLimit: limit }).maxSafeTrades).toBe(0);
    expect(
      calculateTrade({ ...bigTrade, finalCargoLimit: Number.POSITIVE_INFINITY }).maxSafeTrades,
    ).toBe(1);
    const bigChain = { ...chain, shipMaxWeight: 11500, ratios: { 2: { input: 1, output: 20 } } };
    expect(calculateAutomaticTierChain({ ...bigChain, finalCargoLimit: limit }).plan).toBeNull();
    expect(
      calculateAutomaticTierChain({ ...bigChain, finalCargoLimit: Number.POSITIVE_INFINITY }).plan
        .finalCargoWeight,
    ).toBe(18000);
  });
  test("uses normal capacity when disabled", () => {
    expect(calculateTrade(trade).maxSafeTrades).toBe(5);
    expect(calculateAutomaticTierChain(chain).plan.sourceUnits).toBe(5);
  });

  test("only the last exchange may cross normal capacity", () => {
    const result = calculateTrade({ ...trade, finalCargoLimit: 15000 });
    expect(result.maxSafeTrades).toBe(6);
    expect(result.weightAtArrival).toBe(10800);
    expect(result.isOverCapacityAtArrival).toBe(true);
    const plan = calculateAutomaticTierChain({ ...chain, finalCargoLimit: 15000 }).plan;
    expect(plan.sourceUnits).toBe(6);
    expect(plan.finalCargoWeight).toBe(10800);
    expect(plan.remainingCapacityAtPeak).toBe(600);
  });

  test("automatically estimates the maximum final load without a user-entered cap", () => {
    const result = calculateTrade({ ...trade, finalCargoLimit: Number.POSITIVE_INFINITY });
    expect(result.maxSafeTrades).toBe(6);
    expect(result.weightAtArrival).toBe(10800);
    const plan = calculateAutomaticTierChain({
      ...chain,
      finalCargoLimit: Number.POSITIVE_INFINITY,
    }).plan;
    expect(plan.sourceUnits).toBe(6);
    expect(plan.finalCargoWeight).toBe(10800);
    expect(plan.remainingCapacityAtPeak).toBe(600);
  });

  test("respects the chosen final limit and never starts overloaded", () => {
    expect(calculateTrade({ ...trade, finalCargoLimit: 10500 }).maxSafeTrades).toBe(5);
    expect(
      calculateTrade({ ...trade, currentShipWeight: 10001, finalCargoLimit: 15000 }).maxSafeTrades,
    ).toBe(0);
    expect(
      calculateAutomaticTierChain({ ...chain, preloadedCargoWeight: 10001, finalCargoLimit: 15000 })
        .failureReason,
    ).toBe("departure_capacity");
  });

  test("does not overload an earlier chain leg", () => {
    const result = calculateAutomaticTierChain({
      ...chain,
      targetTier: 4,
      finalCargoLimit: 15000,
      ratios: { ...chain.ratios, 3: { input: 1, output: 2 } },
    });
    expect(result.plan.furthestTier).toBe(4);
    expect(result.plan.steps[0].weightAfter).toBeLessThanOrEqual(10000);
    expect(
      result.plan.steps[1].weightBefore + (result.plan.steps[1].tradeCount - 1) * 1100,
    ).toBeLessThanOrEqual(10000);
    expect(result.plan.finalCargoWeight).toBeLessThanOrEqual(15000);
  });
});
