import { Anchor, Moon, Sparkles, Sun, Wrench } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function Header({ theme, onToggleTheme, debugEnabled = false, onToggleDebug }) {
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 border-b bg-white/80 border-slate-200 dark:bg-satella-base/80 dark:border-satella-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Logo and Title */}
        <div className="flex min-w-0 items-center space-x-3">
          <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm bg-gradient-to-tr from-purple-600 to-indigo-600 text-white dark:from-purple-900 dark:via-satella-primary dark:to-purple-400 dark:shadow-satella-glow">
            <Anchor className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-xl font-bold tracking-tight text-slate-900 dark:text-satella-silver-glow flex flex-wrap items-center gap-1.5">
                {t("BDO Barter Calculator")}
                {isDark && (
                  <span className="hidden sm:flex text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    {t("Satella Mode")}
                  </span>
                )}
              </h1>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              {t("Black Desert Online • Ship Cargo & Trade Optimizer")}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
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
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={t("Toggle theme")}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:hover:bg-satella-hover dark:border-satella-border dark:hover:border-satella-primary/50 shadow-sm"
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">{t("Satella Dark")}</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">{t("Light Mode")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
