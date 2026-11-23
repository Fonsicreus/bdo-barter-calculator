import { simulateRoute } from "./calculator";

export function findFittingQuantity({
  quantity,
  makeStops,
  shipMaxWeight,
  initialCargoWeight,
  shipCapacityValid,
  finalCargoLimit,
}) {
  if (!Number.isSafeInteger(quantity) || quantity <= 1) return { quantity: null, limited: false };
  const searchLimit = 5000;
  const lowest = Math.max(1, quantity - searchLimit);
  for (let candidate = quantity - 1; candidate >= lowest; candidate--) {
    const stops = makeStops(candidate);
    if (!stops) continue;
    const result = simulateRoute(
      stops,
      shipMaxWeight,
      initialCargoWeight,
      shipCapacityValid,
      finalCargoLimit,
    );
    if (result.isCapacityValid && !result.hasMissingWeights && !result.isOverweight) {
      return { quantity: candidate, limited: false };
    }
  }
  return { quantity: null, limited: lowest > 1 };
}
