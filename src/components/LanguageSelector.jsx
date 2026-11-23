import { Languages } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LOCALES } from "../i18n/locales";

export function LanguageSelector() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <fieldset
      aria-label={t("Language")}
      className="flex min-w-0 flex-wrap items-center gap-0.5 rounded-xl border border-slate-300 bg-slate-100 p-1 text-xs font-semibold text-slate-700 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver"
    >
      <Languages className="mx-1 h-4 w-4" aria-hidden="true" />
      {LOCALES.map(({ id, label, shortLabel }) => (
        <button
          key={id}
          type="button"
          lang={id}
          title={label}
          aria-label={label}
          aria-pressed={language === id}
          onClick={() => setLanguage(id)}
          className={
            language === id
              ? "rounded-lg bg-purple-600 px-1.5 py-1 text-white dark:bg-satella-primary dark:text-satella-void"
              : "rounded-lg px-1.5 py-1 hover:bg-slate-200 dark:hover:bg-satella-hover"
          }
        >
          {shortLabel}
        </button>
      ))}
    </fieldset>
  );
}
