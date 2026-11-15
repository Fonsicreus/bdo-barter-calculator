import { Boxes } from "lucide-react";

function formatWeight(value) {
  return `${value.toLocaleString()} LT`;
}

function formatFailureReason(reason) {
  if (reason === "offer_limit") {
    return "The remaining offer limits are too low to complete a full chain.";
  }
  if (reason === "source_limit") {
    return "The available starting goods are insufficient for a safe chain.";
  }
  if (reason === "capacity") {
    return "No complete chain fits the ship's cargo limit at every stage.";
  }
  return "No safe chain could be found with the entered values.";
}

function getInputWarnings(result) {
  return [
    result.needsShipCapacity && "Enter a valid live max cargo in Vessel Configuration.",
    result.invalidPreloadedCargo && "Pre-loaded cargo must be a non-negative LT value.",
    result.invalidStartLimit && "Available starting units must be a whole number of zero or more.",
    result.invalidTierRange && "Choose a final tier higher than the starting tier.",
    result.missingRatioTiers.length > 0 &&
      `Enter a valid exact ratio for every leg: ${result.missingRatioTiers
        .map((tier) => `Level ${tier} → ${tier + 1}`)
        .join(", ")}.`,
    result.invalidOfferLimitTiers.length > 0 &&
      "Offer limits must be positive whole-number trade counts.",
    result.invalidTierWeight !== null &&
      `Official unit weight is missing for Level ${result.invalidTierWeight}.`,
  ].filter(Boolean);
}

function ChainInputWarnings({ result }) {
  const warnings = getInputWarnings(result);
  return (
    <div className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200" role="alert">
      {warnings.map((warning) => (
        <p key={warning}>{warning}</p>
      ))}
    </div>
  );
}

function ChainPlanDetails({ plan, startTier, targetTier, shipMaxWeight }) {
  const otherGoods = plan.remainingGoods.filter((good) => good.tier !== targetTier);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">Buy / load</div>
          <div className="font-mono text-xl font-extrabold text-purple-700 dark:text-satella-glow">
            {plan.sourceUnits.toLocaleString()} × Level {startTier}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">Final output</div>
          <div className="font-mono text-xl font-extrabold text-slate-900 dark:text-satella-silver-glow">
            {plan.finalOutputUnits.toLocaleString()} × Level {targetTier}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 dark:bg-satella-void/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">Peak cargo</div>
          <div className="font-mono text-xl font-extrabold text-slate-900 dark:text-satella-silver-glow">
            {formatWeight(plan.maxCargoWeight)} / {shipMaxWeight.toLocaleString()} LT
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {plan.steps.map((step) => (
          <div
            key={step.fromTier}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.2fr_1.6fr] gap-1 rounded-lg bg-white/70 px-3 py-2 text-xs dark:bg-satella-void/40"
          >
            <span className="font-semibold text-slate-800 dark:text-satella-silver">
              Level {step.fromTier} → {step.toTier}
            </span>
            <span>{step.tradeCount.toLocaleString()} exchanges</span>
            <span>
              {step.inputUnits.toLocaleString()} in → {step.outputUnits.toLocaleString()} out
            </span>
            <span className="font-mono">
              {formatWeight(step.weightBefore)} → {formatWeight(step.weightAfter)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
        {otherGoods.length > 0
          ? `Other goods still aboard: ${otherGoods
              .map((good) => `${good.units.toLocaleString()} × Level ${good.tier}`)
              .join(", ")}. `
          : "No lower-tier goods remain aboard after the chain. "}
        Final cargo is {formatWeight(plan.finalCargoWeight)} with{" "}
        {plan.finalCargoWeight === shipMaxWeight
          ? " no"
          : ` ${plan.remainingCapacityAtPeak.toLocaleString()}`}{" "}
        LT free at peak load.
      </p>
    </>
  );
}

function ChainPlanOutcome({ result, startTier, targetTier, shipMaxWeight }) {
  const hasMissingInputs =
    result.needsShipCapacity ||
    result.invalidPreloadedCargo ||
    result.invalidStartLimit ||
    result.invalidTierRange ||
    result.missingRatioTiers.length > 0 ||
    result.invalidOfferLimitTiers.length > 0 ||
    result.invalidTierWeight !== null;

  if (hasMissingInputs) return <ChainInputWarnings result={result} />;
  if (!result.plan) {
    return (
      <output className="text-xs text-rose-700 dark:text-rose-300">
        {formatFailureReason(result.failureReason)}
      </output>
    );
  }

  return (
    <ChainPlanDetails
      plan={result.plan}
      startTier={startTier}
      targetTier={targetTier}
      shipMaxWeight={shipMaxWeight}
    />
  );
}

export function BarterChainResult({ result, startTier, targetTier, shipMaxWeight }) {
  return (
    <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-b from-purple-50/60 to-white p-4 dark:border-satella-border dark:from-satella-surface/60 dark:to-satella-card">
      <div className="mb-3 flex items-center gap-2 text-purple-700 dark:text-satella-glow">
        <Boxes className="w-4 h-4" />
        <h3 className="text-sm font-bold">Recommended purchase and chain</h3>
      </div>
      <ChainPlanOutcome
        result={result}
        startTier={startTier}
        targetTier={targetTier}
        shipMaxWeight={shipMaxWeight}
      />
    </div>
  );
}
