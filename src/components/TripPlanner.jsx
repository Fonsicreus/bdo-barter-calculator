import { ArrowDown, ArrowRight, ArrowUp, Navigation, Trash2 } from "lucide-react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";
import { simulateRoute } from "../utils/calculator";

function formatWeight(value, t) {
  return value === null || value === undefined ? t("Unknown") : `${value.toLocaleString()} LT`;
}

function formatPercent(value) {
  return value === null || value === undefined ? "—" : `${value}%`;
}

export function TripPlanner({
  stops,
  onRemoveStop,
  onClearStops,
  onMoveStop,
  shipMaxWeight,
  initialCargoWeight,
  shipCapacityValid,
  finalCargoLimit,
}) {
  const { t } = useLanguage();
  const simulation = simulateRoute(
    stops,
    shipMaxWeight,
    initialCargoWeight,
    shipCapacityValid,
    finalCargoLimit,
  );

  if (stops.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-satella-border dark:text-slate-400">
        {t("Add an exchange above to start planning your route.")}
      </p>
    );

  const capacityLabel = simulation.isCapacityValid
    ? `${shipMaxWeight.toLocaleString()} LT`
    : t("invalid capacity");

  return (
    <div className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-satella-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow flex items-center gap-2">
              {t("Multi-Stop Voyage Planner")}
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-100 dark:bg-satella-surface text-purple-700 dark:text-satella-glow border border-purple-200 dark:border-satella-border">
                {stops.length} {stops.length === 1 ? t("Stop") : t("Stops")}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t(
                "Chained route simulation. Inputs not produced by an earlier stop are loaded at the first port, because barter islands have no storage.",
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearStops}
          className="text-xs text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t("Clear Route")}
        </button>
      </div>

      {/* Stops Timeline */}
      <div className="mt-4 space-y-3">
        {simulation.stopsSummary.map((item, index) => {
          const inTier = BARTER_TIERS[item.stop.inputTierLevel];
          const outTier = BARTER_TIERS[item.stop.outputTierLevel];
          const isOverAtStep =
            item.isOverCapacityAtDeparture ||
            item.isOverCapacityAtArrival ||
            item.tooHeavyBeforeLast;

          return (
            <div
              key={item.stop.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                item.finalOverloadAllowed
                  ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60"
                  : isOverAtStep
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
                      {t("Give")} {item.inputGiven} {t(inTier.shortName)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-purple-600 dark:text-satella-glow font-bold">
                      {t("Get")} {item.outputReceived} {t(outTier.shortName)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.stop.tradeCount} {t("exchanges @")} {item.stop.ratioInput}:
                    {item.stop.ratioOutput} {t("ratio")}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {item.inputLoadedUnits > 0
                      ? t("{count} input units loaded at first port", {
                          count: item.inputLoadedUnits,
                        })
                      : t("All inputs reused from earlier stops")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                    {t("Departure → Arrival")}
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
                    {formatWeight(item.weightBefore, t)} → {formatWeight(item.weightAfter, t)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {t("Limit:")} {capacityLabel}
                  </div>
                  {isOverAtStep && (
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {item.overCapacityAtDeparture > 0
                        ? t("{weight} LT over at departure", {
                            weight: item.overCapacityAtDeparture.toLocaleString(),
                          })
                        : ""}
                      {item.overCapacityAtDeparture > 0 && item.overCapacityAtArrival > 0
                        ? " · "
                        : ""}
                      {item.overCapacityAtArrival > 0
                        ? t("{weight} LT over after exchange", {
                            weight: item.overCapacityAtArrival.toLocaleString(),
                          })
                        : ""}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveStop(index, -1)}
                    aria-label={t("Move stop up")}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-purple-600 disabled:opacity-30 dark:hover:bg-satella-hover"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === stops.length - 1}
                    onClick={() => onMoveStop(index, 1)}
                    aria-label={t("Move stop down")}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-purple-600 disabled:opacity-30 dark:hover:bg-satella-hover"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveStop(item.stop.id)}
                    aria-label={t("Remove stop")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-satella-hover transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-satella-border/60 space-y-2 text-xs">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-satella-surface/60 space-y-1 text-slate-600 dark:text-slate-300">
          <p>
            <strong>{t("Goods to load at the first port:")}</strong>{" "}
            {simulation.initialGoods.length
              ? simulation.initialGoods
                  .map(
                    (good) =>
                      `${good.units.toLocaleString()} × ${t(BARTER_TIERS[good.tier].shortName)}`,
                  )
                  .join(", ")
              : "—"}
          </p>
          <p>
            <strong>{t("Goods remaining after the route:")}</strong>{" "}
            {simulation.finalGoods.length
              ? simulation.finalGoods
                  .map(
                    (good) =>
                      `${good.units.toLocaleString()} × ${t(BARTER_TIERS[good.tier].shortName)}`,
                  )
                  .join(", ")
              : "—"}
          </p>
          <p>
            {t(
              "For linked stops, confirm that the received item is the exact one requested by the next offer.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-slate-500 dark:text-slate-400">
            {t("Inputs loaded at first port:")}{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {simulation.isInitialLoadKnown
                ? formatWeight(simulation.initialLoadWeight, t)
                : t("Unknown")}
            </strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {t("Departure from port:")}{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {simulation.startWeight !== null
                ? formatWeight(simulation.startWeight, t)
                : simulation.minimumStartWeight > 0
                  ? t("At least {weight}", {
                      weight: formatWeight(simulation.minimumStartWeight, t),
                    })
                  : t("Unknown")}
            </strong>{" "}
            <span className="text-slate-400 dark:text-slate-500">
              ({formatPercent(simulation.startPercentage)})
            </span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {t("Final voyage cargo:")}{" "}
            <strong className="font-mono text-slate-800 dark:text-satella-silver-glow">
              {formatWeight(simulation.totalCargoWeight, t)}
            </strong>{" "}
            <span className="text-slate-400 dark:text-slate-500">
              ({formatPercent(simulation.finalPercentage)})
            </span>
          </span>
        </div>

        <div className="space-y-1">
          {!simulation.isCapacityValid && (
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              {t("Set a valid actual max cargo in Vessel Configuration to verify this route.")}
            </p>
          )}
          {simulation.hasMissingWeights && (
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              {t(
                "Cannot fully verify the route: one or more stops are missing exact item weights.",
              )}
            </p>
          )}
          {simulation.isCapacityValid && simulation.isOverweight && (
            <p className="text-rose-600 dark:text-rose-400 font-bold">
              {simulation.overweightAtStart
                ? t("Warning: the vessel exceeds max capacity when leaving the first port.")
                : t(
                    "Warning: the vessel exceeds max capacity during this route. Check the highlighted stop.",
                  )}
            </p>
          )}
          {simulation.isSafe && (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              {t("Complete route fits within the ship's weight limit.")}
            </p>
          )}
          {simulation.hasFinalOverload &&
            !simulation.isOverweight &&
            !simulation.hasMissingWeights && (
              <p className="font-bold text-amber-700 dark:text-amber-300">
                {t(
                  "The final exchange exceeds normal capacity but remains within the provisional overload limit.",
                )}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
