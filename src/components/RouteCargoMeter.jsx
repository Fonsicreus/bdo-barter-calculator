import { useLanguage } from "../i18n/LanguageContext";

export function RouteCargoMeter({
  weight,
  capacity,
  validCapacity,
  label = "Cargo after this stop",
}) {
  const { t } = useLanguage();
  if (!validCapacity || weight === null || !Number.isFinite(weight)) {
    return (
      <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
        {t("Cargo space cannot be calculated until the weight and ship capacity are known.")}
      </p>
    );
  }
  const percent = (weight / capacity) * 100;
  const excess = Math.max(0, weight - capacity);
  const free = Math.max(0, capacity - weight);
  const color =
    excess > 0
      ? "bg-amber-500"
      : percent > 85
        ? "bg-amber-500"
        : "bg-gradient-to-r from-purple-500 to-indigo-500";
  return (
    <div className="mt-2 space-y-1.5" aria-label={t(label)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{t(label)}</span>
        <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
          {weight.toLocaleString()} / {capacity.toLocaleString()} LT ({Math.round(percent)}%)
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-satella-void/70"
        role="progressbar"
        tabIndex={0}
        aria-label={t(label)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.round(percent))}
        aria-valuetext={`${Math.round(percent)}%`}
      >
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <p
        className={`text-xs font-semibold ${excess > 0 ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-400"}`}
      >
        {excess > 0
          ? t("{weight} LT above normal capacity", { weight: excess.toLocaleString() })
          : t("{weight} LT free at this weight", { weight: free.toLocaleString() })}
      </p>
    </div>
  );
}
