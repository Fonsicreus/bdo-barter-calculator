import { Plus } from "lucide-react";
import { useState } from "react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";
import { simulateRoute } from "../utils/calculator";
import { buildRouteChain } from "../utils/routeChain";
import { findFittingQuantity } from "../utils/routeRecommendation";
import { RouteCargoSummary } from "./RouteCargoSummary";
import { RouteRatioSelector } from "./RouteRatioSelector";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver";

export function RouteTradeForm({
  onAddStops,
  debugEnabled = false,
  existingStops = [],
  shipMaxWeight,
  initialCargoWeight = 0,
  shipCapacityValid,
  finalCargoLimit,
}) {
  const { t } = useLanguage();
  const [source, setSource] = useState(1);
  const [destination, setDestination] = useState(2);
  const [quantity, setQuantity] = useState("1");
  const [reuse, setReuse] = useState(true);
  const [ratioChoices, setRatioChoices] = useState({});
  const tiers = Array.from({ length: destination - source }, (_, index) => source + index);
  const ratios = Object.fromEntries(
    tiers.map((tier) => {
      const choice = ratioChoices[tier] ?? { mode: "preset", presetIndex: 0 };
      const preset =
        BARTER_TIERS[tier].typicalRatios[choice.presetIndex ?? 0] ??
        BARTER_TIERS[tier].typicalRatios[0];
      return [
        tier,
        {
          ...(debugEnabled && tier !== 0 && choice.mode === "custom"
            ? { input: Number(choice.input || 0), output: Number(choice.output || 0) }
            : preset),
          offerLimit:
            choice.offerLimit == null || choice.offerLimit === ""
              ? null
              : Number(choice.offerLimit),
        },
      ];
    }),
  );
  const result = buildRouteChain({
    startTier: source,
    targetTier: destination,
    quantity: quantity === "" ? null : Number(quantity),
    ratios,
    reusePrevious: reuse,
  });
  const previewStops = result.error ? existingStops : [...existingStops, ...result.stops];
  const simulation = simulateRoute(
    previewStops,
    shipMaxWeight,
    initialCargoWeight,
    shipCapacityValid,
    finalCargoLimit,
  );
  const recommendation =
    !result.error &&
    simulation.isOverweight &&
    simulation.isCapacityValid &&
    !simulation.hasMissingWeights
      ? findFittingQuantity({
          quantity: Number(quantity),
          shipMaxWeight,
          initialCargoWeight,
          shipCapacityValid,
          finalCargoLimit,
          makeStops: (candidate) => {
            const candidateChain = buildRouteChain({
              startTier: source,
              targetTier: destination,
              quantity: candidate,
              ratios,
              reusePrevious: reuse,
            });
            return candidateChain.error ? null : [...existingStops, ...candidateChain.stops];
          },
        })
      : null;

  function add(event) {
    event.preventDefault();
    if (result.error) return;
    onAddStops(
      result.stops.map((stop) => ({
        ...stop,
        id:
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      })),
    );
    setQuantity("");
  }

  return (
    <form
      onSubmit={add}
      className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-satella-border dark:bg-satella-card sm:p-6"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow">
          {t("Add an exchange to your route")}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t(
            "Select the starting and final levels. The calculator adds each exchange in between; repeat to add independent trades.",
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Minimum level")}</span>
          <select
            value={source}
            onChange={(event) => {
              const value = Number(event.target.value);
              setSource(value);
              if (value >= destination) setDestination(value + 1);
            }}
            className={inputClass}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((tier) => (
              <option key={tier} value={tier}>
                {t("Level")} {tier} {tier !== 0 && <>({BARTER_TIERS[tier].unitWeight} LT)</>}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Maximum level")}</span>
          <select
            value={destination}
            onChange={(event) => setDestination(Number(event.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6, 7]
              .filter((tier) => tier > source)
              .map((tier) => (
                <option key={tier} value={tier}>
                  {t("Level")} {tier} ({BARTER_TIERS[tier].unitWeight} LT)
                </option>
              ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>
            {t(source === 0 ? "Number of Tier 0 exchanges" : "Starting units for this route")}
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-satella-silver">
          {t("Choose the ratio for each offer")}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("Ratios are suggestions. Select the amounts shown in each in-game offer.")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {tiers.map((tier) => (
            <RouteRatioSelector
              debugEnabled={debugEnabled}
              key={tier}
              tier={tier}
              value={ratioChoices[tier] ?? { mode: "preset", presetIndex: 0 }}
              onChange={(choice) =>
                setRatioChoices((current) => ({
                  ...current,
                  [tier]: { ...current[tier], ...choice },
                }))
              }
            />
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-satella-silver">
        <input
          type="checkbox"
          checked={reuse}
          onChange={(event) => setReuse(event.target.checked)}
          className="h-4 w-4 accent-purple-600"
        />
        {t("Use matching goods from earlier stops")}
      </label>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t(
          "Only reuse goods when they are the exact items requested by the offer. The calculator matches levels, not item names. Turn this off to load separate goods for this stop.",
        )}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t(
          "Only starting units used by the first exchange are loaded. Unused intermediate goods remain aboard; check the route weight and offer limits below.",
        )}
      </p>
      {result.error && quantity !== "" ? (
        <p className="text-xs text-amber-700 dark:text-amber-300" role="alert">
          {result.error === "insufficient_goods"
            ? t(
                "Not enough Level {level} goods for this ratio: {available} available, {required} required.",
                { level: result.tier, available: result.available, required: result.required },
              )
            : result.error === "offer_exhausted"
              ? t("The Level {level} offer has no remaining exchanges.", { level: result.tier })
              : result.error === "invalid_limit"
                ? t("Remaining offer limits must be whole numbers of zero or more.")
                : t("Enter positive whole numbers for the starting quantity and each ratio.")}
        </p>
      ) : !result.error ? (
        <div className="space-y-1 rounded-xl bg-purple-50 p-3 text-xs text-slate-700 dark:bg-satella-surface/60 dark:text-slate-200">
          <strong>{t("Automatic exchange preview")}</strong>
          {result.stops.map((stop) => (
            <p key={stop.inputTierLevel}>
              {t("Level")} {stop.inputTierLevel} → {stop.outputTierLevel}:{" "}
              {stop.tradeCount.toLocaleString()} × {stop.ratioInput}:{stop.ratioOutput} ={" "}
              {(stop.tradeCount * stop.ratioOutput).toLocaleString()} × {t("Level")}{" "}
              {stop.outputTierLevel}
            </p>
          ))}
        </div>
      ) : null}
      {simulation.isOverweight && !result.error && (
        <div
          role="alert"
          className="space-y-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
        >
          <p>{t("This proposed exchange makes the route exceed an allowed cargo limit.")}</p>
          {recommendation?.quantity != null ? (
            <button
              type="button"
              onClick={() => setQuantity(String(recommendation.quantity))}
              className="rounded-lg bg-rose-700 px-3 py-2 font-bold text-white"
            >
              {t("Use {count} starting exchanges or units instead", {
                count: recommendation.quantity.toLocaleString(),
              })}
            </button>
          ) : (
            <p>
              {t(
                recommendation?.limited
                  ? "No fitting quantity was found within the search limit. Reduce it further or change the route."
                  : "Reducing this addition alone cannot make the route fit; adjust the existing route or ship capacity.",
              )}
            </p>
          )}
        </div>
      )}
      {previewStops.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {t(
              result.error
                ? "Cargo overview: saved route only"
                : "Cargo overview includes this unsaved exchange",
            )}
          </p>
          <RouteCargoSummary
            simulation={simulation}
            shipMaxWeight={shipMaxWeight}
            finalCargoLimit={finalCargoLimit}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={Boolean(result.error)}
        className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-satella-primary dark:text-satella-void"
      >
        <Plus className="h-4 w-4" /> {t("Add exchanges to route")}
      </button>
    </form>
  );
}
