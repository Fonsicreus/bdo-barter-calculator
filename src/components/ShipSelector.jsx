import { Anchor, Compass, Gauge, Package, RefreshCw, Shield } from "lucide-react";
import { OFFICIAL_SHIPS } from "../data/ships";

const CATEGORIES = ["Tier 3 (Carrack)", "Tier 2 (Upgraded)", "Tier 1 (Base)", "Beginner"];

export function ShipSelector({
  selectedShip,
  onSelectShip,
  maxWeight,
  onMaxWeightChange,
  currentCargo,
  onCurrentCargoChange,
  onResetToBaseWeight,
  maxWeightError,
  isCapacityValid,
  capacityBonus,
  availableCapacity,
}) {
  const isCustomWeight = maxWeight !== selectedShip.baseWeight;

  return (
    <div className="rounded-2xl p-5 sm:p-6 transition-colors duration-300 border bg-white border-slate-200/80 shadow-sm dark:bg-satella-card dark:border-satella-border/80 dark:shadow-satella-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-satella-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-satella-surface dark:text-satella-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-satella-silver-glow flex items-center gap-2">
              Vessel Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your vessel and enter the live maximum cargo shown in its in-game information
              window.
            </p>
          </div>
        </div>

        {/* Available cargo badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto px-3 py-1.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-satella-surface dark:border-satella-border">
          <Gauge className="w-4 h-4 text-purple-600 dark:text-satella-primary" />
          <div className="text-right">
            <div className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-400">
              Available Cargo
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-purple-700 dark:text-satella-glow">
              {isCapacityValid ? `${availableCapacity.toLocaleString()} LT` : "—"}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {isCapacityValid
                ? `of ${maxWeight.toLocaleString()} LT total`
                : "configure ship capacity"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
        {/* Ship Dropdown */}
        <div className="md:col-span-5 space-y-2">
          <label
            htmlFor="ship-select"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver flex items-center justify-between"
          >
            <span>Official BDO Vessel</span>
            <span className="text-xs text-purple-600 dark:text-satella-glow font-normal">
              Base: {selectedShip.baseWeight.toLocaleString()} LT
            </span>
          </label>
          <div className="relative">
            <select
              id="ship-select"
              value={selectedShip.id}
              onChange={(e) => {
                const found = OFFICIAL_SHIPS.find((s) => s.id === e.target.value);
                if (found) onSelectShip(found);
              }}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 border bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border dark:focus:ring-satella-primary dark:focus:border-transparent"
            >
              {CATEGORIES.map((category) => (
                <optgroup
                  key={category}
                  label={category}
                  className="font-semibold text-purple-600 dark:text-purple-400 bg-white dark:bg-satella-surface"
                >
                  {OFFICIAL_SHIPS.filter((s) => s.category === category).map((ship) => (
                    <option
                      key={ship.id}
                      value={ship.id}
                      className="text-slate-800 dark:text-slate-200"
                    >
                      {ship.name} ({ship.baseWeight.toLocaleString()} LT)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-purple-400" />
              Cannons: {selectedShip.cannons}
            </span>
            <span className="flex items-center gap-1">
              <Anchor className="w-3.5 h-3.5 text-slate-400 dark:text-purple-400" />
              Cabins: {selectedShip.cabins}
            </span>
          </div>
        </div>

        {/* Actual Max Cargo Input */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="max-weight-input"
              className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
            >
              Actual Max Cargo (from Ship Info)
            </label>
            {isCustomWeight && (
              <button
                type="button"
                onClick={onResetToBaseWeight}
                className="text-xs text-purple-600 hover:text-purple-800 dark:text-satella-glow dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset to Hull Base
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="max-weight-input"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              aria-invalid={maxWeightError ? "true" : "false"}
              aria-describedby={`max-weight-help${maxWeightError ? " max-weight-error" : ""}`}
              value={maxWeight || ""}
              onChange={(e) => onMaxWeightChange(Number.parseFloat(e.target.value) || 0)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold transition-colors duration-200 border bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 dark:bg-satella-surface dark:text-satella-silver-glow pr-12 ${
                maxWeightError
                  ? "border-rose-400 focus:ring-rose-500 dark:border-rose-700"
                  : "border-slate-300 focus:ring-purple-500 dark:border-satella-border dark:focus:ring-satella-primary"
              }`}
              placeholder="Enter live total"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-purple-300 pointer-events-none">
              LT
            </span>
          </div>

          <div
            id="max-weight-help"
            className="rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2 text-xs dark:border-satella-border dark:bg-satella-surface/60"
          >
            <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
              <span>Hull base (reference only)</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-satella-silver">
                {selectedShip.baseWeight.toLocaleString()} LT
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
              <span>Configured gear/sailor bonus</span>
              <span className="font-mono font-semibold text-purple-600 dark:text-satella-glow">
                {isCapacityValid
                  ? `${capacityBonus > 0 ? "+" : ""}${capacityBonus.toLocaleString()} LT`
                  : "—"}
              </span>
            </div>
          </div>

          {maxWeightError ? (
            <p
              id="max-weight-error"
              role="alert"
              className="text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {maxWeightError}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the total LT shown in Ship Info. It already includes gear, sailors, and buffs;
              do not add the hull base again.
            </p>
          )}
        </div>

        {/* Current Pre-loaded Cargo Input */}
        <div className="md:col-span-3 space-y-2">
          <label
            htmlFor="current-cargo-input"
            className="block text-xs font-semibold text-slate-700 dark:text-satella-silver"
          >
            Pre-loaded Cargo (LT)
          </label>
          <div className="relative">
            <input
              id="current-cargo-input"
              type="number"
              min={0}
              step={10}
              inputMode="numeric"
              value={currentCargo === 0 ? "" : currentCargo}
              onChange={(e) => onCurrentCargoChange(Number.parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-mono font-medium transition-colors duration-200 border bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-satella-surface dark:text-satella-silver dark:border-satella-border dark:focus:ring-satella-primary pr-12"
              placeholder="0 (Empty)"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-purple-300 pointer-events-none">
              LT
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-start gap-1 pt-1">
            <Package className="w-3 h-3 shrink-0 mt-0.5" />
            Existing cargo, sailor food, or supplies. Do not include the goods you will exchange at
            the barter node.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-satella-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400 dark:text-slate-500">
        <span>
          Hull base and configured bonus are shown separately so the live total is never counted
          twice.
        </span>
      </div>
    </div>
  );
}
