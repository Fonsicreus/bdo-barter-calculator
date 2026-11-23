import { useLanguage } from "../i18n/LanguageContext";

// Community reference; the displayed counts describe cumulative barters.
const ROUTE_COUNTS = [0, 10, 30, 70, 150, 310, 630, 1270, 2550, 5110, 10230, 20470];

export function BarterUnlockReference() {
  const { t } = useLanguage();
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-satella-border dark:bg-satella-surface/40">
      <h3 className="text-sm font-bold text-slate-900 dark:text-satella-silver-glow">
        {t("Barter route unlocks")}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        {t(
          "Total completed exchanges, according to the community guide. Routes are separate from item levels; availability can depend on refreshes.",
        )}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ROUTE_COUNTS.map((count, index) => (
          <div key={count} className="rounded-lg bg-white px-3 py-2 text-xs dark:bg-satella-card">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {t("Route {number}", { number: index + 1 })}
            </span>
            <span className="float-right font-mono text-purple-700 dark:text-satella-glow">
              {count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        {t(
          "Special Barter may start appearing at around 140 completed exchanges; offers appear randomly. The game shows the available items and quantities.",
        )}
      </p>
      <div className="space-y-2 rounded-lg bg-white p-3 dark:bg-satella-card">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {t("Special Barter requirements")}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {t(
            "The April 16, 2026 update changed Special Barter requirements to gold bars or Level 4 goods. Confirm the required items and the reward in game.",
          )}
        </p>
        <a
          href="https://www.tw.playblackdesert.com/zh-TW/News/Detail?countryType=zh-TW&groupContentNo=19419"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-semibold text-purple-700 underline dark:text-satella-glow"
        >
          {t("Source: Pearl Abyss patch notes")}
        </a>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        {t(
          "Brilliant Rock Salt Ingots and Brilliant Pearl Shards: the guide lists 1,000 barters for ship material refreshes and 1,500 for trade item refreshes.",
        )}
      </p>
      <a
        href="https://www.blackdesertfoundry.com/bartering-guide/"
        target="_blank"
        rel="noreferrer"
        className="inline-block text-xs font-semibold text-purple-700 underline dark:text-satella-glow"
      >
        {t("Source: Black Desert Foundry bartering guide")}
      </a>
    </div>
  );
}
