import { ChevronDown, Coins, Package, RotateCcw, Ship, Wrench } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { CalculatorMenuTabs } from "../components/CalculatorMenuTabs";
import { LanguageSelector } from "../components/LanguageSelector";
import { NumberStepper } from "../components/NumberStepper";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getSitePaths } from "../components/SiteNavigation";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../i18n/LanguageContext";
import {
  MAX_FRAGMENT_PRICE,
  MAX_QUANTITY,
  createDefaultInventory,
  loadInventory,
  parseInventoryQuantity,
  resetInventory,
  saveInventory,
} from "./inventory";

const levelOptions = Array.from({ length: 11 }, (_, level) => level);
const panelClass =
  "rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-satella-border dark:bg-satella-card";
const inputClass =
  "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 dark:border-satella-border dark:bg-satella-base dark:text-slate-100";
const upgradeMenus = [
  { id: "ship", label: "Ship Upgrade", icon: Ship, panelId: "ship-panel" },
  { id: "equipment", label: "Ship Equipment", icon: Wrench, panelId: "equipment-panel" },
];

function useUpgradeText() {
  const { t, language, setLanguage } = useLanguage();
  const formatNumber = useMemo(() => new Intl.NumberFormat(language).format, [language]);
  return { t, language, setLanguage, formatNumber };
}

export function resolveLocalIcon(icon, baseUrl) {
  if (typeof icon !== "string" || !icon || icon !== icon.trim()) return null;
  try {
    const decoded = decodeURIComponent(icon);
    if (
      /[\\:?#\s]/.test(decoded) ||
      Array.from(decoded).some((character) => character.charCodeAt(0) < 32) ||
      decoded.startsWith("/") ||
      decoded.split("/").some((segment) => segment === ".." || segment === ".")
    ) {
      return null;
    }
    return `${getSitePaths(baseUrl).barter}${icon}`;
  } catch {
    return null;
  }
}

export function ItemIcon({ icon }) {
  const source = resolveLocalIcon(icon);
  const [failedSource, setFailedSource] = useState(null);
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-lg text-purple-600 dark:border-satella-border dark:bg-satella-base dark:text-purple-300"
    >
      {source && source !== failedSource ? (
        <img
          src={source}
          alt=""
          className="h-8 w-8 object-contain"
          loading="lazy"
          onError={() => setFailedSource(source)}
        />
      ) : (
        <span>◇</span>
      )}
    </span>
  );
}

function QuantityInput({
  label,
  value,
  onChange,
  className = "",
  max = MAX_QUANTITY,
  showLabel = false,
}) {
  const { t } = useLanguage();
  const inputId = useId();
  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className={showLabel ? "mb-2 block text-sm font-semibold" : "sr-only"}
      >
        {label}
      </label>
      <NumberStepper
        id={inputId}
        label={label}
        max={max}
        value={value}
        placeholder={value === "" ? t("Enter price") : undefined}
        onStep={onChange}
        className={inputClass}
        onChange={(event) => {
          const quantity = parseInventoryQuantity(event.target.value);
          if (quantity !== null && quantity <= max) onChange(quantity);
        }}
      />
    </div>
  );
}

function GearControl({ gear, level, row, onChange }) {
  const { t } = useLanguage();
  const required = (row?.required ?? 0) > 0;
  const targetLevel = gear.targetLevel ?? 10;
  const selectId = useId();
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-satella-border">
      <div className="mb-3 flex items-start gap-3">
        <ItemIcon icon={gear.icon} />
        <div className="min-w-0">
          <label htmlFor={selectId} className="block text-sm font-semibold">
            {t(gear.name)}
          </label>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {gear.tier === "green"
              ? t("Green equipment")
              : gear.tier === "blue"
                ? t("Blue equipment")
                : t("Equipment")}
            {" · "}
            {targetLevel > 0
              ? t("Target +{level}", { level: targetLevel })
              : t("No enhancement needed")}
          </p>
        </div>
      </div>
      <select
        id={selectId}
        className={inputClass}
        value={level}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        <option value={-1}>{t("Not owned")}</option>
        {gear.fixedLevel ? (
          <option value={0}>{t("Owned")}</option>
        ) : (
          levelOptions.map((levelOption) => (
            <option key={levelOption} value={levelOption}>
              +{levelOption}
            </option>
          ))
        )}
      </select>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
        {level < 0
          ? t("Not owned")
          : targetLevel === 0
            ? t("Owned")
            : level >= targetLevel
              ? t("+{level} reached", { level: targetLevel })
              : t("Current +{level} / target +{target}", { level, target: targetLevel })}
        {" · "}
        {required ? t("Required for this plan") : t("Not currently required")}
      </p>
      {required && (
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          {level >= 0 ? <p>{t("Base part owned")}</p> : <Acquisition row={row} shop={gear.shop} />}
          {level < 0 && gear.source && <p className="mt-1">{t(gear.source)}</p>}
        </div>
      )}
    </div>
  );
}

