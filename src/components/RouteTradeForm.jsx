import { Plus } from "lucide-react";
import { useState } from "react";
import { BARTER_TIERS } from "../data/barterTiers";
import { useLanguage } from "../i18n/LanguageContext";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-satella-border dark:bg-satella-surface dark:text-satella-silver";

export function RouteTradeForm({ onAddStop }) {
  const { t } = useLanguage();
  const [source, setSource] = useState(1);
  const [destination, setDestination] = useState(2);
  const [ratioInput, setRatioInput] = useState("1");
  const [ratioOutput, setRatioOutput] = useState("2");
  const [count, setCount] = useState("1");
  const [reuse, setReuse] = useState(true);

  const values = [ratioInput, ratioOutput, count].map((value) =>
    value === "" ? Number.NaN : Number(value),
  );
  const valid =
    values.every((value) => Number.isSafeInteger(value) && value > 0) &&
    Number.isSafeInteger(values[0] * values[2]) &&
    Number.isSafeInteger(values[1] * values[2]);

  function changeSource(value) {
    setSource(value);
    setDestination(value + 1);
    const preset = BARTER_TIERS[value].typicalRatios[0];
    setRatioInput(String(preset?.input ?? 1));
    setRatioOutput(String(preset?.output ?? 1));
  }

  function add(event) {
    event.preventDefault();
    if (!valid) return;
    onAddStop({
      id:
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      inputTierLevel: source,
      outputTierLevel: destination,
      ratioInput: values[0],
      ratioOutput: values[1],
      tradeCount: values[2],
      inputUnitWeight: BARTER_TIERS[source].unitWeight,
      outputUnitWeight: BARTER_TIERS[destination].unitWeight,
      reusePrevious: reuse,
    });
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
            "Enter each offer and its number of exchanges. Add them in the order you will visit them.",
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Starting goods")}</span>
          <select
            value={source}
            onChange={(event) => changeSource(Number(event.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6].map((tier) => (
              <option key={tier} value={tier}>
                {t("Level")} {tier} ({BARTER_TIERS[tier].unitWeight} LT)
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Received Material (Output)")}</span>
          <select
            value={destination}
            onChange={(event) => setDestination(Number(event.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6, 7]
              .filter((tier) => tier !== source)
              .map((tier) => (
                <option key={tier} value={tier}>
                  {t("Level")} {tier} ({BARTER_TIERS[tier].unitWeight} LT)
                </option>
              ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Input units per exchange")}</span>
          <input
            aria-label={t("Input units per exchange")}
            type="number"
            min="1"
            step="1"
            value={ratioInput}
            onChange={(event) => setRatioInput(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Output units per exchange")}</span>
          <input
            aria-label={t("Output units per exchange")}
            type="number"
            min="1"
            step="1"
            value={ratioOutput}
            onChange={(event) => setRatioOutput(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-satella-silver">
          <span>{t("Number of exchanges")}</span>
          <input
            aria-label={t("Number of exchanges")}
            type="number"
            min="1"
            step="1"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className={inputClass}
          />
        </label>
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
      {!valid && (
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {t("Enter positive whole numbers for both quantities and the exchange count.")}
        </p>
      )}
      <button
        type="submit"
        disabled={!valid}
        className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-satella-primary dark:text-satella-void"
      >
        <Plus className="h-4 w-4" /> {t("Add exchange")}
      </button>
    </form>
  );
}
