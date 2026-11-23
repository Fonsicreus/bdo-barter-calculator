/** Extra cargo is assumed to stay aboard for the entire existing route. */
export function getRouteCargoMetrics(simulation, normalCapacity, finalCargoLimit) {
  if (
    !simulation.isCapacityValid ||
    simulation.hasMissingWeights ||
    simulation.startWeight === null
  ) {
    return { peakWeight: null, additionalCargo: null };
  }

  let peakWeight = simulation.startWeight;
  let additionalCargo = normalCapacity - simulation.startWeight;
  for (let index = 0; index < simulation.stopsSummary.length; index++) {
    const stop = simulation.stopsSummary[index];
    if (stop.weightBefore === null || stop.weightAfter === null) {
      return { peakWeight: null, additionalCargo: null };
    }
    peakWeight = Math.max(peakWeight, stop.weightBefore, stop.weightAfter);
    additionalCargo = Math.min(additionalCargo, normalCapacity - stop.weightBefore);
    const lastStop = index === simulation.stopsSummary.length - 1;
    const finalLimit =
      lastStop && Number.isFinite(finalCargoLimit) && finalCargoLimit > normalCapacity
        ? finalCargoLimit
        : normalCapacity;
    additionalCargo = Math.min(additionalCargo, finalLimit - stop.weightAfter);
  }
  return {
    peakWeight,
    additionalCargo: simulation.isOverweight ? null : Math.max(0, additionalCargo),
  };
}
