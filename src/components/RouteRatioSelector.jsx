import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";

export function RouteRatioSelector({ tier, value, onChange, debugEnabled = false }) {
  const { t } = useLanguage();
  const presets = BARTER_TIERS[tier].typicalRatios;
  const custom = debugEnabled && tier !== 0 && value.mode === "custom";
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-satella-border dark:bg-satella-surface/40">
      <div className="text-sm font-semibold text-slate-800 dark:text-satella-silver">
        {t("Level")} {tier} → {t("Level")} {tier + 1}
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((ratio, index) => (
          <button
            key={`${ratio.input}:${ratio.output}`}
            type="button"
            aria-pressed={!custom && value.presetIndex === index}
            onClick={() => onChange({ mode: "preset", presetIndex: index })}
            className={`rounded-lg border px-4 py-2 font-mono text-sm font-bold ${!custom && value.presetIndex === index ? "border-purple-600 bg-purple-600 text-white dark:border-satella-primary dark:bg-satella-primary dark:text-satella-void" : "border-slate-300 bg-white text-slate-700 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver"}`}
          >
            {ratio.input}:{ratio.output}
          </button>
        ))}
        {debugEnabled && tier !== 0 && (
          <button
            type="button"
            aria-pressed={custom}
            onClick={() =>
              onChange({
                mode: "custom",
                input: value.input ?? String(presets[value.presetIndex]?.input ?? 1),
                output: value.output ?? String(presets[value.presetIndex]?.output ?? 1),
              })
            }
            className={`rounded-lg border px-4 py-2 text-sm font-bold ${custom ? "border-purple-600 bg-purple-600 text-white dark:border-satella-primary dark:bg-satella-primary dark:text-satella-void" : "border-slate-300 bg-white text-slate-700 dark:border-satella-border dark:bg-satella-card dark:text-satella-silver"}`}
          >
            {t("Custom")}
          </button>
        )}
      </div>
      {custom && (
        <div className="grid max-w-sm grid-cols-2 gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-300">
            {t("Input Qty")}
            <input
              type="number"
              min="1"
              step="1"
              value={value.input ?? ""}
              onChange={(event) => onChange({ ...value, input: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-satella-border dark:bg-satella-card"
            />
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">
            {t("Output Qty")}
            <input
              type="number"
              min="1"
              step="1"
              value={value.output ?? ""}
              onChange={(event) => onChange({ ...value, output: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-satella-border dark:bg-satella-card"
            />
          </label>
        </div>
      )}
      <details className="text-xs text-slate-600 dark:text-slate-300">
        <summary className="cursor-pointer">{t("Optional offer limit")}</summary>
        <label className="mt-2 block">
          {t("Remaining offer exchanges")}
          <input
            type="number"
            min="0"
            step="1"
            value={value.offerLimit ?? ""}
            onChange={(event) => onChange({ ...value, offerLimit: event.target.value })}
            className="mt-1 block w-full max-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-satella-border dark:bg-satella-card"
          />
        </label>
      </details>
    </div>
  );
}
