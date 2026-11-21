import { ArrowRight, Info, Scale } from "lucide-react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";

function formatWeight(value) {
  return `${value.toLocaleString()} LT`;
}

function getInputWarnings(result, t) {
  return [
    result.needsShipCapacity && t("Enter a valid live max cargo in Vessel Configuration."),
    result.invalidPreloadedCargo && t("Pre-loaded cargo must be a non-negative LT value."),
    result.invalidStartUnits && t("Quantity to load must be a whole number of zero or more."),
    result.invalidTierRange && t("Choose a maximum level higher than the starting level."),
    result.missingRatioTiers.length > 0 &&
      t("Enter a valid ratio for: {levels}.", {
        levels: result.missingRatioTiers
          .map((tier) => `${t("Level")} ${tier} → ${tier + 1}`)
          .join(", "),
      }),
    result.invalidOfferLimitTiers.length > 0 &&
      t("Remaining offer limits must be whole numbers of zero or more."),
    result.invalidTierWeight !== null &&
      t("Unit weight is missing for Level {level}.", { level: result.invalidTierWeight }),
  ].filter(Boolean);
}

function ChainInputWarnings({ result }) {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200"
    >
      {getInputWarnings(result, t).map((warning) => (
        <p key={warning}>{warning}</p>
      ))}
    </div>
  );
}

function getStopMessage(plan, shipMaxWeight, t) {
  if (plan.stopReason === "target_tier")
    return t("Reached the selected maximum level {level}.", { level: plan.targetTier });
  if (plan.stopReason === "target_unreachable")
    return t(
      "The selected level cannot be reached with the available stock, capacity and offer limits. This plan reaches level {level}.",
      { level: plan.furthestTier },
    );
  if (plan.stopReason === "no_start_goods")
    return t("Load at least one starting good to simulate the chain.");
  if (plan.stopReason === "departure_capacity") {
    return t("Starting goods and pre-loaded cargo exceed capacity by {weight}.", {
      weight: formatWeight(plan.overCapacityAtDeparture),
    });
  }
  if (plan.stopReason === "capacity") {
    return t(
      "No room for another Level {from} → {to} exchange. One more would weigh {weight} against your {limit} limit.",
      {
        from: plan.blockedTier,
        to: plan.blockedTier + 1,
        weight: formatWeight(plan.nextTradeCargoWeight),
        limit: formatWeight(shipMaxWeight),
      },
    );
  }
  if (plan.stopReason === "offer_limit") {
    return t("The Level {from} → {to} offer has no remaining exchanges.", {
      from: plan.blockedTier,
      to: plan.blockedTier + 1,
    });
  }
  if (plan.stopReason === "insufficient_units") {
    return t("Not enough Level {level} goods for another offer; {count} more required.", {
      level: plan.blockedTier,
      count: plan.requiredInputUnits.toLocaleString(),
    });
  }
  if (plan.stopReason === "quantity_overflow") {
    return t("The entered ratio produces a quantity too large to calculate safely.");
  }
  return t("Chain simulation stopped.");
}

