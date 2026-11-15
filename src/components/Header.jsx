import { Anchor, Moon, Sparkles, Sun } from "lucide-react";

export function Header({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 border-b bg-white/80 border-slate-200 dark:bg-satella-base/80 dark:border-satella-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm bg-gradient-to-tr from-purple-600 to-indigo-600 text-white dark:from-purple-900 dark:via-satella-primary dark:to-purple-400 dark:shadow-satella-glow">
            <Anchor className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-satella-silver-glow flex items-center gap-1.5">
                BDO Barter Calculator
                {isDark && (
                  <span className="text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    Satella Mode
                  </span>
                )}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Black Desert Online • Ship Cargo & Trade Optimizer
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:hover:bg-satella-hover dark:border-satella-border dark:hover:border-satella-primary/50 shadow-sm"
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Satella Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
