import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

export function TradeCountEditor({ count, onChange }) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(String(count));
  const commit = () => {
    const value = Number(draft);
    if (Number.isSafeInteger(value) && value > 0) onChange(value);
    else setDraft(String(count));
  };
  return (
    <div className="mt-2 flex items-center gap-2">
      <span>{t("Exchange count")}</span>
      <button
        type="button"
        disabled={count <= 1}
        onClick={() => onChange(count - 1)}
        aria-label={t("Reduce exchange count")}
        className="rounded border border-slate-300 px-2 py-1 font-bold disabled:opacity-40 dark:border-satella-border"
      >
        −
      </button>
      <input
        type="number"
        min="1"
        step="1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        aria-label={t("Exchange count")}
        className="w-20 rounded border border-slate-300 bg-white px-2 py-1 dark:border-satella-border dark:bg-satella-card"
      />
      <button
        type="button"
        disabled={count >= Number.MAX_SAFE_INTEGER}
        onClick={() => onChange(count + 1)}
        aria-label={t("Increase exchange count")}
        className="rounded border border-slate-300 px-2 py-1 font-bold disabled:opacity-40 dark:border-satella-border"
      >
        +
      </button>
    </div>
  );
}
