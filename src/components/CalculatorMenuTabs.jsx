export function CalculatorMenuTabs({ label, menus, active, onChange }) {
  return (
    <nav
      aria-label={label}
      className={`grid grid-cols-1 gap-2 ${menus.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
    >
      {menus.map(({ id, label: menuLabel, icon: Icon, panelId }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          aria-controls={panelId}
          onClick={() => onChange(id)}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
            active === id
              ? "border-purple-600 bg-purple-600 text-white dark:border-satella-primary dark:bg-satella-primary dark:text-satella-void"
              : "border-slate-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver dark:hover:bg-satella-surface"
          }`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" /> {menuLabel}
        </button>
      ))}
    </nav>
  );
}
