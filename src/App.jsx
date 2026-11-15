import { Anchor, Heart } from "lucide-react";
import { useState } from "react";
import { BarterCalculator } from "./components/BarterCalculator";
import { BarterChainPlanner } from "./components/BarterChainPlanner";
import { Header } from "./components/Header";
import { QuickReference } from "./components/QuickReference";
import { ShipSelector } from "./components/ShipSelector";
import { TripPlanner } from "./components/TripPlanner";
import { useShipConfig } from "./hooks/useShipConfig";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    selectedShip,
    selectShip,
    maxWeight,
    setCustomMaxWeight,
    currentCargo,
    setCurrentCargo,
    resetToBaseWeight,
    maxWeightError,
    isCapacityValid,
    capacityBonus,
    availableCapacity,
  } = useShipConfig();

  const [routeStops, setRouteStops] = useState([]);

  const handleAddStopToRoute = (stop) => {
    setRouteStops((prev) => [...prev, stop]);
  };

  const handleRemoveStop = (id) => {
    setRouteStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearStops = () => {
    setRouteStops([]);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Vessel Configuration Section */}
        <section aria-labelledby="vessel-config-heading">
          <ShipSelector
            selectedShip={selectedShip}
            onSelectShip={selectShip}
            maxWeight={maxWeight}
            onMaxWeightChange={setCustomMaxWeight}
            currentCargo={currentCargo}
            onCurrentCargoChange={setCurrentCargo}
            onResetToBaseWeight={resetToBaseWeight}
            maxWeightError={maxWeightError}
            isCapacityValid={isCapacityValid}
            capacityBonus={capacityBonus}
            availableCapacity={availableCapacity}
          />
        </section>

        {/* Trade Calculator Section */}
        <section aria-labelledby="barter-calculator-heading">
          <BarterCalculator
            shipMaxWeight={maxWeight}
            currentShipWeight={currentCargo}
            shipCapacityValid={isCapacityValid}
            onAddStopToRoute={handleAddStopToRoute}
          />
        </section>

        <BarterChainPlanner
          shipMaxWeight={maxWeight}
          currentShipWeight={currentCargo}
          shipCapacityValid={isCapacityValid}
        />

        {/* Route Planner Section (Visible if user adds stops) */}
        <section aria-labelledby="route-planner-heading">
          <TripPlanner
            stops={routeStops}
            onRemoveStop={handleRemoveStop}
            onClearStops={handleClearStops}
            shipMaxWeight={maxWeight}
            initialCargoWeight={currentCargo}
            shipCapacityValid={isCapacityValid}
          />
        </section>

        {/* Quick Reference Table for all BDO tiers & weights */}
        <section aria-labelledby="quick-reference-heading">
          <QuickReference />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-satella-border/60 py-6 bg-white/50 dark:bg-satella-base/50 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Anchor className="w-4 h-4 text-purple-600 dark:text-satella-primary" />
            <span>Black Desert Online Barter Trade & Weight Calculator</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500 inline" />
            <span>in</span>
            <span className="font-semibold text-purple-600 dark:text-satella-glow">
              {isDark ? "Satella Shadow Violet" : "Silver Mist"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
