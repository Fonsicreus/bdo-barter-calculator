import { ArrowLeftRight, ListPlus, Route } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const MENUS = [
  { id: "single", label: "Single trade", icon: ArrowLeftRight },
  { id: "chain", label: "Tier chain", icon: Route },
  { id: "route", label: "Multiple trades", icon: ListPlus },
];

export function TradeMenuTabs({ active, onChange }) {
  const { t } = useLanguage();
  return (
    <nav
      aria-label={t("Choose a trade calculator")}
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
    >
      {MENUS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          onClick={() => onChange(id)}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
            active === id
              ? "border-purple-600 bg-purple-600 text-white dark:border-satella-primary dark:bg-satella-primary dark:text-satella-void"
              : "border-slate-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver dark:hover:bg-satella-surface"
          }`}
        >
          <Icon className="h-4 w-4" /> {t(label)}
        </button>
      ))}
    </nav>
  );
}
