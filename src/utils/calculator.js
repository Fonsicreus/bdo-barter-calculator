import { BARTER_TIERS } from "../data/barterTiers";
import { optimizeTierChain } from "./chainOptimizer";

/**
 * Calculates the largest safe exchange count for a single barter offer.
 *
 * `currentShipWeight` is pre-loaded cargo only. It must exclude the input goods
 * for this exchange, because those are added on top when the ship departs.
 */
export function calculateTrade(params) {
  const {
    shipMaxWeight,
    finalCargoLimit = null,
    currentShipWeight,
    inputTier,
    outputTier,
    ownedQuantity,
    ratioInput,
    ratioOutput,
    offerMaxTrades,
    shipCapacityValid = true,
  } = params;

  const safeCurrentWeight =
    Number.isFinite(currentShipWeight) && currentShipWeight > 0 ? currentShipWeight : 0;
  const safeOwnedQuantity = Number.isFinite(ownedQuantity) && ownedQuantity > 0 ? ownedQuantity : 0;

  const needsUnitWeight = [inputTier, outputTier].some(
    (tier) =>
      !Number.isFinite(tier?.unitWeight) ||
      tier.unitWeight < 0 ||
      (tier.unitWeight === 0 && tier.id !== "crow_coins" && tier.id !== 0),
  );
  const needsRatio = [ratioInput, ratioOutput].some(
    (ratio) => !Number.isInteger(ratio) || ratio <= 0,
  );
  const hasOfferLimit = typeof offerMaxTrades === "number";
  const needsOfferLimit =
    hasOfferLimit && (!Number.isInteger(offerMaxTrades) || offerMaxTrades <= 0);
  const needsShipCapacity =
    !shipCapacityValid || !Number.isFinite(shipMaxWeight) || shipMaxWeight <= 0;

  if (needsUnitWeight || needsRatio || needsOfferLimit || needsShipCapacity) {
    const currentPercentage =
      !needsShipCapacity && safeCurrentWeight > 0
        ? Math.round((safeCurrentWeight / shipMaxWeight) * 100)
        : 0;
    const remainingCapacity = needsShipCapacity
      ? 0
      : Math.max(0, shipMaxWeight - safeCurrentWeight);
    const overCapacity = needsShipCapacity ? 0 : Math.max(0, safeCurrentWeight - shipMaxWeight);

    return {
      maxSafeTrades: 0,
      recommendedInputCount: 0,
      expectedOutputCount: 0,
      weightAtDeparture: safeCurrentWeight,
      weightAtArrival: safeCurrentWeight,
      netWeightChange: 0,
      remainingCapacityAtDeparture: remainingCapacity,
      remainingCapacityAtArrival: remainingCapacity,
      overCapacityAtDeparture: overCapacity,
      overCapacityAtArrival: overCapacity,
      departurePercentage: currentPercentage,
      arrivalPercentage: currentPercentage,
      isOverCapacityAtDeparture: !needsShipCapacity && safeCurrentWeight > shipMaxWeight,
      isOverCapacityAtArrival: !needsShipCapacity && safeCurrentWeight > shipMaxWeight,
      limitingFactor: needsShipCapacity ? "invalid_ship_capacity" : "missing_inputs",
      needsUnitWeight,
      needsRatio,
      needsOfferLimit,
      needsShipCapacity,
    };
  }

  // Pre-loaded cargo is already on board. Input goods are loaded in addition,
  // and outputs replace those inputs after the exchange.
  const availableWeight = Math.max(0, shipMaxWeight - safeCurrentWeight);

  const inputWeightPerExchange = ratioInput * inputTier.unitWeight;
  const outputWeightPerExchange = ratioOutput * outputTier.unitWeight;

  // Max exchanges possible based on owned materials.
  const maxByOwned = ratioInput > 0 ? Math.floor(safeOwnedQuantity / ratioInput) : 0;

  // Max exchanges before exceeding departure capacity with the input goods.
  const maxByDeparture =
    inputWeightPerExchange > 0
      ? Math.floor(availableWeight / inputWeightPerExchange)
      : Number.POSITIVE_INFINITY;

  // Max exchanges before exceeding arrival capacity with the received goods.
  const finalLimit =
    typeof finalCargoLimit === "number" && finalCargoLimit > shipMaxWeight
      ? finalCargoLimit
      : shipMaxWeight;
  const maxByArrival =
    outputWeightPerExchange > 0
      ? Math.floor(Math.max(0, finalLimit - safeCurrentWeight) / outputWeightPerExchange)
      : Number.POSITIVE_INFINITY;

  // Max exchanges allowed by this specific offer's remaining exchange cap.
  // This is offer-specific data, not an island-wide node rule.
  const maxByOffer =
    hasOfferLimit && offerMaxTrades > 0 ? offerMaxTrades : Number.POSITIVE_INFINITY;

  const limits = [
    { factor: "offer_limit", value: maxByOffer },
    { factor: "arrival_weight", value: maxByArrival },
    { factor: "departure_weight", value: maxByDeparture },
    { factor: "owned_quantity", value: maxByOwned },
  ];

  const maxSafeTrades =
    safeCurrentWeight > shipMaxWeight
      ? 0
      : Math.max(0, Math.min(...limits.map((limit) => limit.value)));

  let limitingFactor = "owned_quantity";
  if (maxSafeTrades === 0) {
    if (safeCurrentWeight > shipMaxWeight) {
      limitingFactor = "already_overloaded";
    } else if (availableWeight <= 0) {
      limitingFactor = "no_free_capacity";
    } else if (safeOwnedQuantity < ratioInput) {
      limitingFactor = "no_owned_stock";
    } else {
      limitingFactor = "no_safe_trades";
    }
  } else {
    const minLimit = Math.min(...limits.map((limit) => limit.value));
    limitingFactor = limits.find((limit) => limit.value === minLimit)?.factor ?? "owned_quantity";
  }

  const recommendedInputCount = maxSafeTrades * ratioInput;
  const expectedOutputCount = maxSafeTrades * ratioOutput;

  const cargoDepartureWeight = recommendedInputCount * inputTier.unitWeight;
  const cargoArrivalWeight = expectedOutputCount * outputTier.unitWeight;

  const weightAtDeparture = safeCurrentWeight + cargoDepartureWeight;
  const weightAtArrival = safeCurrentWeight + cargoArrivalWeight;
  const netWeightChange = cargoArrivalWeight - cargoDepartureWeight;

  const remainingCapacityAtDeparture = Math.max(0, shipMaxWeight - weightAtDeparture);
  const remainingCapacityAtArrival = Math.max(0, shipMaxWeight - weightAtArrival);
  const overCapacityAtDeparture = Math.max(0, weightAtDeparture - shipMaxWeight);
  const overCapacityAtArrival = Math.max(0, weightAtArrival - shipMaxWeight);

  const departurePercentage = Math.round((weightAtDeparture / shipMaxWeight) * 100);
  const arrivalPercentage = Math.round((weightAtArrival / shipMaxWeight) * 100);

  return {
    maxSafeTrades,
    recommendedInputCount,
    expectedOutputCount,
    weightAtDeparture,
    weightAtArrival,
    netWeightChange,
    remainingCapacityAtDeparture,
    remainingCapacityAtArrival,
    overCapacityAtDeparture,
    overCapacityAtArrival,
    departurePercentage,
    arrivalPercentage,
    isOverCapacityAtDeparture: weightAtDeparture > shipMaxWeight,
    isOverCapacityAtArrival: weightAtArrival > shipMaxWeight,
    limitingFactor,
    needsUnitWeight: false,
    needsRatio: false,
    needsOfferLimit: false,
    needsShipCapacity: false,
  };
}