function EquipmentRecipes({ gear, items, rowsById }) {
  const { t, formatNumber } = useUpgradeText();
  const recipes = gear.filter(
    ({ id }) => items[id]?.recipe && rowsById.get(id)?.status === "craft",
  );
  if (recipes.length === 0) return null;

  return (
    <div className="mt-5 space-y-2">
      <h3 className="font-semibold">{t("Blue equipment recipes")}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t(
          "Craft in the level 4 Ship Part Workshop at Port Epheria 1-4, 2F. Each piece starts at +0.",
        )}
      </p>
      {recipes.map(({ id, name }) => {
        const { ingredients, source } = items[id].recipe;
        return (
          <details
            key={id}
            className="rounded-lg border border-slate-200 dark:border-satella-border"
          >
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">{t(name)}</summary>
            <ul className="space-y-1 px-3 pb-3 text-sm text-slate-600 dark:text-slate-300">
              {Object.entries(ingredients).map(([ingredientId, quantity]) => (
                <li key={ingredientId}>
                  {formatNumber(quantity)} × {t(items[ingredientId].name)}
                  {gear.some((part) => part.id === ingredientId) && " +10"}
                </li>
              ))}
            </ul>
            {source && (
              <a href={source} className="mb-3 ml-3 inline-block text-xs font-semibold underline">
                {t("Recipe source (BDO Codex)")}
              </a>
            )}
          </details>
        );
      })}
    </div>
  );
}

function groupEquipment({ gear, items }) {
  const groups = [];
  const pairedIds = new Set();

  for (const blue of gear.filter(({ tier }) => tier === "blue")) {
    const ingredients = items[blue.id]?.recipe?.ingredients ?? {};
    const green = gear.find(({ id, tier }) => tier === "green" && Object.hasOwn(ingredients, id));
    groups.push(green ? [blue, green] : [blue]);
    if (green) pairedIds.add(green.id);
  }

  for (const part of gear) {
    if (part.tier !== "blue" && !pairedIds.has(part.id)) groups.push([part]);
  }
  return groups;
}

function Acquisition({ row, shop }) {
  const { t, formatNumber } = useUpgradeText();
  if (row.required === 0) return <span>{t("Not currently needed")}</span>;
  if (row.missing === 0)
    return <span className="text-emerald-700 dark:text-emerald-300">{t("Owned")}</span>;
  const labels = {
    owned: t("Check inventory"),
    craft: t("Craft"),
    buy: t("Shop purchase"),
    unpriced: t("Unpriced"),
    other: t("Other acquisition"),
    market: t("Central Market (silver)"),
  };
  const purchase = row.purchase;
  return (
    <div className="space-y-1">
      <span className={row.status === "unpriced" ? "text-amber-700 dark:text-amber-300" : ""}>
        {labels[row.status] ?? labels.other}
      </span>
      {row.status === "buy" && shop?.unitPrice > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("{price} CC per unit", { price: formatNumber(shop.unitPrice) })}
        </p>
      )}
      {purchase?.boxes > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("Purchase plan: {plan}", {
            plan: [
              t("{boxes} × box of {quantity}", {
                boxes: formatNumber(purchase.boxes),
                quantity: formatNumber(purchase.bundleQuantity),
              }),
              purchase.units > 0 &&
                t("{units} individual", { units: formatNumber(purchase.units) }),
            ]
              .filter(Boolean)
              .join(" + "),
          })}
        </p>
      )}
    </div>
  );
}

