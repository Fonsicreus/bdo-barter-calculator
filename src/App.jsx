import { useState } from "react";
import { BarterCalculator } from "./components/BarterCalculator";
import { BarterChainPlanner } from "./components/BarterChainPlanner";
import { Header } from "./components/Header";
import { QuickReference } from "./components/QuickReference";
import { RouteTradeForm } from "./components/RouteTradeForm";
import { ShipSelector } from "./components/ShipSelector";
import { SiteFooter } from "./components/SiteFooter";
import { TradeMenuTabs } from "./components/TradeMenuTabs";
import { TripPlanner } from "./components/TripPlanner";
import { useShipConfig } from "./hooks/useShipConfig";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./i18n/LanguageContext";
import { getOverloadCapacity } from "./utils/overload";

export function App() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
  const [latestStopId, setLatestStopId] = useState(null);
  const [activeMenu, setActiveMenu] = useState("single");
  const [overloadEnabled, setOverloadEnabled] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const finalCargoLimit =
    overloadEnabled && isCapacityValid ? getOverloadCapacity(maxWeight) : null;

  const handleAddStopToRoute = (stop) => {
    setRouteStops((prev) => [...prev, stop]);
    setLatestStopId(stop.id);
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
    <div className="min-h-screen flex flex-col">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        debugEnabled={debugEnabled}
        onToggleDebug={() => setDebugEnabled((enabled) => !enabled)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t(
            "For Tier 0 exchanges, include the land materials in pre-loaded cargo. Their weight stays counted throughout the calculation, even after exchange; results are conservative only if all materials are included.",
          )}
        </p>
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
            overloadEnabled={overloadEnabled}
            onOverloadChange={setOverloadEnabled}
            finalCargoLimit={finalCargoLimit}
          />
        </section>

        {/* Trade Calculator Section */}
        <div className="space-y-6 sm:space-y-8">
          <section hidden={activeMenu !== "single"} aria-labelledby="barter-calculator-heading">
            <BarterCalculator
              key={String(debugEnabled)}
              debugEnabled={debugEnabled}
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
              debugEnabled={debugEnabled}
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
          <RouteTradeForm
            debugEnabled={debugEnabled}
            existingStops={routeStops}
            shipMaxWeight={maxWeight}
            initialCargoWeight={currentCargo}
            shipCapacityValid={isCapacityValid}
            finalCargoLimit={finalCargoLimit}
            onAddStops={(stops) => {
              setRouteStops((previous) => [...previous, ...stops]);
              setLatestStopId(stops.at(-1)?.id ?? null);
            }}
          />
          <TripPlanner
            stops={routeStops}
            onRemoveStop={handleRemoveStop}
            onClearStops={handleClearStops}
            onMoveStop={handleMoveStop}
            latestStopId={latestStopId}
            onChangeTradeCount={(id, count) =>
              setRouteStops((previous) =>
                previous.map((stop) => (stop.id === id ? { ...stop, tradeCount: count } : stop)),
              )
            }
            hideCargoSummary
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

      <SiteFooter description={t("Black Desert Online Barter Trade & Weight Calculator")} t={t} />
    </div>
  );
}

export default App;
