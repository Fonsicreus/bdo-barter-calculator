import { Anchor, Moon, Sparkles, Sun } from "lucide-react";
import { getThemeName } from "../utils/theme";
import { SiteNavigation } from "./SiteNavigation";

export function SiteHeader({
  current,
  title,
  subtitle,
  theme,
  onToggleTheme,
  themeLabel = getThemeName(theme),
  t = (label) => label,
  children,
}) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/80 border-slate-200 dark:bg-satella-base/80 dark:border-satella-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center space-x-3">
          <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm bg-gradient-to-tr from-purple-600 to-indigo-600 text-white dark:from-purple-900 dark:via-satella-primary dark:to-purple-400 dark:shadow-satella-glow">
            <Anchor aria-hidden="true" className="w-5 h-5 motion-safe:animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-bold tracking-tight text-slate-900 dark:text-satella-silver-glow flex flex-wrap items-center gap-1.5">
              {title}
              {isDark && (
                <span className="hidden sm:flex text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 items-center gap-1">
                  <Sparkles aria-hidden="true" className="w-2.5 h-2.5 text-purple-400" />
                  {t("Satella Mode")}
                </span>
              )}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center gap-2 sm:gap-3 ${children ? "w-full sm:w-auto" : ""}`}
        >
          {children}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={t("Toggle theme")}
            aria-pressed={isDark}
            title={getThemeName(theme)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:hover:bg-satella-hover dark:border-satella-border dark:hover:border-satella-primary/50 shadow-sm"
          >
            {isDark ? (
              <Moon aria-hidden="true" className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun aria-hidden="true" className="w-4 h-4 text-amber-500" />
            )}
            <span className="hidden sm:inline">{themeLabel}</span>
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteNavigation current={current} t={t} />
      </div>
    </header>
  );
}
