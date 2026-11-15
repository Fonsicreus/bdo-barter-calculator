import { ArrowRight, Navigation, Trash2 } from "lucide-react";
import { BARTER_TIERS } from "../data/barterTiers";
import { simulateRoute } from "../utils/calculator";

function formatWeight(value) {
  return value === null || value === undefined ? "Unknown" : `${value.toLocaleString()} LT`;
}

function formatPercent(value) {
  return value === null || value === undefined ? "—" : `${value}%`;
}

export function TripPlanner({
  stops,
  onRemoveStop,
  onClearStops,
  shipMaxWeight,
  initialCargoWeight,
  shipCapacityValid,
}) {
  const simulation = simulateRoute(stops, shipMaxWeight, initialCargoWeight, shipCapacityValid);

  if (stops.length === 0) {
    return null;
  }

  const capacityLabel = simulation.isCapacityValid
    ? `${shipMaxWeight.toLocaleString()} LT`
    : "invalid capacity";

  return (
    <div className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-satella-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow flex items-center gap-2">
              Multi-Stop Voyage Planner
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-100 dark:bg-satella-surface text-purple-700 dark:text-satella-glow border border-purple-200 dark:border-satella-border">
                {stops.length} {stops.length === 1 ? "Stop" : "Stops"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chained route simulation. Inputs not produced by an earlier stop are loaded at the
              first port, because barter islands have no storage.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearStops}
          className="text-xs text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Route
        </button>
      </div>

      {/* Stops Timeline */}
      <div className="mt-4 space-y-3">
        {simulation.stopsSummary.map((item, index) => {
          const inTier = BARTER_TIERS[item.stop.inputTierLevel];
          const outTier = BARTER_TIERS[item.stop.outputTierLevel];
          const isOverAtStep = item.isOverCapacityAtDeparture || item.isOverCapacityAtArrival;

          return (
            <div
              key={item.stop.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                isOverAtStep
                  ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60"
                  : item.hasMissingWeight
                    ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60"
                    : "bg-slate-50/80 border-slate-200 dark:bg-satella-surface/60 dark:border-satella-border/80"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-purple-100 text-purple-700 dark:bg-satella-surface dark:text-satella-primary border border-purple-300 dark:border-satella-border">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-satella-silver flex items-center gap-1.5">
                    <span>
                      Give {item.inputGiven} {inTier.shortName}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-purple-600 dark:text-satella-glow font-bold">
                      Get {item.outputReceived} {outTier.shortName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.stop.tradeCount} exchanges @ {item.stop.ratioInput}:
                    {item.stop.ratioOutput} ratio
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {item.inputLoadedUnits > 0
                      ? `${item.inputLoadedUnits} input units loaded at first port`
                      : "All inputs reused from earlier stops"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    Departure → Arrival
                  </div>
                  <div
                    className={`font-mono font-bold ${
                      isOverAtStep
                        ? "text-rose-600 dark:text-rose-400"
                        : item.hasMissingWeight
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-slate-800 dark:text-satella-silver-glow"
                    }`}
                  >
                    {formatWeight(item.weightBefore)} → {formatWeight(item.weightAfter)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Limit: {capacityLabel}
                  </div>
                  {isOverAtStep && (
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {item.overCapacityAtDeparture > 0
                        ? `${item.overCapacityAtDeparture.toLocaleString()} LT over at departure`
                        : ""}
                      {item.overCapacityAtDeparture > 0 && item.overCapacityAtArrival > 0
                        ? " · "
                        : ""}
                      {item.overCapacityAtArrival > 0
                        ? `${item.overCapacityAtArrival.toLocaleString()} LT over after exchange`
                        : ""}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveStop(item.stop.id)}
                  aria-label="Remove stop"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-satella-hover transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-satella-border/60 space-y-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-slate-500 dark:text-slate-400">
            Inputs loaded at first port:{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {simulation.isInitialLoadKnown
                ? formatWeight(simulation.initialLoadWeight)
                : "Unknown"}
            </strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Departure from port:{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {simulation.startWeight !== null
                ? formatWeight(simulation.startWeight)
                : simulation.minimumStartWeight > 0
                  ? `At least ${formatWeight(simulation.minimumStartWeight)}`
                  : "Unknown"}
            </strong>{" "}
            <span className="text-slate-400 dark:text-slate-500">
              ({formatPercent(simulation.startPercentage)})
            </span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Final voyage cargo:{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {formatWeight(simulation.totalCargoWeight)}
            </strong>{" "}
            <span className="text-slate-400 dark:text-slate-500">
              ({formatPercent(simulation.finalPercentage)})
            </span>
          </span>
        </div>

        <div className="space-y-1">
          {!simulation.isCapacityValid && (
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              Set a valid actual max cargo in Vessel Configuration to verify this route.
            </p>
          )}
          {simulation.hasMissingWeights && (
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              Cannot fully verify the route: one or more stops are missing exact item weights.
            </p>
          )}
          {simulation.isCapacityValid && simulation.isOverweight && (
            <p className="text-rose-600 dark:text-rose-400 font-bold">
              {simulation.overweightAtStart
                ? "Warning: the vessel exceeds max capacity when leaving the first port."
                : "Warning: the vessel exceeds max capacity during this route. Check the highlighted stop."}
            </p>
          )}
          {simulation.isSafe && (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              Complete route fits within the ship's weight limit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