function normalizeCount(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function resolveUnitWeight(explicitWeight, tierLevel) {
  if (Number.isFinite(explicitWeight) && explicitWeight > 0) {
    return explicitWeight;
  }

  const tier = BARTER_TIERS[tierLevel];
  const tierWeight = tier?.unitWeight;
  if (tierLevel === 0) return 0;
  const isValidZeroWeight = tierWeight === 0 && tier.id === "crow_coins";
  return Number.isFinite(tierWeight) && (tierWeight > 0 || isValidZeroWeight) ? tierWeight : null;
}

/**
 * Simulates a chained barter route.
 *
 * Barter islands do not offer storage, so input goods that are not produced by
 * an earlier stop are counted as loaded at the first port. Outputs remain on
 * board and can satisfy later stops that require the same tier. Every stop is
 * checked before the exchange (departure weight) and after it (arrival weight).
 */
export function simulateRoute(
  stops,
  shipMaxWeight,
  initialCargoWeight = 0,
  shipCapacityValid = true,
  finalCargoLimit = null,
) {
  const safeInitialCargo =
    Number.isFinite(initialCargoWeight) && initialCargoWeight > 0 ? initialCargoWeight : 0;
  const isCapacityValid = shipCapacityValid && Number.isFinite(shipMaxWeight) && shipMaxWeight > 0;

  const stopPlans = [];
  const availableUnits = new Map();
  const initialInputs = new Map();
  let initialLoadWeight = 0;
  let isInitialLoadKnown = true;
  let hasMissingWeights = false;

  for (const stop of stops) {
    const inputGiven = normalizeCount(stop.tradeCount) * normalizeCount(stop.ratioInput);
    const outputReceived = normalizeCount(stop.tradeCount) * normalizeCount(stop.ratioOutput);
    const inputUnitWeight = resolveUnitWeight(stop.inputUnitWeight, stop.inputTierLevel);
    const outputUnitWeight = resolveUnitWeight(stop.outputUnitWeight, stop.outputTierLevel);

    const unitsAvailable = availableUnits.get(stop.inputTierLevel) ?? 0;
    const inputFromPrevious =
      stop.reusePrevious === false ? 0 : Math.min(inputGiven, unitsAvailable);
    const inputLoadedUnits = inputGiven - inputFromPrevious;
    if (inputLoadedUnits > 0) {
      const current = initialInputs.get(stop.inputTierLevel) ?? 0;
      initialInputs.set(stop.inputTierLevel, current + inputLoadedUnits);
    }

    let inputLoadedWeight = null;
    if (inputUnitWeight !== null) {
      inputLoadedWeight = inputLoadedUnits * inputUnitWeight;
      initialLoadWeight += inputLoadedWeight;
    } else if (inputLoadedUnits > 0) {
      isInitialLoadKnown = false;
    }

    // Inputs consumed at this stop are no longer available for later stops.
    availableUnits.set(stop.inputTierLevel, unitsAvailable - inputFromPrevious);
    // Outputs go into the same pool and can be reused by a later stop.
    availableUnits.set(
      stop.outputTierLevel,
      (availableUnits.get(stop.outputTierLevel) ?? 0) + outputReceived,
    );

    if (inputUnitWeight === null || outputUnitWeight === null) {
      hasMissingWeights = true;
    }

    stopPlans.push({
      stop,
      inputGiven,
      outputReceived,
      inputUnitWeight,
      outputUnitWeight,
      inputFromPrevious,
      inputLoadedUnits,
      inputLoadedWeight,
    });
  }

  const minimumStartWeight = safeInitialCargo + initialLoadWeight;
  const startWeight = isInitialLoadKnown ? minimumStartWeight : null;
  let currentWeight = startWeight;
  let weightKnown = startWeight !== null;
  let isOverweight = false;
  let overweightAtStart = false;
  let hasFinalOverload = false;

  // Even when some input weights are unknown, the known portion can already
  // prove that the first departure is overloaded.
  if (isCapacityValid && minimumStartWeight > shipMaxWeight) {
    overweightAtStart = true;
    isOverweight = true;
  }

  const stopsSummary = stopPlans.map((plan, index) => {
    const weightBefore = currentWeight;
    const departureOverCapacity =
      isCapacityValid && weightBefore !== null && weightBefore > shipMaxWeight;

    const inputTotalWeight =
      plan.inputUnitWeight === null ? null : plan.inputGiven * plan.inputUnitWeight;
    const outputTotalWeight =
      plan.outputUnitWeight === null ? null : plan.outputReceived * plan.outputUnitWeight;

    const weightAfter =
      weightKnown && inputTotalWeight !== null && outputTotalWeight !== null
        ? Math.max(0, currentWeight - inputTotalWeight + outputTotalWeight)
        : null;

    if (weightAfter === null) {
      weightKnown = false;
      currentWeight = null;
    } else {
      currentWeight = weightAfter;
    }

    const arrivalOverCapacity =
      isCapacityValid && weightAfter !== null && weightAfter > shipMaxWeight;

    const finalOverloadAllowed =
      index === stopPlans.length - 1 &&
      arrivalOverCapacity &&
      Number.isFinite(finalCargoLimit) &&
      finalCargoLimit > shipMaxWeight &&
      weightAfter <= finalCargoLimit &&
      !departureOverCapacity;
    if (finalOverloadAllowed) hasFinalOverload = true;

    if (departureOverCapacity || (arrivalOverCapacity && !finalOverloadAllowed)) {
      isOverweight = true;
    }

    return {
      ...plan,
      weightBefore,
      weightAfter,
      isOverCapacityAtDeparture: departureOverCapacity,
      isOverCapacityAtArrival: arrivalOverCapacity,
      finalOverloadAllowed,
      overCapacityAtDeparture:
        isCapacityValid && weightBefore !== null ? Math.max(0, weightBefore - shipMaxWeight) : 0,
      overCapacityAtArrival:
        isCapacityValid && weightAfter !== null ? Math.max(0, weightAfter - shipMaxWeight) : 0,
      hasMissingWeight: plan.inputUnitWeight === null || plan.outputUnitWeight === null,
    };
  });

  const finalWeight = weightKnown ? currentWeight : null;

  return {
    initialGoods: Array.from(initialInputs, ([tier, units]) => ({ tier, units })),
    finalGoods: Array.from(availableUnits, ([tier, units]) => ({ tier, units })).filter(
      (good) => good.units > 0,
    ),
    initialCargoWeight: safeInitialCargo,
    initialLoadWeight,
    isInitialLoadKnown,
    minimumStartWeight,
    startWeight,
    overweightAtStart,
    totalCargoWeight: finalWeight,
    remainingCapacity:
      isCapacityValid && finalWeight !== null ? Math.max(0, shipMaxWeight - finalWeight) : null,
    startPercentage:
      isCapacityValid && startWeight !== null
        ? Math.round((startWeight / shipMaxWeight) * 100)
        : null,
    finalPercentage:
      isCapacityValid && finalWeight !== null
        ? Math.round((finalWeight / shipMaxWeight) * 100)
        : null,
    isCapacityValid,
    isOverweight,
    hasFinalOverload,
    hasMissingWeights,
    isSafe: isCapacityValid && !isOverweight && !hasMissingWeights && !hasFinalOverload,
    stopsSummary,
  };
}

export function calculateAutomaticTierChain({
  startTier,
  targetTier = 7,
  finalCargoLimit = null,
  startUnits,
  shipMaxWeight,
  preloadedCargoWeight = 0,
  ratios = {},
  shipCapacityValid = true,
}) {
  const needsShipCapacity =
    !shipCapacityValid || !Number.isFinite(shipMaxWeight) || shipMaxWeight <= 0;
  const invalidPreloadedCargo = !Number.isFinite(preloadedCargoWeight) || preloadedCargoWeight < 0;
  const invalidStartUnits = !Number.isSafeInteger(startUnits) || startUnits < 0;
  const invalidTierRange =
    !Number.isInteger(startTier) ||
    startTier < 0 ||
    startTier > 6 ||
    !Number.isInteger(targetTier) ||
    targetTier <= startTier ||
    targetTier > 7;
  const missingRatioTiers = [];
  const invalidOfferLimitTiers = [];
  const stepRatios = {};
  const tierWeights = {};
  let invalidTierWeight = null;

  if (!invalidTierRange) {
    for (let tier = startTier; tier <= targetTier; tier++) {
      const unitWeight = tier === 0 ? 0 : BARTER_TIERS[tier]?.unitWeight;
      if (!Number.isFinite(unitWeight) || (unitWeight <= 0 && tier !== 0)) {
        invalidTierWeight = tier;
        break;
      }
      tierWeights[tier] = unitWeight;
    }

    for (let tier = startTier; tier < targetTier; tier++) {
      const ratio = ratios[tier];
      if (
        !Number.isSafeInteger(ratio?.input) ||
        ratio.input <= 0 ||
        !Number.isSafeInteger(ratio?.output) ||
        ratio.output <= 0
      ) {
        missingRatioTiers.push(tier);
        continue;
      }

      if (
        ratio.offerLimit !== null &&
        ratio.offerLimit !== undefined &&
        (!Number.isSafeInteger(ratio.offerLimit) || ratio.offerLimit < 0)
      ) {
        invalidOfferLimitTiers.push(tier);
      }

      stepRatios[tier] = {
        input: ratio.input,
        output: ratio.output,
        offerLimit: ratio.offerLimit ?? null,
      };
    }
  }

  const resultBase = {
    plan: null,
    needsShipCapacity,
    invalidPreloadedCargo,
    invalidStartUnits,
    invalidTierRange,
    missingRatioTiers,
    invalidOfferLimitTiers,
    invalidTierWeight,
  };

  if (
    needsShipCapacity ||
    invalidPreloadedCargo ||
    invalidStartUnits ||
    invalidTierRange ||
    invalidTierWeight !== null ||
    missingRatioTiers.length > 0 ||
    invalidOfferLimitTiers.length > 0
  ) {
    return resultBase;
  }

  return {
    ...resultBase,
    ...optimizeTierChain({
      startTier,
      targetTier,
      startUnits,
      ratios: stepRatios,
      tierWeights,
      preloadedCargoWeight,
      shipMaxWeight,
      finalCargoLimit,
    }),
  };
}
