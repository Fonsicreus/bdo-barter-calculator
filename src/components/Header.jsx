import { Wrench } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { SiteHeader } from "./SiteHeader";

export function Header({ theme, onToggleTheme, debugEnabled = false, onToggleDebug }) {
  const { t } = useLanguage();

  return (
    <SiteHeader
      current="barter"
      title={t("BDO Barter Calculator")}
      subtitle={t("Black Desert Online • Ship Cargo & Trade Optimizer")}
      theme={theme}
      onToggleTheme={onToggleTheme}
      themeLabel={t(theme === "dark" ? "Satella Dark" : "Light Mode")}
      t={t}
    >
      <button
        type="button"
        onClick={onToggleDebug}
        aria-pressed={debugEnabled}
        title={t("Debug mode: allow custom ratios")}
        className={
          debugEnabled
            ? "flex items-center gap-1 rounded-xl border border-purple-600 bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white"
            : "flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver"
        }
      >
        <Wrench className="h-4 w-4" aria-hidden="true" /> {t("Debug")}
      </button>
      <LanguageSelector />
    </SiteHeader>
  );
}
