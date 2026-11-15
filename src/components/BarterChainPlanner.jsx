import { Route } from "lucide-react";
import { useMemo, useState } from "react";
import { BARTER_TIERS } from "../data/barterTiers";
import { calculateTierChain } from "../utils/calculator";
import { BarterChainOfferEditor } from "./BarterChainOfferEditor";
import { BarterChainResult } from "./BarterChainResult";

const LEVELS = [1, 2, 3, 4, 5, 6, 7];

function parseNumber(rawValue) {
  return rawValue.trim() === "" ? null : Number(rawValue);
}

export function BarterChainPlanner({ shipMaxWeight, currentShipWeight, shipCapacityValid }) {
  const [startTier, setStartTier] = useState(2);
  const [targetTier, setTargetTier] = useState(5);
  const [maxStartUnitsRaw, setMaxStartUnitsRaw] = useState("");
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
          return [
            tier,
            {
              input: parseNumber(values.input ?? ""),
              output: parseNumber(values.output ?? ""),
              offerLimit: parseNumber(values.offerLimit ?? ""),
            },
          ];
        }),
      ),
    [ratioInputs, steps],
  );

  const result = useMemo(
    () =>
      calculateTierChain({
        startTier,
        targetTier,
        shipMaxWeight,
        preloadedCargoWeight: currentShipWeight,
        maxStartUnits: parseNumber(maxStartUnitsRaw),
        ratios,
        shipCapacityValid,
      }),
    [
      startTier,
      targetTier,
      shipMaxWeight,
      currentShipWeight,
      maxStartUnitsRaw,
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

  const resetOfferValues = () => setRatioInputs({});

  return (
    <section className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-satella-border/60">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
          <Route className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow">
            Multi-Tier Barter Chain Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter each exact offer ratio. The planner finds the smallest starting load for the
            largest safe final batch and checks cargo after every exchange.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="chain-start-tier"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            Starting good
          </label>
          <select
            id="chain-start-tier"
            value={startTier}
            onChange={(event) => {
              const nextTier = Number(event.target.value);
              setStartTier(nextTier);
              if (nextTier >= targetTier) setTargetTier(nextTier + 1);
              resetOfferValues();
            }}
            className="w-full rounded-xl px-3 py-2.5 text-sm border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
          >
            {LEVELS.slice(0, 6).map((tier) => (
              <option key={tier} value={tier}>
                Level {tier} ({BARTER_TIERS[tier].unitWeight.toLocaleString()} LT each)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="chain-target-tier"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            Final good
          </label>
          <select
            id="chain-target-tier"
            value={targetTier}
            onChange={(event) => {
              setTargetTier(Number(event.target.value));
              resetOfferValues();
            }}
            className="w-full rounded-xl px-3 py-2.5 text-sm border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
          >
            {LEVELS.filter((tier) => tier > startTier).map((tier) => (
              <option key={tier} value={tier}>
                Level {tier} ({BARTER_TIERS[tier].unitWeight.toLocaleString()} LT each)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="chain-available-start"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            Maximum starting units available (optional)
          </label>
          <input
            id="chain-available-start"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={maxStartUnitsRaw}
            onChange={(event) => setMaxStartUnitsRaw(event.target.value)}
            placeholder="No stock limit"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-mono border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
          />
        </div>
      </div>

      <BarterChainOfferEditor
        steps={steps}
        ratioInputs={ratioInputs}
        onUpdateStepValue={updateStepValue}
      />

      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-200">
        Every good from earlier legs stays aboard until traded. The starting load includes only the
        calculated source units plus your pre-loaded cargo; surplus goods from each ratio remain in
        the weight check.
      </div>

      <BarterChainResult
        result={result}
        startTier={startTier}
        targetTier={targetTier}
        shipMaxWeight={shipMaxWeight}
      />
    </section>
  );
}
