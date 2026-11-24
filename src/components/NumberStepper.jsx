import { ChevronDown, ChevronUp } from "lucide-react";

const stepButtonClass =
  "grid h-5 w-full place-items-center rounded text-purple-700 hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-purple-500 dark:text-purple-300 dark:hover:bg-satella-hover";

export function NumberStepper({ label, value, min = 0, max, step = 1, onStep, unit, ...input }) {
  const change = (direction) => {
    const next = Number(value || 0) + direction * step;
    onStep(Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.max(min, next)));
  };

  return (
    <div className="relative">
      <input
        {...input}
        type="number"
        inputMode="numeric"
        className={`custom-number-stepper ${input.className} ${unit ? "pr-20" : "pr-10"}`}
        value={value}
        min={min}
        max={max}
        step={step}
      />
      <div
        className={`absolute top-1/2 flex w-6 -translate-y-1/2 flex-col items-center ${unit ? "right-10" : "right-1.5"}`}
      >
        <button
          type="button"
          className={stepButtonClass}
          aria-label={`${label}: +${step}`}
          onClick={() => change(1)}
        >
          <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={stepButtonClass}
          aria-label={`${label}: −${step}`}
          onClick={() => change(-1)}
        >
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
      {unit && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-purple-300">
          {unit}
        </span>
      )}
    </div>
  );
}
