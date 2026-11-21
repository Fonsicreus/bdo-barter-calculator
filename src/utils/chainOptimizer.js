// Calculate the smallest source load for a requested number of final exchanges.
// Extra intermediate goods remain on board and are included in each weight check.
function buildPlan({
  startTier,
  endTier,
  finalTrades,
  ratios,
  weights,
  cargo,
  capacity,
  finalCapacity,
  stock,
}) {
  const counts = {};
  let required = finalTrades * ratios[endTier - 1].output;
  if (!Number.isSafeInteger(required)) return null;

  for (let tier = endTier - 1; tier >= startTier; tier--) {
    const ratio = ratios[tier];
    const count = Math.ceil(required / ratio.output);
    if (!Number.isSafeInteger(count) || (ratio.offerLimit !== null && count > ratio.offerLimit)) {
      return null;
    }
    counts[tier] = count;
    required = count * ratio.input;
    if (!Number.isSafeInteger(required)) return null;
  }

  if (required > stock) return null;
  const inventory = Array(8).fill(0);
  inventory[startTier] = required;
  const sourceUnits = required;
  let weight = cargo + required * weights[startTier];
  if (!Number.isFinite(weight) || weight > capacity) return null;
  const startCargoWeight = weight;
  let maxCargoWeight = weight;
  let extraCargoAllowance = capacity - weight;
  const steps = [];

  for (let tier = startTier; tier < endTier; tier++) {
    const ratio = ratios[tier];
    const tradeCount = counts[tier];
    const inputUnits = tradeCount * ratio.input;
    const outputUnits = tradeCount * ratio.output;
    if (!Number.isSafeInteger(outputUnits) || inventory[tier] < inputUnits) return null;
    const weightBefore = weight;
    const delta = ratio.output * weights[tier + 1] - ratio.input * weights[tier];
    const beforeLast = weightBefore + Math.max(0, delta) * (tradeCount - 1);
    if (!Number.isFinite(beforeLast) || beforeLast > capacity) return null;
    extraCargoAllowance = Math.min(extraCargoAllowance, capacity - beforeLast);
    inventory[tier] -= inputUnits;
    inventory[tier + 1] += outputUnits;
    weight = cargo;
    for (let index = startTier; index <= endTier; index++) {
      weight += inventory[index] * weights[index];
    }
    const stageLimit = tier === endTier - 1 ? finalCapacity : capacity;
    if (!Number.isFinite(weight) || weight > stageLimit) return null;
    extraCargoAllowance = Math.min(extraCargoAllowance, stageLimit - weight);
    maxCargoWeight = Math.max(maxCargoWeight, weight);
    steps.push({
      fromTier: tier,
      toTier: tier + 1,
      ratioInput: ratio.input,
      ratioOutput: ratio.output,
      tradeCount,
      inputUnits,
      outputUnits,
      remainingInputUnits: inventory[tier],
      weightBefore,
      weightAfter: weight,
      remainingCapacity: Math.max(0, capacity - weight),
    });
  }

  return {
    startTier,
    sourceUnits,
    furthestTier: endTier,
    startCargoWeight,
    finalCargoWeight: weight,
    maxCargoWeight,
    remainingCapacityAtPeak: Math.max(0, extraCargoAllowance),
    steps,
    remainingGoods: inventory
      .map((units, tier) => ({ tier, units, unitWeight: weights[tier] ?? null }))
      .filter((good) => good.units > 0),
  };
}

// With non-negative exchange weight changes, every stage's weight and every
// required trade count are monotone, so binary search finds the optimal batch.
// Weight-reducing custom ratios require exhaustive search instead.
function findBestPlan(options) {
  const { startTier, endTier, stock, ratios, weights, cargo, capacity, finalCapacity } = options;
  let possible = Math.min(stock, Math.floor(Math.max(0, capacity - cargo) / weights[startTier]));
  let monotone = true;
  for (let tier = startTier; tier < endTier; tier++) {
    const ratio = ratios[tier];
    let trades = Math.floor(possible / ratio.input);
    if (ratio.offerLimit !== null) trades = Math.min(trades, ratio.offerLimit);
    possible = Math.min(Number.MAX_SAFE_INTEGER, trades * ratio.output);
    if (ratio.output * weights[tier + 1] < ratio.input * weights[tier]) monotone = false;
  }
  const lastRatio = ratios[endTier - 1];
  let upper = Math.min(
    Math.floor(possible / lastRatio.output),
    Math.floor(Math.max(0, finalCapacity - cargo) / weights[endTier] / lastRatio.output),
  );
  if (!monotone && upper > 200000) return { searchLimit: true, plan: null };

  let best = null;
  if (!monotone) {
    while (upper > 0) {
      best = buildPlan({ ...options, finalTrades: upper });
      if (best) break;
      upper--;
    }
  } else {
    let low = 1;
    while (low <= upper) {
      const midpoint = low + Math.floor((upper - low) / 2);
      const candidate = buildPlan({ ...options, finalTrades: midpoint });
      if (candidate) {
        best = candidate;
        low = midpoint + 1;
      } else {
        upper = midpoint - 1;
      }
    }
  }
  return { plan: best, searchLimit: false };
}

export function optimizeTierChain({
  startTier,
  targetTier,
  startUnits,
  ratios,
  tierWeights,
  preloadedCargoWeight,
  shipMaxWeight,
  finalCargoLimit = null,
}) {
  if (startUnits === 0 || preloadedCargoWeight > shipMaxWeight) {
    return {
      plan: null,
      failureReason: startUnits === 0 ? "no_start_goods" : "departure_capacity",
    };
  }

  for (let endTier = targetTier; endTier > startTier; endTier--) {
    const result = findBestPlan({
      startTier,
      endTier,
      stock: startUnits,
      ratios,
      weights: tierWeights,
      cargo: preloadedCargoWeight,
      capacity: shipMaxWeight,
      finalCapacity:
        typeof finalCargoLimit === "number" && finalCargoLimit > shipMaxWeight
          ? finalCargoLimit
          : shipMaxWeight,
    });
    if (result.searchLimit) return { plan: null, failureReason: "search_limit" };
    if (result.plan) {
      return {
        plan: {
          ...result.plan,
          targetTier,
          availableUnits: startUnits,
          unitsLeftInStorage: startUnits - result.plan.sourceUnits,
          stopReason: endTier === targetTier ? "target_tier" : "target_unreachable",
        },
        failureReason: null,
      };
    }
  }
  return { plan: null, failureReason: "no_safe_trade" };
}
