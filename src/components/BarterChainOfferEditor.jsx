import { ArrowRight } from "lucide-react";

export function BarterChainOfferEditor({ steps, ratioInputs, onUpdateStepValue }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-satella-silver">
          Exact barter offer for each leg
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          These fields start blank so no route-specific ratio is assumed. Enter the offer's input :
          output count and, if shown, its remaining exchange limit.
        </p>
      </div>

      {steps.map((tier) => {
        const values = ratioInputs[tier] ?? {};
        return (
          <div
            key={tier}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 items-end rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-satella-border dark:bg-satella-surface/50"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-satella-silver">
              <span>Level {tier}</span>
              <ArrowRight className="w-4 h-4 text-purple-500" />
              <span>Level {tier + 1}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label
                  htmlFor={`chain-ratio-input-${tier}`}
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Input units
                </label>
                <input
                  id={`chain-ratio-input-${tier}`}
                  type="number"
                  min={1}
                  step={1}
                  value={values.input ?? ""}
                  onChange={(event) => onUpdateStepValue(tier, "input", event.target.value)}
                  className="w-full rounded-lg px-2.5 py-2 text-sm font-mono border bg-white text-slate-900 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:border-satella-border"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`chain-ratio-output-${tier}`}
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Output units
                </label>
                <input
                  id={`chain-ratio-output-${tier}`}
                  type="number"
                  min={1}
                  step={1}
                  value={values.output ?? ""}
                  onChange={(event) => onUpdateStepValue(tier, "output", event.target.value)}
                  className="w-full rounded-lg px-2.5 py-2 text-sm font-mono border bg-white text-slate-900 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:border-satella-border"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`chain-offer-limit-${tier}`}
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Offer limit
                </label>
                <input
                  id={`chain-offer-limit-${tier}`}
                  type="number"
                  min={1}
                  step={1}
                  value={values.offerLimit ?? ""}
                  onChange={(event) => onUpdateStepValue(tier, "offerLimit", event.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-lg px-2.5 py-2 text-sm font-mono border bg-white text-slate-900 border-slate-300 dark:bg-satella-card dark:text-satella-silver dark:border-satella-border"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
