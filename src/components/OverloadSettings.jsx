import { useLanguage } from "../i18n/LanguageContext";

export function OverloadSettings({ enabled, onEnabledChange, finalCargoLimit }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <label className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onEnabledChange(event.target.checked)}
          className="h-4 w-4 accent-purple-600"
        />
        {t("Simulate final overload")}
      </label>
      {enabled && (
        <div className="mt-3 space-y-2">
          {finalCargoLimit !== null && (
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              {t("Provisional maximum: 150% of normal capacity ({weight} LT).", {
                weight: finalCargoLimit.toLocaleString(),
              })}
            </p>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t(
              "The 150% limit is a temporary planning assumption, not a confirmed game limit. Each exchange must start within normal capacity. Breezy Sail is unavailable while overloaded.",
            )}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t(
              "The multi-stop route planner only allows overload after the last exchange, within this provisional limit.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
