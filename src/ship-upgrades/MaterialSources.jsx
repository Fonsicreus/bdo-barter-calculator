import { useId, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { getSailingRewards, sailingMaterials } from "./sailingSources";

const badgeColors = {
  daily:
    "border-sky-300 bg-sky-100 text-sky-950 hover:bg-sky-200 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200 dark:hover:bg-sky-900",
  weekly:
    "border-indigo-300 bg-indigo-100 text-indigo-950 hover:bg-indigo-200 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900",
  barter:
    "border-emerald-300 bg-emerald-100 text-emerald-950 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900",
  shop: "border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-200 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900",
  khan: "border-rose-300 bg-rose-100 text-rose-950 hover:bg-rose-200 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900",
  exploration:
    "border-violet-300 bg-violet-100 text-violet-950 hover:bg-violet-200 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900",
  fishing:
    "border-cyan-300 bg-cyan-100 text-cyan-950 hover:bg-cyan-200 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-200 dark:hover:bg-cyan-900",
  seaMonster:
    "border-orange-300 bg-orange-100 text-orange-950 hover:bg-orange-200 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200 dark:hover:bg-orange-900",
  vendor:
    "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
};

function sailingBadges(itemId, shop, t, formatNumber) {
  const material = sailingMaterials[itemId];
  if (!material) return [];

  const badges = [];
  for (const period of ["daily", "weekly"]) {
    const rewards = getSailingRewards(itemId, period);
    if (rewards.length === 0) continue;
    const count = formatNumber(rewards.reduce((sum, { quantity }) => sum + quantity, 0));
    const hasChoice = rewards.some(({ choice }) => choice);
    const frequency =
      period === "daily"
        ? hasChoice
          ? t("Up to +{count}/day", { count })
          : t("+{count}/day", { count })
        : hasChoice
          ? t("Up to +{count}/week", { count })
          : t("+{count}/week", { count });
    badges.push({
      key: period,
      label: `${period === "daily" ? t("Daily quest") : t("Weekly quest")} · ${frequency}`,
      lines: rewards.map(({ name, choice, quantity }) => {
        const values = { quest: t(name), count: formatNumber(quantity) };
        return choice
          ? t("{quest}: +{count} if you select this reward.", values)
          : t("{quest}: +{count} guaranteed on completion.", values);
      }),
    });
  }
  if (material.barter) {
    badges.push({
      key: "barter",
      label: t("Bartering"),
      lines: [
        material.barter === true
          ? t("Exchange sea trade goods when an offer is available.")
          : t("Exchange level {level} sea trade goods when an offer is available.", {
              level: material.barter,
            }),
      ],
    });
  }
  if (shop?.unitPrice > 0) {
    badges.push({
      key: "shop",
      label: t("Crow Coin Shop"),
      lines: [t("{price} CC per unit", { price: formatNumber(shop.unitPrice) })],
    });
  }
  if (material.khan) {
    badges.push({
      key: "khan",
      label: t("Khan loot"),
      lines: [
        t("Dry one {item} to get {quantity} of this material.", {
          item: t(material.khan),
          quantity: formatNumber(10),
        }),
      ],
    });
  }
  if (material.exploration) {
    badges.push({
      key: "exploration",
      label: t("Exploration quest"),
      lines: [t("Check island exploration quests for this reward. No fixed daily yield.")],
    });
  }
  if (material.fishing) {
    badges.push({
      key: "fishing",
      label: t("Fishing"),
      lines: [t("Rare catch at Papua Crinea. No fixed daily yield.")],
    });
  }
  if (material.seaMonster) {
    badges.push({
      key: "seaMonster",
      label: t("Sea monster drop"),
      lines: [t("Can drop from sea monsters. No fixed daily yield.")],
    });
  }
  return badges;
}

export function MaterialSources({ itemId, shop, vendor, formatNumber }) {
  const { t } = useLanguage();
  const id = useId();
  const [active, setActive] = useState(null);
  const badges = vendor
    ? [{ key: "vendor", label: t("NPC vendor"), lines: [t(vendor)] }]
    : sailingBadges(itemId, shop, t, formatNumber);
  if (badges.length === 0) return null;
  return (
    <div
      className="mt-2"
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setActive(null);
      }}
    >
      <div className="flex flex-wrap gap-1">
        {badges.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-describedby={`${id}-${key}`}
            onFocus={() => setActive(key)}
            onBlur={() => setActive(null)}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(key);
            }}
            onClick={() => setActive(key)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setActive(null);
            }}
            className={`rounded-md border px-1.5 py-0.5 text-left text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${badgeColors[key]}`}
          >
            {label}
          </button>
        ))}
      </div>
      {badges.map(({ key, lines }) => (
        <div
          key={key}
          id={`${id}-${key}`}
          role="tooltip"
          hidden={active !== key}
          className="mt-1 max-w-xs space-y-1 rounded-md border border-slate-200 bg-slate-50 p-2 text-left text-xs text-slate-700 dark:border-satella-border dark:bg-satella-base dark:text-slate-200"
        >
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
