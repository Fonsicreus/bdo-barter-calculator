import { Route } from "lucide-react";
import { useMemo, useState } from "react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";
import { calculateAutomaticTierChain } from "../utils/calculator";
import { BarterChainOfferEditor } from "./BarterChainOfferEditor";
import { BarterChainResult } from "./BarterChainResult";

const START_LEVELS = [1, 2, 3, 4, 5, 6];

function parseNumber(rawValue) {
  if (rawValue.trim() === "") return null;
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function BarterChainPlanner({
  shipMaxWeight,
  currentShipWeight,
  shipCapacityValid,
  finalCargoLimit,
}) {
  const { t } = useLanguage();
  const [startTier, setStartTier] = useState(2);
  const [targetTier, setTargetTier] = useState(7);
  const [startUnitsRaw, setStartUnitsRaw] = useState("1");
  const [ratioInputs, setRatioInputs] = useState({});

  const steps = useMemo(
    () => Array.from({ length: targetTier - startTier }, (_, index) => startTier + index),
    [startTier, targetTier],
  );

  const ratios = useMemo(
    () =>
      Object.fromEntries(
        steps.map((tier) => {
          const values = ratioInputs[tier] ?? {};
          const defaultRatio = BARTER_TIERS[tier].typicalRatios[0];
          const selectedRatio =
            values.mode === "custom"
              ? { input: parseNumber(values.input ?? ""), output: parseNumber(values.output ?? "") }
              : (BARTER_TIERS[tier].typicalRatios[values.presetIndex ?? 0] ?? defaultRatio);

          return [
            tier,
            {
              input: selectedRatio?.input ?? null,
              output: selectedRatio?.output ?? null,
              offerLimit: parseNumber(values.offerLimit ?? ""),
            },
          ];
        }),
      ),
    [ratioInputs, steps],
  );

  const result = useMemo(
    () =>
      calculateAutomaticTierChain({
        startTier,
        targetTier,
        startUnits: parseNumber(startUnitsRaw),
        shipMaxWeight,
        finalCargoLimit,
        preloadedCargoWeight: currentShipWeight,
        ratios,
        shipCapacityValid,
      }),
    [
      startTier,
      targetTier,
      startUnitsRaw,
      shipMaxWeight,
      finalCargoLimit,
      currentShipWeight,
      ratios,
      shipCapacityValid,
    ],
  );

  const updateStepValue = (tier, field, value) => {
    setRatioInputs((previous) => ({
      ...previous,
      [tier]: { ...previous[tier], [field]: value },
    }));
  };

  const selectRatio = (tier, value) => {
    setRatioInputs((previous) => {
      const current = previous[tier] ?? {};
      if (value === "custom") {
        const defaultRatio = BARTER_TIERS[tier].typicalRatios[0] ?? {};
        return {
          ...previous,
          [tier]: {
            ...current,
            mode: "custom",
            input: current.input ?? String(defaultRatio.input ?? ""),
            output: current.output ?? String(defaultRatio.output ?? ""),
          },
        };
      }

      return {
        ...previous,
        [tier]: { ...current, mode: "preset", presetIndex: Number(value) },
      };
    });
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-satella-border/80 dark:bg-satella-card dark:shadow-satella-card sm:p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-satella-border/60">
        <div className="rounded-xl bg-purple-50 p-2 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
          <Route className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow">
            {t("Automatic Barter Chain")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t(
              "Enter the goods you start with. The calculator chains every possible tier and stops when cargo space, stock, or an offer limit prevents the next exchange.",
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("The planner finds how many goods to load to maximize the selected final level.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="chain-start-tier"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            {t("Starting goods")}
          </label>
          <select
            id="chain-start-tier"
            value={startTier}
            onChange={(event) => {
              const tier = Number(event.target.value);
              setStartTier(tier);
              if (tier >= targetTier) setTargetTier(tier + 1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
          >
            {START_LEVELS.map((tier) => (
              <option key={tier} value={tier}>
                {t("Level")} {tier} ({BARTER_TIERS[tier].unitWeight.toLocaleString()}{" "}
                {t("LT each)")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="chain-target-tier"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            {t("Maximum level")}
          </label>
          <select
            id="chain-target-tier"
            value={targetTier}
            onChange={(event) => setTargetTier(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
          >
            {Array.from({ length: 7 - startTier }, (_, index) => startTier + index + 1).map(
              (tier) => (
                <option key={tier} value={tier}>
                  {t("Level")} {tier} ({BARTER_TIERS[tier].unitWeight.toLocaleString()}{" "}
                  {t("LT each)")}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="chain-start-units"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            {t("Starting goods available")}
          </label>
          <div className="relative">
            <input
              id="chain-start-units"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={startUnitsRaw}
              onChange={(event) => setStartUnitsRaw(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-20 font-mono text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {t("units")}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("Weight of available goods:")}{" "}
            {startUnitsRaw && Number.isFinite(Number(startUnitsRaw))
              ? (Number(startUnitsRaw) * BARTER_TIERS[startTier].unitWeight).toLocaleString()
              : "—"}{" "}
            {t("LT; the recommended load is calculated below.")}
          </p>
        </div>
      </div>

      <BarterChainOfferEditor
        steps={steps}
        ratioInputs={ratioInputs}
        onSelectRatio={selectRatio}
        onUpdateStepValue={updateStepValue}
      />

      <BarterChainResult result={result} startTier={startTier} shipMaxWeight={shipMaxWeight} />
    </section>
  );
}
