import { useLanguage } from "../i18n/LanguageContext";
import { getRouteCargoMetrics } from "../utils/routeCargo";
import { RouteCargoMeter } from "./RouteCargoMeter";

export function RouteCargoSummary({ simulation, shipMaxWeight, finalCargoLimit }) {
  const { t } = useLanguage();
  const { peakWeight, additionalCargo } = getRouteCargoMetrics(
    simulation,
    shipMaxWeight,
    finalCargoLimit,
  );
  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-purple-200/80 bg-gradient-to-b from-purple-50/60 to-white p-4 dark:border-satella-border dark:from-satella-surface/60 dark:to-satella-card">
      <h3 className="text-sm font-bold text-purple-700 dark:text-satella-glow">
        {t("Voyage cargo overview")}
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Departure from port:")}
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-satella-silver-glow">
            {simulation.startWeight === null
              ? t("Unknown")
              : `${simulation.startWeight.toLocaleString()} LT`}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Peak cargo during route")}
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-satella-silver-glow">
            {peakWeight === null ? t("Unknown") : `${peakWeight.toLocaleString()} LT`}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Additional cargo for the whole route")}
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-purple-700 dark:text-satella-glow">
            {additionalCargo === null ? "—" : `${additionalCargo.toLocaleString()} LT`}
          </div>
        </div>
      </div>
      <RouteCargoMeter
        weight={peakWeight}
        capacity={shipMaxWeight}
        validCapacity={simulation.isCapacityValid}
        label="Peak cargo during route"
      />
      <p className="text-xs text-slate-600 dark:text-slate-300">
        {t(
          "Additional cargo is the most you can add at departure and keep aboard throughout this planned route. It is not another calculated exchange; item slots and offer requirements still apply.",
        )}
      </p>
      {simulation.isOverweight && (
        <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
          {t(
            "This route already exceeds an allowed limit; reduce the load or change the route before adding more cargo.",
          )}
        </p>
      )}
    </div>
  );
}
