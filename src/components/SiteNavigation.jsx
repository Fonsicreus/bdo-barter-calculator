export function getSitePaths(baseUrl = import.meta.env?.BASE_URL ?? "/") {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return { barter: base, shipUpgrades: `${base}ship-upgrades/` };
}

export function SiteNavigation({ current = "barter", baseUrl, t = (label) => label }) {
  const paths = getSitePaths(baseUrl);
  const links = [
    { page: "barter", href: paths.barter, label: "Barter Calculator" },
    { page: "ship-upgrades", href: paths.shipUpgrades, label: "Ship Upgrade Calculator" },
  ];

  return (
    <nav aria-label={t("Calculators")} className="flex flex-wrap gap-2 py-2">
      {links.map(({ page, href, label }) => (
        <a
          key={page}
          href={href}
          aria-current={current === page ? "page" : undefined}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
            current === page
              ? "border-purple-300 bg-purple-100 text-purple-900 dark:border-purple-500/50 dark:bg-purple-950/60 dark:text-purple-200"
              : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-satella-hover"
          }`}
        >
          {t(label)}
        </a>
      ))}
    </nav>
  );
}
