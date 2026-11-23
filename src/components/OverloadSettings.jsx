import { Weight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function OverloadSettings({ enabled = false, onEnabledChange, finalCargoLimit }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1">
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => onEnabledChange?.(!enabled)}
        className={
          enabled
            ? "inline-flex items-center gap-1.5 rounded-lg border border-amber-500 bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200"
            : "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
        }
      >
        <Weight className="h-4 w-4" aria-hidden="true" /> {t("Overload")}
      </button>
      {enabled && (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {finalCargoLimit != null
            ? t("Provisional maximum: 150% of normal capacity ({weight} LT).", {
                weight: finalCargoLimit.toLocaleString(),
              })
            : t("configure ship capacity")}{" "}
          {t("Only the last offer may end overloaded; the 150% limit is not confirmed.")}
        </p>
      )}
    </div>
  );
}