function formatMaterialCost(item, row, repairSilver, t, formatNumber) {
  if (item.category === "repair") {
    return Number.isFinite(repairSilver)
      ? t("{price} silver", { price: formatNumber(repairSilver) })
      : t("Price not set");
  }
  if (row.missing === 0) return "0";
  if (row.status === "other") return "—";
  return row.cost === null ? t("Unpriced") : t("{price} CC", { price: formatNumber(row.cost) });
}

function MaterialRow({ item, row, owned, onOwnedChange, repair }) {
  const { t, formatNumber } = useUpgradeText();
  return (
    <tr className="border-t border-slate-200 align-top dark:border-satella-border">
      <th scope="row" className="px-3 py-4 text-left font-normal">
        <div className="flex items-start gap-3">
          <ItemIcon icon={item.icon} />
          <div>
            <span className="font-semibold">{t(item.name)}</span>
            {item.category === "enhancement" && (
              <span className="mt-1 block text-xs text-purple-700 dark:text-purple-300">
                {repair ? t("Ancient Anvil scenario") : t("Minimum stones")}
              </span>
            )}
            {item.source && (
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                {t(item.source)}
              </span>
            )}
          </div>
        </div>
      </th>
      <td className="px-3 py-4 tabular-nums">{formatNumber(row.required)}</td>
      <td className="px-3 py-4">
        <QuantityInput
          label={t("Owned {item}", { item: t(item.name) })}
          value={owned}
          onChange={onOwnedChange}
          className="w-28"
        />
      </td>
      <td className="px-3 py-4 font-semibold tabular-nums">{formatNumber(row.missing)}</td>
      <td className="px-3 py-4 text-sm">
        <Acquisition row={row} shop={item.shop} />
      </td>
      <td className="px-3 py-4 text-right tabular-nums">
        {formatMaterialCost(item, row, repair?.marketSilver, t, formatNumber)}
      </td>
    </tr>
  );
}

