import { Anchor, Heart } from "lucide-react";
import { useState } from "react";
import { BarterCalculator } from "./components/BarterCalculator";
import { BarterChainPlanner } from "./components/BarterChainPlanner";
import { Header } from "./components/Header";
import { OverloadSettings } from "./components/OverloadSettings";
import { QuickReference } from "./components/QuickReference";
import { RouteTradeForm } from "./components/RouteTradeForm";
import { ShipSelector } from "./components/ShipSelector";
import { TradeMenuTabs } from "./components/TradeMenuTabs";
import { TripPlanner } from "./components/TripPlanner";
import { useShipConfig } from "./hooks/useShipConfig";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./i18n/LanguageContext";
import { getOverloadCapacity } from "./utils/overload";

export function App() {
  const { t } = useLanguage();
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
  const [activeMenu, setActiveMenu] = useState("single");
  const [overloadEnabled, setOverloadEnabled] = useState(false);
  const finalCargoLimit =
    overloadEnabled && isCapacityValid ? getOverloadCapacity(maxWeight) : null;

  const handleAddStopToRoute = (stop) => {
    setRouteStops((prev) => [...prev, stop]);
  };

  const handleRemoveStop = (id) => {
    setRouteStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearStops = () => {
    setRouteStops([]);
  };

  const handleMoveStop = (index, direction) => {
    setRouteStops((previous) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= previous.length) return previous;
      const updated = [...previous];
      [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <TradeMenuTabs active={activeMenu} onChange={setActiveMenu} />
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

        <OverloadSettings
          enabled={overloadEnabled}
          onEnabledChange={setOverloadEnabled}
          finalCargoLimit={finalCargoLimit}
        />

        {/* Trade Calculator Section */}
        <div className="space-y-6 sm:space-y-8">
          <section hidden={activeMenu !== "single"} aria-labelledby="barter-calculator-heading">
            <BarterCalculator
              shipMaxWeight={maxWeight}
              finalCargoLimit={finalCargoLimit}
              currentShipWeight={currentCargo}
              shipCapacityValid={isCapacityValid}
              onAddStopToRoute={(stop) => {
                handleAddStopToRoute(stop);
                setActiveMenu("route");
              }}
            />
          </section>

          <section hidden={activeMenu !== "chain"}>
            <BarterChainPlanner
              shipMaxWeight={maxWeight}
              finalCargoLimit={finalCargoLimit}
              currentShipWeight={currentCargo}
              shipCapacityValid={isCapacityValid}
            />
          </section>
        </div>

        {/* Route Planner Section (Visible if user adds stops) */}
        <section
          hidden={activeMenu !== "route"}
          aria-labelledby="route-planner-heading"
          className="space-y-5"
        >
          <RouteTradeForm onAddStop={handleAddStopToRoute} />
          <TripPlanner
            stops={routeStops}
            onRemoveStop={handleRemoveStop}
            onClearStops={handleClearStops}
            onMoveStop={handleMoveStop}
            shipMaxWeight={maxWeight}
            initialCargoWeight={currentCargo}
            shipCapacityValid={isCapacityValid}
            finalCargoLimit={finalCargoLimit}
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
            <span>{t("Black Desert Online Barter Trade & Weight Calculator")}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span>{t("Crafted with")}</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500 inline" />
            <span>{t("in")}</span>
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
