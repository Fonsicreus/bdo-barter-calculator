import { BARTER_TIERS } from "../data/barterTiers";

// Converts starting goods into successive planned stops. Unused output remains
// aboard; the first stop may consume goods produced by the existing route.
export function buildRouteChain({ startTier, targetTier, quantity, ratios, reusePrevious = true }) {
  if (
    !Number.isInteger(startTier) ||
    !Number.isInteger(targetTier) ||
    startTier < 0 ||
    targetTier > 7 ||
    targetTier <= startTier ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    return { stops: [], error: "invalid_input" };
  }
  let available = quantity;
  const stops = [];
  for (let tier = startTier; tier < targetTier; tier++) {
    const ratio = ratios[tier];
    if (
      !Number.isSafeInteger(ratio?.input) ||
      ratio.input <= 0 ||
      !Number.isSafeInteger(ratio?.output) ||
      ratio.output <= 0
    ) {
      return { stops: [], error: "invalid_ratio", tier };
    }
    if (
      ratio.offerLimit != null &&
      (!Number.isSafeInteger(ratio.offerLimit) || ratio.offerLimit < 0)
    ) {
      return { stops: [], error: "invalid_limit", tier };
    }
    const tradeCount = Math.min(
      Math.floor(available / ratio.input),
      ratio.offerLimit ?? Number.POSITIVE_INFINITY,
    );
    if (!tradeCount && ratio.offerLimit === 0) return { stops: [], error: "offer_exhausted", tier };
    if (!tradeCount)
      return { stops: [], error: "insufficient_goods", tier, available, required: ratio.input };
    const output = tradeCount * ratio.output;
    if (!Number.isSafeInteger(output)) return { stops: [], error: "quantity_overflow", tier };
    stops.push({
      inputTierLevel: tier,
      outputTierLevel: tier + 1,
      ratioInput: ratio.input,
      ratioOutput: ratio.output,
      tradeCount,
      inputUnitWeight: tier === 0 ? 0 : BARTER_TIERS[tier].unitWeight,
      outputUnitWeight: BARTER_TIERS[tier + 1].unitWeight,
      reusePrevious: tier === startTier ? reusePrevious : true,
    });
    available = output;
  }
  return { stops, error: null };
}