function MaterialTable({ materials, rowsById, owned, onOwnedChange, repair }) {
  const { t } = useLanguage();
  if (materials.length === 0) return null;
  return (
    <section
      className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-satella-border"
      aria-label={t("Material requirements, scroll horizontally for all columns")}
    >
      <table className="w-full min-w-[780px] text-sm">
        <caption className="sr-only">
          {t(
            "Required materials, editable owned quantities, missing quantities, acquisition and purchase costs",
          )}
        </caption>
        <thead className="bg-slate-50 text-xs text-slate-600 dark:bg-satella-base dark:text-slate-300">
          <tr>
            {["Item", "Required", "Owned", "Missing", "Acquisition", "Purchase cost"].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`px-3 py-3 font-semibold ${heading === "Purchase cost" ? "text-right" : "text-left"}`}
                >
                  {t(heading)}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {materials.map(([id, item]) => (
            <MaterialRow
              key={id}
              item={item}
              owned={owned[id] ?? 0}
              row={rowsById.get(id) ?? { required: 0, missing: 0 }}
              onOwnedChange={(quantity) => onOwnedChange(id, quantity)}
              repair={repair}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function InventoryMenu({ onReset, saveFailed, resetMessage }) {
  const { t } = useLanguage();
  return (
    <details className="group relative shrink-0">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-purple-50 dark:border-satella-border dark:bg-satella-card dark:hover:bg-satella-hover">
        <Package aria-hidden="true" className="h-4 w-4 text-purple-600 dark:text-purple-300" />
        {t("Inventory")}
        {saveFailed && (
          <span className="text-xs text-amber-700 dark:text-amber-300">{t("Not saved")}</span>
        )}
        <ChevronDown aria-hidden="true" className="h-4 w-4 group-open:rotate-180" />
      </summary>
      <div className="absolute top-full z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg sm:right-0 dark:border-satella-border dark:bg-satella-card">
        <p className="text-slate-600 dark:text-slate-300">
          {t("Your quantities and equipment progress are saved in this browser.")}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold hover:bg-purple-50 dark:border-satella-border dark:hover:bg-satella-hover"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          {t("Reset upgrade inventory")}
        </button>
        <output className={resetMessage ? "mt-2 block" : "sr-only"}>{resetMessage}</output>
        {saveFailed && (
          <p role="alert" className="mt-2 text-amber-700 dark:text-amber-300">
            {t("Inventory could not be saved in this browser.")}
          </p>
        )}
      </div>
    </details>
  );
}

function RepairBudget({ repair, fragmentRow, model, marketPrice, onMarketPriceChange, sources }) {
  const { t, formatNumber } = useUpgradeText();
  const reference = model.marketReference;

  return (
    <section aria-labelledby="repair-heading" className={panelClass}>
      <h2 id="repair-heading" className="text-lg font-bold">
        {t("Worst-case max durability repairs")}
      </h2>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {t(
          "Starts at zero Agris Essence and counts all failures before guaranteed success at each remaining level.",
        )}{" "}
        <a href={sources?.ancientAnvil} className="underline">
          {t("Ancient Anvil")}
        </a>
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(
          "{failures} failed attempts consume {durability} max durability. Full restoration takes {required} Memory Fragments ({missing} missing).",
          {
            failures: formatNumber(repair.failures),
            durability: formatNumber(repair.durabilityLost),
            required: formatNumber(fragmentRow.required),
            missing: formatNumber(fragmentRow.missing),
          },
        )}{" "}
        {t("Update how many you own in the equipment materials table.")}
      </p>
      <a
        href={sources?.memoryFragment}
        className="mt-2 inline-block text-xs text-purple-700 underline dark:text-purple-300"
      >
        {t("Recovery per fragment: +5 green, +2 blue")}
      </a>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="w-full sm:w-72">
          <QuantityInput
            label={t("Silver per Memory Fragment")}
            value={marketPrice ?? ""}
            max={MAX_FRAGMENT_PRICE}
            onChange={onMarketPriceChange}
            showLabel
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t("Enter your region’s current Central Market price.")}
          </p>
          {reference && sources?.memoryMarket && (
            <div className="mt-2 space-y-1 text-xs">
              <button
                type="button"
                onClick={() => onMarketPriceChange(reference.silver)}
                className="rounded-lg border border-purple-300 px-2 py-1 font-semibold text-purple-800 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-satella-hover"
              >
                {t("Use {region} reference ({price})", {
                  region: t(reference.region),
                  price: formatNumber(reference.silver),
                })}
              </button>
              <p className="text-slate-500 dark:text-slate-400">
                <a href={sources.memoryMarket} className="underline">
                  Garmoth
                </a>{" "}
                · {t(reference.date)} · {t("not a live quote")}
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">{t("Silver for missing Memory Fragments")}</p>
          <p className="mt-2 text-xl font-bold tabular-nums">
            {repair.marketSilver === null
              ? t("Price not set")
              : t("{price} silver", { price: formatNumber(repair.marketSilver) })}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("No Artisan’s Memory, duplicate parts, or existing wear included.")}
          </p>
        </div>
      </div>
    </section>
  );
}

function RoutePicker({ fleet, route, onChange }) {
  const { t } = useLanguage();
  const originId = useId();
  const destinationId = useId();
  const origins = new Map(fleet.routes.map(({ origin, originName }) => [origin, originName]));
  const destinations = fleet.routes.filter(({ origin }) => origin === route.origin);
  return (
    <section aria-label={t("Ship upgrade route")} className={panelClass}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={originId} className="mb-2 block text-sm font-semibold">
            {t("Current ship")}
          </label>
          <select
            id={originId}
            className={inputClass}
            value={route.origin}
            onChange={(event) => {
              const next = fleet.routes.find(({ origin }) => String(origin) === event.target.value);
              if (next) onChange(next.id);
            }}
          >
            {[...origins].map(([id, name]) => (
              <option key={id} value={id}>
                {t(name)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={destinationId} className="mb-2 block text-sm font-semibold">
            {t("Upgrade to")}
          </label>
          <select
            id={destinationId}
            className={inputClass}
            value={route.id}
            onChange={(event) => onChange(event.target.value)}
          >
            {destinations.map(({ id, destinationName }) => (
              <option key={id} value={id}>
                {t(destinationName)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {t(
          "Plan one wharf upgrade at a time. Switching routes keeps your inventory and does not spend any materials.",
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {t("Direct builds such as Panokseon and gear for finished Carracks are not ship upgrades.")}
      </p>
    </section>
  );
}

export function ShipUpgradeApp({ catalog: singleCatalog, fleet, calculatePlan }) {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage, formatNumber } = useUpgradeText();
  const inventoryCatalog = fleet ?? singleCatalog;
  const [inventory, setInventory] = useState(() => loadInventory(inventoryCatalog));
  const [saveFailed, setSaveFailed] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);
  const [activeMenu, setActiveMenu] = useState(upgradeMenus[0].id);
  const [worstCase, setWorstCase] = useState(false);
  const catalog = fleet
    ? fleet.routes.find(({ id }) => id === (inventory.routeId ?? fleet.defaultRouteId))
    : singleCatalog;
  const originName = t(catalog.originName ?? "Epheria Caravel");
  const destinationName = t(catalog.destinationName ?? "Epheria Carrack: Advance");
  const title = t("Ship Upgrade Calculator");
  const plan = useMemo(
    () => calculatePlan(catalog, inventory, { worstCase }),
    [catalog, calculatePlan, inventory, worstCase],
  );
  const rowsById = new Map(plan.rows.map((row) => [row.id, row]));
  const gearGroups = groupEquipment(catalog);
  const gearIds = new Set(catalog.gear.map((gear) => gear.id));
  const materials = Object.entries(catalog.items).filter(
    ([id, item]) => !gearIds.has(id) && (plan.repair || item.category !== "repair"),
  );
  const equipmentMaterials = materials.filter(
    ([id]) => !Object.hasOwn(catalog.requirements ?? {}, id),
  );
  const shipMaterials = materials.filter(([id]) => Object.hasOwn(catalog.requirements ?? {}, id));
  const shipGear = catalog.gear.filter(({ id }) => Object.hasOwn(catalog.requirements ?? {}, id));
  const hasRecipes = catalog.gear.some(({ id }) => catalog.items[id].recipe);
  const hasKnownCrowShop = !fleet || materials.some(([, item]) => item.shop?.unitPrice > 0);
  const hasStoneBoxes = !fleet || materials.some(([, item]) => item.shop?.bundle);
  const boxesId = useId();

  useEffect(() => {
    document.title = `${title} · ${destinationName}`;
  }, [title, destinationName]);

  useEffect(() => {
    setSaveFailed(!saveInventory(inventoryCatalog, inventory));
  }, [inventoryCatalog, inventory]);

  const changeRoute = (routeId) => {
    setInventory((previous) => ({ ...previous, routeId }));
    setActiveMenu(upgradeMenus[0].id);
    setWorstCase(false);
    setResetMessage(false);
  };

  const updateOwned = (id, quantity) => {
    setResetMessage(false);
    setInventory((previous) => ({ ...previous, owned: { ...previous.owned, [id]: quantity } }));
  };

  const updateFragmentPrice = (price) =>
    setInventory((previous) => ({ ...previous, memoryFragmentPrice: price || undefined }));

  const handleReset = () => {
    if (
      !window.confirm(
        t(
          "Reset ship upgrade inventory and prices, gear levels, Crow Coin balance, and weekly boxes? Your barter settings, language, and theme will not change.",
        ),
      )
    )
      return;
    resetInventory();
    setInventory({ ...createDefaultInventory(), routeId: inventory.routeId });
    setResetMessage(true);
  };

  return (
    <div lang={language} className="ship-upgrade-app flex min-h-screen flex-col">
      <SiteHeader
        current="ship-upgrades"
        title={title}
        subtitle={t("Black Desert Online • Ship Materials & Crow Coin Planner")}
        theme={theme}
        onToggleTheme={toggleTheme}
        t={t}
      >
        {setLanguage && <LanguageSelector />}
      </SiteHeader>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section
          aria-labelledby="upgrade-heading"
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
              {`${originName} → ${destinationName}`}
            </p>
            <h2 id="upgrade-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("Plan your next ship upgrade")}
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("Set your equipment levels and materials to see what is missing.")}
            </p>
          </div>
          <InventoryMenu
            onReset={handleReset}
            resetMessage={
              resetMessage
                ? t("Ship upgrade inventory reset. Barter settings and theme are unchanged.")
                : ""
            }
            saveFailed={saveFailed}
          />
        </section>

        {fleet && <RoutePicker fleet={fleet} route={catalog} onChange={changeRoute} />}

        <CalculatorMenuTabs
          label={t("Choose ship upgrade planner")}
          menus={upgradeMenus.map((menu) => ({ ...menu, label: t(menu.label) }))}
          active={activeMenu}
          onChange={setActiveMenu}
        />

        <section
          aria-label={t("Crow Coin shop-only estimate")}
          className="grid gap-3 sm:grid-cols-3"
        >
          <div className={panelClass}>
            <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Coins aria-hidden="true" className="h-4 w-4" />
              {t("Crow Coins needed")}
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {hasKnownCrowShop ? formatNumber(plan.buyableCost) : "—"}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {hasKnownCrowShop
                ? t("Shop-only estimate for missing, priced purchases.")
                : t(
                    "No Crow Coin shop purchases are modeled for this route. Check the requirements below.",
                  )}
            </p>
            {plan.unverifiedCount > 0 && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {plan.unverifiedCount === 1
                  ? t("1 acquisition entry needs verification.")
                  : t("{count} acquisition entries need verification.", {
                      count: formatNumber(plan.unverifiedCount),
                    })}
              </p>
            )}
          </div>
          <div className={panelClass}>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{t("Your balance")}</p>
            <QuantityInput
              label={t("Your balance in Crow Coins")}
              value={inventory.balance}
              onChange={(balance) => setInventory((previous) => ({ ...previous, balance }))}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {t("Crow Coins already available to spend.")}
            </p>
          </div>
          <div className={`${panelClass} border-purple-300 dark:border-purple-500/50`}>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t("Still to earn")}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-purple-700 dark:text-purple-300">
              {hasKnownCrowShop ? formatNumber(plan.stillToEarn) : "—"}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {t("Shop-only estimate minus your balance; not an all-in upgrade cost.")}
            </p>
          </div>
        </section>

        <div id="equipment-panel" hidden={activeMenu !== "equipment"} className="space-y-4">
          <section aria-labelledby="equipment-heading" className={panelClass}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="equipment-heading" className="text-lg font-bold">
                {t("Equipment progress")}
              </h2>
              {catalog.repairModel && (
                <label
                  title={t("Off: first-attempt success. On: fail until Ancient Anvil.")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold dark:border-satella-border"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-purple-600 dark:accent-purple-400"
                    checked={worstCase}
                    onChange={(event) => setWorstCase(event.target.checked)}
                  />
                  {t("Pity")}
                </label>
              )}
            </div>
            <p className="mb-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
              {hasRecipes || !fleet
                ? t(
                    "Green equipment at +10 is consumed to craft the matching blue piece. If you already own the blue piece, its green part and recipe are hidden. Blue pieces must still reach +10 for the ship upgrade.",
                  )
                : catalog.guaranteedEnhancement
                  ? t(
                      "Enter your current equipment levels. Each enhancement on this route is guaranteed.",
                    )
                  : t("The base equipment is enough for this upgrade. No enhancement is required.")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gearGroups.map((group) => {
                const visible = group.filter(
                  ({ id, tier }) => tier !== "green" || rowsById.get(id)?.required !== 0,
                );
                if (visible.length === 0) return null;
                const [firstPart] = group;
                return (
                  <div
                    key={firstPart.id}
                    data-gear-pair={firstPart.id}
                    className="grid gap-3 sm:row-span-2 sm:grid-rows-subgrid"
                  >
                    {visible.map((gear) => (
                      <GearControl
                        key={gear.id}
                        gear={{ ...catalog.items[gear.id], ...gear }}
                        level={inventory.gearLevels[gear.id] ?? -1}
                        row={rowsById.get(gear.id)}
                        onChange={(level) =>
                          setInventory((previous) => ({
                            ...previous,
                            gearLevels: { ...previous.gearLevels, [gear.id]: level },
                          }))
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
            <EquipmentRecipes gear={catalog.gear} items={catalog.items} rowsById={rowsById} />
          </section>

          {plan.repair && (
            <RepairBudget
              repair={plan.repair}
              fragmentRow={rowsById.get(catalog.repairModel.itemId)}
              model={catalog.repairModel}
              marketPrice={inventory.memoryFragmentPrice}
              onMarketPriceChange={updateFragmentPrice}
              sources={catalog.sources}
            />
          )}

          {equipmentMaterials.length > 0 && (
            <section aria-labelledby="materials-heading" className={panelClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 id="materials-heading" className="text-lg font-bold">
                    {t("Equipment materials & purchase plan")}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {t(
                      "Enter what you own. Fully owned and currently unused materials stay editable.",
                    )}
                  </p>
                </div>
                {hasStoneBoxes && (
                  <div className="w-full sm:w-64">
                    <label htmlFor={boxesId} className="mb-2 block text-sm font-semibold">
                      {t("Stone boxes remaining this week")}
                    </label>
                    <select
                      id={boxesId}
                      value={inventory.remainingStoneBoxes}
                      className={inputClass}
                      onChange={(event) =>
                        setInventory((previous) => ({
                          ...previous,
                          remainingStoneBoxes: Number(event.target.value),
                        }))
                      }
                    >
                      {levelOptions.map((quantity) => (
                        <option key={quantity} value={quantity}>
                          {quantity}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {t(
                        "0–10 available purchases. Update this manually when your weekly allowance changes.",
                      )}
                    </p>
                  </div>
                )}
              </div>
              <MaterialTable
                materials={equipmentMaterials}
                rowsById={rowsById}
                owned={inventory.owned}
                onOwnedChange={updateOwned}
                repair={plan.repair}
              />
            </section>
          )}
        </div>

        <section
          id="ship-panel"
          hidden={activeMenu !== "ship"}
          aria-labelledby="ship-heading"
          className={panelClass}
        >
          <h2 id="ship-heading" className="text-lg font-bold">
            {t("Upgrade to {ship}", { ship: destinationName })}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {catalog.guild
              ? t("This is a guild wharf upgrade. Track the guild's equipment and materials here.")
              : t(
                  "Bring the listed equipment and materials to the wharf. Equipment levels can be edited under Ship Equipment.",
                )}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {shipGear.map(({ id, name, targetLevel = 10 }) => {
              const level = inventory.gearLevels[id] ?? -1;
              const ready = level >= targetLevel;
              return (
                <li
                  key={id}
                  className="flex justify-between gap-2 rounded-lg border border-slate-200 p-2.5 text-sm dark:border-satella-border"
                >
                  <span className="font-semibold">
                    {targetLevel > 0 ? `${t(name)} +${targetLevel}` : t(name)}
                  </span>
                  <span
                    className={
                      ready
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-amber-700 dark:text-amber-300"
                    }
                  >
                    {ready
                      ? t("Ready")
                      : level < 0
                        ? t("Not owned")
                        : t("Current +{level}", { level })}
                  </span>
                </li>
              );
            })}
          </ul>
          <MaterialTable
            materials={shipMaterials}
            rowsById={rowsById}
            owned={inventory.owned}
            onOwnedChange={updateOwned}
          />
        </section>

        {catalog.sources && (
          <section
            aria-label={t("Sources and credits")}
            className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600 dark:border-satella-border dark:text-slate-300"
          >
            <p>
              {t("Data checked {date}.", { date: t(catalog.sources.verifiedOn) })}{" "}
              <a className="underline" href={catalog.sources.upgrade}>
                {t("Upgrade and item data (BDO Codex)")}
              </a>
              {" · "}
              <a className="underline" href={catalog.sources.prices}>
                {t("Crow Coin prices (Pearl Abyss, PC Asia)")}
              </a>
              {". "}
              {t("Listed shop prices also checked against community screenshots where available.")}
            </p>
            <p>
              {t("Game artwork by Pearl Abyss. Icon sources:")}{" "}
              <a className="underline" href={catalog.sources.gearIcons}>
                BDO Atlas
              </a>
              {" · "}
              <a className="underline" href="https://bdocodex.com/us/items/">
                BDO Codex
              </a>
              {" · "}
              {t("In-game screenshots")}.{" "}
              {t("Unofficial fan project, not endorsed by Pearl Abyss.")}
            </p>
          </section>
        )}
      </main>
      <SiteFooter description={t("Black Desert Online Ship Upgrade Calculator")} t={t} />
    </div>
  );
}
