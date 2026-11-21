import { ArrowRightLeft } from "lucide-react";
import { useId } from "react";
import { BARTER_TIERS, ORDERED_TIER_KEYS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";

function parsePositiveInteger(rawValue) {
  if (rawValue.trim() === "") {
    return null;
  }

  const parsed = Number.parseInt(rawValue, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function BarterTradeForm({
  inputTierKey,
  onInputTierChange,
  outputTierKey,
  onOutputTierChange,
  inputUnitWeight,
  onInputUnitWeightChange,
  outputUnitWeight,
  onOutputUnitWeightChange,
  ownedQuantity,
  onOwnedQuantityChange,
  ratioInput,
  ratioOutput,
  onQuickRatioSelect,
  isCustomRatio,
  typicalRatios,
  onEnableCustomRatio,
  onCustomRatioChange,
  applyOfferLimit,
  onApplyOfferLimitChange,
  offerLimit,
  onOfferLimitChange,
}) {
  const { t } = useLanguage();
  const customRatioInputId = useId();
  const customRatioOutputId = useId();
  const inputUnitWeightId = useId();
  const outputUnitWeightId = useId();

  const inputTier = BARTER_TIERS[inputTierKey];
  const outputTier = BARTER_TIERS[outputTierKey];

  return (
    <div className="lg:col-span-7 rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-satella-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow">
              {t("Barter Trade Parameters")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t(
                "Enter the exact goods, ratio, and exchange cap shown in the barter offer. The offer always overrides the presets below.",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tier Selection Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Source Tier */}
        <div className="space-y-2">
          <label
            htmlFor="source-tier-select"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver flex items-center justify-between"
          >
            <span>{t("Source Material (Input)")}</span>
            <span className="font-mono text-purple-600 dark:text-satella-glow text-xs">
              {inputUnitWeight === null
                ? t("Enter exact LT/ea")
                : `${inputUnitWeight} ${t("LT/ea")}`}
            </span>
          </label>
          <select
            id="source-tier-select"
            value={inputTierKey}
            onChange={(e) => {
              const val = e.target.value;
              const numVal = Number(val);
              onInputTierChange(Number.isNaN(numVal) ? val : numVal);
            }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 border bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border dark:focus:ring-satella-primary"
          >
            {ORDERED_TIER_KEYS.map((k) => (
              <option key={`input-${k}`} value={k}>
                {t(BARTER_TIERS[k].name)} (
                {BARTER_TIERS[k].unitWeight === null
                  ? t("variable LT")
                  : `${BARTER_TIERS[k].unitWeight} LT`}
                )
              </option>
            ))}
          </select>
        </div>

        {/* Destination Tier */}
        <div className="space-y-2">
          <label
            htmlFor="dest-tier-select"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver flex items-center justify-between"
          >
            <span>{t("Received Material (Output)")}</span>
            <span className="font-mono text-purple-600 dark:text-satella-glow text-xs">
              {outputUnitWeight === null
                ? t("Enter exact LT/ea")
                : `${outputUnitWeight} ${t("LT/ea")}`}
            </span>
          </label>
          <select
            id="dest-tier-select"
            value={outputTierKey}
            onChange={(e) => {
              const val = e.target.value;
              const numVal = Number(val);
              onOutputTierChange(Number.isNaN(numVal) ? val : numVal);
            }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 border bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border dark:focus:ring-satella-primary"
          >
            {ORDERED_TIER_KEYS.map((k) => (
              <option key={`output-${k}`} value={k}>
                {t(BARTER_TIERS[k].name)} (
                {BARTER_TIERS[k].unitWeight === null
                  ? t("variable LT")
                  : `${BARTER_TIERS[k].unitWeight} LT`}
                )
              </option>
            ))}
          </select>
        </div>
      </div>

      {(inputTier.unitWeight === null || outputTier.unitWeight === null) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputTier.unitWeight === null && (
            <div className="space-y-2">
              <label
                htmlFor={inputUnitWeightId}
                className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
              >
                {t("Exact input item weight (LT each)")}
              </label>
              <input
                id={inputUnitWeightId}
                type="number"
                min={0.01}
                step="0.01"
                value={inputUnitWeight ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedWeight = value === "" ? null : Number.parseFloat(value);
                  onInputUnitWeightChange(
                    Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : null,
                  );
                }}
                placeholder={t("Read the exact item's LT")}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
              />
            </div>
          )}
          {outputTier.unitWeight === null && (
            <div className="space-y-2">
              <label
                htmlFor={outputUnitWeightId}
                className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
              >
                {t("Exact output item weight (LT each)")}
              </label>
              <input
                id={outputUnitWeightId}
                type="number"
                min={0.01}
                step="0.01"
                value={outputUnitWeight ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedWeight = value === "" ? null : Number.parseFloat(value);
                  onOutputUnitWeightChange(
                    Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : null,
                  );
                }}
                placeholder={t("Read the exact item's LT")}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
              />
            </div>
          )}
          <p className="sm:col-span-2 text-xs text-slate-500 dark:text-slate-400">
            {t(
              "Land goods and ship materials do not share one weight. Use the exact item selected at the barter node.",
            )}
          </p>
        </div>
      )}

      {/* Owned Quantity */}
      <div className="space-y-2">
        <label
          htmlFor="owned-quantity-input"
          className="block text-xs font-semibold text-slate-700 dark:text-satella-silver flex items-center justify-between"
        >
          <span>{t("Quantity Owned in Storage / Inventory")}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {t("Total Weight:")}{" "}
            {inputUnitWeight === null
              ? t("enter the exact unit weight")
              : `${(ownedQuantity * inputUnitWeight).toLocaleString()} LT`}
          </span>
        </label>
        <div className="relative">
          <input
            id="owned-quantity-input"
            type="number"
            min={0}
            step={1}
            value={ownedQuantity || ""}
            onChange={(e) =>
              onOwnedQuantityChange(Math.max(0, Number.parseInt(e.target.value, 10) || 0))
            }
            placeholder={t("e.g. 10")}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold transition-colors duration-200 border bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-satella-surface dark:text-satella-silver-glow dark:border-satella-border dark:focus:ring-satella-primary pr-20"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 dark:text-purple-300 pointer-events-none">
            {t("units")}
          </span>
        </div>
      </div>

      {/* Trade Ratio Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="block text-xs font-semibold text-slate-700 dark:text-satella-silver">
            {t("Exchange Ratio (Input : Output)")}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {typicalRatios.length > 0
              ? t("Choose the offer ratio or enter a custom one")
              : t("Enter the exact ratio shown in the barter offer")}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {typicalRatios.map((ratio) => {
            const isSelected =
              !isCustomRatio && ratioInput === ratio.input && ratioOutput === ratio.output;
            return (
              <button
                key={`${ratio.input}-${ratio.output}`}
                type="button"
                onClick={() => onQuickRatioSelect(ratio.input, ratio.output)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-colors duration-200 border ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 dark:bg-satella-primary dark:text-satella-void dark:border-satella-primary shadow-sm dark:shadow-satella-glow"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-satella-surface dark:text-satella-silver dark:hover:bg-satella-hover dark:border-satella-border"
                }`}
              >
                {ratio.input} : {ratio.output}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onEnableCustomRatio}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-colors duration-200 border ${
              isCustomRatio
                ? "bg-purple-600 text-white border-purple-600 dark:bg-satella-primary dark:text-satella-void dark:border-satella-primary shadow-sm dark:shadow-satella-glow"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-satella-surface dark:text-satella-silver dark:hover:bg-satella-hover dark:border-satella-border"
            }`}
          >
            {t("Custom")}
          </button>
        </div>

        {/* Custom Ratio Inputs */}
        {isCustomRatio && (
          <div className="flex items-center gap-2 pt-2 animate-fadeIn">
            <div className="flex-1">
              <label
                htmlFor={customRatioInputId}
                className="text-xs text-slate-400 dark:text-purple-300 block mb-1"
              >
                {t("Input Qty")}
              </label>
              <input
                id={customRatioInputId}
                type="number"
                min={1}
                value={ratioInput ?? ""}
                onChange={(e) => {
                  onCustomRatioChange(parsePositiveInteger(e.target.value), ratioOutput);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold border bg-slate-50 dark:bg-satella-surface dark:border-satella-border dark:text-satella-silver"
              />
            </div>
            <span className="text-sm font-bold text-slate-400 dark:text-purple-400 mt-4">:</span>
            <div className="flex-1">
              <label
                htmlFor={customRatioOutputId}
                className="text-xs text-slate-400 dark:text-purple-300 block mb-1"
              >
                {t("Output Qty")}
              </label>
              <input
                id={customRatioOutputId}
                type="number"
                min={1}
                value={ratioOutput ?? ""}
                onChange={(e) => {
                  onCustomRatioChange(ratioInput, parsePositiveInteger(e.target.value));
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold border bg-slate-50 dark:bg-satella-surface dark:border-satella-border dark:text-satella-silver"
              />
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t(
            "Input goods are loaded on top of pre-loaded cargo. After the exchange, received goods replace their weight. Ratios are presets only; the exact offer can differ.",
          )}
        </p>
      </div>

      {/* Offer-Specific Exchange Cap */}
      <div className="pt-2 border-t border-slate-100 dark:border-satella-border/40">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={applyOfferLimit}
              onChange={(e) => onApplyOfferLimitChange(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:bg-satella-surface dark:border-satella-border dark:checked:bg-satella-primary"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-satella-silver">
              {t("Cap by this offer's remaining exchange limit")}
            </span>
          </label>

          {applyOfferLimit && (
            <div className="flex items-center space-x-1.5">
              <input
                type="number"
                min={1}
                value={offerLimit ?? ""}
                onChange={(e) => {
                  onOfferLimitChange(parsePositiveInteger(e.target.value));
                }}
                aria-label={t("Offer-specific exchange limit")}
                className="w-16 rounded-lg px-2 py-1 text-xs font-mono font-bold text-center border bg-slate-50 text-slate-900 border-slate-300 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border"
              />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {t("remaining trades")}
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t(
            "Optional. The cap belongs to the individual barter offer, not to the island node. Leave this off when the offer shows no remaining limit.",
          )}
        </p>
        {applyOfferLimit && offerLimit === null && (
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            {t("Enter the remaining exchange count shown for this specific offer.")}
          </p>
        )}
      </div>
    </div>
  );
}