function ChainPlanDetails({ plan, startTier, shipMaxWeight }) {
  const { t } = useLanguage();
  const peakPercentage = Math.round((plan.maxCargoWeight / shipMaxWeight) * 100);
  const finalGoods = plan.remainingGoods.filter((good) => good.tier === plan.furthestTier);
  const totalExchanges = plan.steps.reduce((sum, step) => sum + step.tradeCount, 0);
  const progressColor =
    plan.maxCargoWeight > shipMaxWeight
      ? "bg-rose-500"
      : peakPercentage > 85
        ? "bg-amber-500"
        : "bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-satella-veil dark:to-satella-glow";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-200 bg-white/80 p-4 text-center dark:border-satella-border dark:bg-satella-surface/50">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("Recommended to load on this voyage")}
        </div>
        <div className="mt-1 font-mono text-3xl font-extrabold text-purple-700 dark:text-satella-glow">
          {plan.sourceUnits.toLocaleString()} × {t("Level")} {startTier}
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          {t("Of {available} available, leave {remaining} in storage for another trip.", {
            available: plan.availableUnits.toLocaleString(),
            remaining: plan.unitsLeftInStorage.toLocaleString(),
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        <div className="rounded-xl border border-purple-100 bg-white/70 p-3 dark:border-satella-border/40 dark:bg-satella-surface/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Furthest tier reached")}
          </div>
          <div className="font-mono text-2xl font-extrabold text-purple-700 dark:text-satella-glow">
            {t("Level")} {plan.furthestTier}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-satella-border/40 dark:bg-satella-surface/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Goods at furthest tier")}
          </div>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-satella-silver-glow">
            {finalGoods.reduce((sum, good) => sum + good.units, 0).toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-satella-border/40 dark:bg-satella-surface/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("Exchanges completed")}
          </div>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-satella-silver-glow">
            {totalExchanges.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-100/70 p-3.5 text-xs dark:border-satella-border dark:bg-satella-void/60">
        <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-satella-silver">
          <span>{t("Departure with starting goods:")}</span>
          <span className="font-mono font-semibold">
            {formatWeight(plan.startCargoWeight)} / {formatWeight(shipMaxWeight)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 font-medium text-slate-900 dark:text-satella-silver-glow">
          <span>{t("Peak cargo during chain:")}</span>
          <span className="font-mono font-bold">
            {formatWeight(plan.maxCargoWeight)} / {formatWeight(shipMaxWeight)} ({peakPercentage}%)
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400">
          <span>
            {plan.maxCargoWeight > shipMaxWeight ? t("Over normal capacity:") : t("Free at peak:")}
          </span>
          <span
            className={`font-mono font-semibold ${
              plan.maxCargoWeight > shipMaxWeight
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {plan.maxCargoWeight > shipMaxWeight
              ? t("{weight} over", { weight: formatWeight(plan.maxCargoWeight - shipMaxWeight) })
              : formatWeight(plan.remainingCapacityAtPeak)}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-satella-surface">
          <div
            className={`h-full transition-[width] duration-300 ${progressColor}`}
            style={{ width: `${Math.min(100, peakPercentage)}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400">
          <span>{t("Final cargo after the last exchange:")}</span>
          <span className="font-mono font-semibold">{formatWeight(plan.finalCargoWeight)}</span>
        </div>
      </div>

      {plan.steps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {t("Chain breakdown")}
          </h4>
          {plan.steps.map((step) => (
            <div
              key={step.fromTier}
              className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-satella-border dark:bg-satella-surface/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-satella-silver">
                  <span>
                    {t("Level")} {step.fromTier}
                  </span>
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  <span>
                    {t("Level")} {step.toTier}
                  </span>
                </div>
                <span className="rounded-full bg-purple-50 px-2.5 py-1 font-mono text-xs font-semibold text-purple-700 dark:bg-satella-void/60 dark:text-satella-glow">
                  {step.tradeCount.toLocaleString()} × {step.ratioInput}:{step.ratioOutput}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <span>
                  {step.inputUnits.toLocaleString()} {t("in →")} {step.outputUnits.toLocaleString()}{" "}
                  {t("out")}
                </span>
                <span className="font-mono">
                  {formatWeight(step.weightBefore)} → {formatWeight(step.weightAfter)}
                </span>
                {step.remainingInputUnits > 0 && (
                  <span>
                    {step.remainingInputUnits.toLocaleString()} {t("× Level")} {step.fromTier}{" "}
                    {t("remain")}
                  </span>
                )}
                <span className="font-mono text-emerald-700 dark:text-emerald-400">
                  {formatWeight(step.remainingCapacity)} {t("free after exchange")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">{getStopMessage(plan, shipMaxWeight, t)}</p>
          <p className="mt-1">
            {t("Starting goods include")} {plan.sourceUnits.toLocaleString()} {t("× Level")}{" "}
            {startTier}
            {t(
              ", added on top of your pre-loaded cargo. Any leftover goods stay aboard and count toward the next weight check.",
            )}
          </p>
          {plan.remainingGoods.length > 0 && (
            <p className="mt-1">
              {t("Final inventory:")}{" "}
              {plan.remainingGoods
                .map(
                  (good) =>
                    `${good.units.toLocaleString()} × ${t(BARTER_TIERS[good.tier].shortName)}`,
                )
                .join(", ")}
              .
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
        <p className="font-semibold">
          {t("Space available throughout the voyage: {weight}.", {
            weight: formatWeight(plan.remainingCapacityAtPeak),
          })}
        </p>
        {startTier > 1 && (
          <p className="mt-1">
            {t("For example, you could carry one of these alternatives as extra cargo:")}{" "}
            {Array.from({ length: startTier - 1 }, (_, i) => i + 1)
              .map(
                (tier) =>
                  `${Math.floor(plan.remainingCapacityAtPeak / BARTER_TIERS[tier].unitWeight).toLocaleString()} × ${t("Level")} ${tier}`,
              )
              .join(" · ")}
            .
          </p>
        )}
        <p className="mt-1">
          {t(
            "These alternatives use the same free space; do not add them together. They are carried unchanged throughout this chain; extra exchanges require a separate calculation and available inventory slots.",
          )}
        </p>
      </div>
    </div>
  );
}

function ChainPlanOutcome({ result, startTier, shipMaxWeight }) {
  const { t } = useLanguage();
  const hasMissingInputs =
    result.needsShipCapacity ||
    result.invalidPreloadedCargo ||
    result.invalidStartUnits ||
    result.invalidTierRange ||
    result.missingRatioTiers.length > 0 ||
    result.invalidOfferLimitTiers.length > 0 ||
    result.invalidTierWeight !== null;

  if (hasMissingInputs) return <ChainInputWarnings result={result} />;
  if (!result.plan) {
    const messages = {
      no_start_goods: "Enter the number of starting goods available.",
      departure_capacity: "Pre-loaded cargo exceeds the ship's capacity.",
      search_limit:
        "These custom ratios require too many combinations to calculate safely. Reduce the stock or adjust the ratios.",
      no_safe_trade:
        "No exchange fits within the available stock, cargo capacity and offer limits.",
    };
    return (
      <output className="text-xs text-amber-800 dark:text-amber-200">
        {t(messages[result.failureReason] ?? "No safe chain could be found.")}
      </output>
    );
  }

  return (
    <ChainPlanDetails plan={result.plan} startTier={startTier} shipMaxWeight={shipMaxWeight} />
  );
}

export function BarterChainResult({ result, startTier, shipMaxWeight }) {
  const { t } = useLanguage();
  const hasMissingInputs =
    result.needsShipCapacity ||
    result.invalidPreloadedCargo ||
    result.invalidStartUnits ||
    result.invalidTierRange ||
    result.missingRatioTiers.length > 0 ||
    result.invalidOfferLimitTiers.length > 0 ||
    result.invalidTierWeight !== null;
  const badgeClass = hasMissingInputs
    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
    : result.plan?.maxCargoWeight > shipMaxWeight
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
      : result.plan?.steps.length > 0
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300";
  const statusLabel = hasMissingInputs
    ? t("Needs input")
    : result.plan?.maxCargoWeight > shipMaxWeight
      ? t("Final overload estimate")
      : result.plan?.steps.length > 0
        ? t("Safe through Level {level}", { level: result.plan.furthestTier })
        : t("No exchange yet");

  return (
    <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-b from-purple-50/60 to-white p-4 dark:border-satella-border dark:from-satella-surface/60 dark:to-satella-card sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-purple-100 pb-3 dark:border-satella-border/60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-satella-glow">
          <Scale className="h-4 w-4" />
          <span>{t("Automatic chain result")}</span>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        {t(
          "Typical ratios are applied automatically. Confirm each offer in game; open the optional settings above only when a ratio or remaining offer limit differs.",
        )}
      </div>

      <ChainPlanOutcome result={result} startTier={startTier} shipMaxWeight={shipMaxWeight} />
    </div>
  );
}
