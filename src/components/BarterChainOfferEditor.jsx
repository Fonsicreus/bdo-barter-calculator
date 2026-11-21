import { Settings2 } from "lucide-react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";

export function BarterChainOfferEditor({ steps, ratioInputs, onSelectRatio, onUpdateStepValue }) {
  const { t } = useLanguage();
  return (
    <details className="group rounded-xl border border-slate-200 bg-slate-50/70 dark:border-satella-border dark:bg-satella-surface/40">
      <summary className="flex cursor-pointer list-none items-center gap-2 p-3 text-sm font-semibold text-slate-800 marker:hidden dark:text-satella-silver">
        <Settings2 className="h-4 w-4 text-purple-600 dark:text-satella-glow" />
        {t("Adjust offer ratios or remaining limits")}
        <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">
          {t("Optional")}
        </span>
      </summary>

      <div className="space-y-3 border-t border-slate-200 p-3 dark:border-satella-border">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t(
            "Each leg starts with its first typical ratio preset. Check the in-game offer and change only the legs that differ. Offer limits are optional and belong to the individual offer.",
          )}
        </p>

        {steps.map((tier) => {
          const values = ratioInputs[tier] ?? {};
          const presets = BARTER_TIERS[tier].typicalRatios;
          const defaultPreset = presets[0];
          const selectedRatio =
            values.mode === "custom" ? "custom" : String(values.presetIndex ?? 0);

          return (
            <div
              key={tier}
              className="grid grid-cols-1 items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-satella-border dark:bg-satella-card sm:grid-cols-[minmax(9rem,1fr)_minmax(12rem,1.2fr)_minmax(9rem,1fr)]"
            >
              <div className="text-sm font-bold text-slate-800 dark:text-satella-silver">
                {t("Level")} {tier} → {tier + 1}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`chain-ratio-${tier}`}
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  {t("Input : output ratio")}
                </label>
                <select
                  id={`chain-ratio-${tier}`}
                  value={selectedRatio}
                  onChange={(event) => onSelectRatio(tier, event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
                >
                  {presets.map((ratio, index) => (
                    <option key={`${ratio.input}-${ratio.output}`} value={index}>
                      {ratio.input} : {ratio.output} {t("typical")}
                    </option>
                  ))}
                  <option value="custom">{t("Custom ratio")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`chain-limit-${tier}`}
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  {t("Remaining offer exchanges")}
                </label>
                <input
                  id={`chain-limit-${tier}`}
                  type="number"
                  min={0}
                  step={1}
                  value={values.offerLimit ?? ""}
                  onChange={(event) => onUpdateStepValue(tier, "offerLimit", event.target.value)}
                  placeholder={t("No limit entered")}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
                />
              </div>

              {selectedRatio === "custom" && (
                <div className="grid grid-cols-2 gap-2 sm:col-span-3">
                  <div className="space-y-1">
                    <label
                      htmlFor={`chain-custom-input-${tier}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {t("Input units per exchange")}
                    </label>
                    <input
                      id={`chain-custom-input-${tier}`}
                      type="number"
                      min={1}
                      step={1}
                      value={values.input ?? defaultPreset?.input ?? ""}
                      onChange={(event) => onUpdateStepValue(tier, "input", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`chain-custom-output-${tier}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {t("Output units per exchange")}
                    </label>
                    <input
                      id={`chain-custom-output-${tier}`}
                      type="number"
                      min={1}
                      step={1}
                      value={values.output ?? defaultPreset?.output ?? ""}
                      onChange={(event) => onUpdateStepValue(tier, "output", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </details>
  );
}
