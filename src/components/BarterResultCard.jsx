import { Info, Scale, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function BarterResultCard({
  result,
  inputTier,
  outputTier,
  ratioInput,
  ratioOutput,
  shipMaxWeight,
  ownedQuantity,
  offerLimit,
  onAddToTrip,
}) {
  const { t } = useLanguage();
  const hasMissingInputs =
    result.needsUnitWeight ||
    result.needsRatio ||
    result.needsOfferLimit ||
    result.needsShipCapacity;

  const statusLabel = hasMissingInputs
    ? result.needsShipCapacity
      ? "Configure Ship"
      : "Complete Offer Details"
    : result.maxSafeTrades > 0
      ? result.isOverCapacityAtArrival
        ? "Final overload estimate"
        : "Safe Voyage"
      : result.limitingFactor === "no_owned_stock"
        ? "No Stock"
        : result.limitingFactor === "already_overloaded"
          ? "Over Encumbered"
          : result.limitingFactor === "no_free_capacity"
            ? "No Free Capacity"
            : "No Safe Trade";

  return (
    <div className="lg:col-span-5 flex flex-col space-y-4">
      <div className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-gradient-to-b from-purple-50/50 via-white to-slate-50 border-purple-200/80 shadow-sm dark:from-satella-surface/80 dark:via-satella-card dark:to-satella-base dark:border-satella-border dark:shadow-satella-glow flex-1 flex flex-col justify-between">
        <div>
          {/* Header / Status */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-satella-border/60">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-satella-glow">
              <Scale className="w-4 h-4" />
              <span>{t("Trade Optimization Result")}</span>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                hasMissingInputs
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                  : result.isOverCapacityAtArrival && result.maxSafeTrades > 0
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                    : result.maxSafeTrades > 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60"
              }`}
            >
              {t(statusLabel)}
            </span>
          </div>

          {hasMissingInputs ? (
            <div
              role="alert"
              className="mt-5 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200"
            >
              {result.needsShipCapacity && (
                <p>
                  {t(
                    "Enter a valid actual max cargo in Vessel Configuration. The value must be at least the ship's hull base.",
                  )}
                </p>
              )}
              {result.needsUnitWeight && (
                <p>{t("Enter the exact unit weight for each variable-weight item.")}</p>
              )}
              {result.needsRatio && (
                <p>{t("Enter the input and output quantities shown for this barter offer.")}</p>
              )}
              {result.needsOfferLimit && (
                <p>{t("Enter the remaining exchange cap shown for this specific offer.")}</p>
              )}
              {result.isOverCapacityAtDeparture && (
                <p>
                  {t(
                    "Pre-loaded cargo already exceeds the ship's max capacity before any trade goods are added.",
                  )}
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Big Actionable Metric */}
              <div className="my-5 text-center p-4 rounded-xl bg-white/70 dark:bg-satella-surface/50 border border-purple-100 dark:border-satella-border/40">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  {t("Recommended to Load on Ship")}
                </span>
                <div className="flex items-center justify-center space-x-2 my-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-700 dark:text-satella-glow drop-shadow-sm">
                    {result.recommendedInputCount}
                  </span>
                  <span className="text-sm font-bold text-slate-600 dark:text-satella-silver">
                    {t(inputTier.shortName)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-purple-300/80">
                  ({result.maxSafeTrades} {t("exchanges @")} {ratioInput}:{ratioOutput}{" "}
                  {t("ratio)")}
                </p>
              </div>

              {/* Outcome Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-satella-surface border border-slate-200 dark:border-satella-border">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    {t("You Receive (Output)")}
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-satella-silver-glow">
                    +{result.expectedOutputCount}{" "}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {t(outputTier.shortName)}
                    </span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-satella-surface border border-slate-200 dark:border-satella-border">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    {t("Net Weight Change")}
                  </span>
                  <span
                    className={`font-mono font-bold text-base ${
                      result.netWeightChange > 0
                        ? "text-purple-600 dark:text-purple-300"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {result.netWeightChange >= 0
                      ? `+${result.netWeightChange.toLocaleString()}`
                      : result.netWeightChange.toLocaleString()}{" "}
                    <span className="text-xs font-normal">LT</span>
                  </span>
                </div>
              </div>

              {/* Detailed Weight Breakdown */}
              <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-100/70 dark:bg-satella-void/60 border border-slate-200 dark:border-satella-border text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-satella-silver">
                  <span>{t("Departure (pre-loaded + input goods):")}</span>
                  <span className="font-mono font-semibold">
                    {result.weightAtDeparture.toLocaleString()} / {shipMaxWeight.toLocaleString()}{" "}
                    LT ({result.departurePercentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-900 dark:text-satella-silver-glow font-medium">
                  <span>{t("Arrival (pre-loaded + received goods):")}</span>
                  <span className="font-mono font-bold text-purple-700 dark:text-satella-glow">
                    {result.weightAtArrival.toLocaleString()} / {shipMaxWeight.toLocaleString()} LT
                    ({result.arrivalPercentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>{t("Arrival cargo buffer:")}</span>
                  {result.overCapacityAtArrival > 0 ? (
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      {result.overCapacityAtArrival.toLocaleString()} {t("LT over")}
                    </span>
                  ) : (
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {result.remainingCapacityAtArrival.toLocaleString()} {t("LT free")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t(
                    "Pre-loaded cargo excludes the goods being exchanged. Input goods are counted as loaded before departure.",
                  )}
                </p>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-satella-surface rounded-full h-2.5 overflow-hidden mt-1">
                  <div
                    className={`h-full transition-[width] duration-500 ${
                      result.arrivalPercentage > 100
                        ? "bg-rose-500"
                        : result.arrivalPercentage > 85
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-satella-veil dark:to-satella-glow"
                    }`}
                    style={{ width: `${Math.min(100, result.arrivalPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Limiting Factor Explanation Note */}
              <div className="mt-3 flex items-start space-x-2 text-xs text-slate-500 dark:text-purple-300/70">
                <Info className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  {result.limitingFactor === "owned_quantity" && (
                    <span>
                      {t("Limited by your stock of")} <strong>{ownedQuantity}</strong>{" "}
                      {t(inputTier.shortName)}.
                    </span>
                  )}
                  {result.limitingFactor === "offer_limit" && (
                    <span>
                      {t("Limited by this offer's remaining exchange cap of")}{" "}
                      <strong>{offerLimit}</strong> {t("trades.")}
                    </span>
                  )}
                  {result.limitingFactor === "arrival_weight" && (
                    <span>
                      {t("Limited by the weight of received")}{" "}
                      <strong>{t(outputTier.shortName)}</strong> ({outputTier.unitWeight}{" "}
                      {t("LT each) to prevent exceeding your ship's max LT.")}
                    </span>
                  )}
                  {result.limitingFactor === "departure_weight" && (
                    <span>
                      {t(
                        "Limited by the input goods loaded on top of pre-loaded cargo when leaving port.",
                      )}
                    </span>
                  )}
                  {result.limitingFactor === "already_overloaded" && (
                    <span>
                      {t(
                        "Pre-loaded cargo already exceeds the ship's max capacity before any trade goods are added.",
                      )}
                    </span>
                  )}
                  {result.limitingFactor === "no_free_capacity" && (
                    <span>{t("No free cargo capacity remains for input goods.")}</span>
                  )}
                  {result.limitingFactor === "no_owned_stock" && (
                    <span>
                      {t("You do not own enough")} <strong>{t(inputTier.shortName)}</strong>{" "}
                      {t("for even one exchange at this ratio.")}
                    </span>
                  )}
                  {result.limitingFactor === "no_safe_trades" && (
                    <span>
                      {t(
                        "Even one exchange would exceed the ship's max capacity. Reduce pre-loaded cargo or choose lighter goods.",
                      )}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Button: Add to Route */}
        {onAddToTrip && !hasMissingInputs && (
          <div className="pt-4 mt-2">
            <button
              type="button"
              onClick={onAddToTrip}
              disabled={result.maxSafeTrades <= 0}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700 text-white shadow-sm dark:bg-satella-primary dark:text-satella-void dark:hover:bg-satella-glow dark:shadow-satella-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("Add Trade to Route Planner")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
