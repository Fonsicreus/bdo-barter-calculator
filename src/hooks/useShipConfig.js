import { useEffect, useState } from "react";
import { DEFAULT_SHIP, OFFICIAL_SHIPS } from "../data/ships";
import { useLanguage } from "../i18n/LanguageContext";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies";

const SHIP_ID_COOKIE = "bdo_ship_id";
const SHIP_MAX_WEIGHT_COOKIE = "bdo_ship_actual_max_weight_v2";
const SHIP_CURRENT_CARGO_COOKIE = "bdo_ship_current_cargo";

export function useShipConfig() {
  const { t } = useLanguage();
  const [selectedShip, setSelectedShipState] = useState(() => {
    const savedId = getCookie(SHIP_ID_COOKIE);
    if (savedId) {
      const match = OFFICIAL_SHIPS.find((s) => s.id === savedId);
      if (match) return match;
    }
    return DEFAULT_SHIP;
  });

  const [maxWeight, setMaxWeightState] = useState(() => {
    const savedId = getCookie(SHIP_ID_COOKIE);
    const savedShip = OFFICIAL_SHIPS.find((ship) => ship.id === savedId);
    if (!savedShip) return null;

    const savedWeight = getCookie(SHIP_MAX_WEIGHT_COOKIE);
    if (savedWeight) {
      const parsed = Number.parseFloat(savedWeight);
      if (Number.isFinite(parsed) && parsed >= savedShip.baseWeight) {
        return parsed;
      }
    }
    return null;
  });

  const [currentCargo, setCurrentCargoState] = useState(() => {
    const savedCargo = getCookie(SHIP_CURRENT_CARGO_COOKIE);
    if (savedCargo) {
      const parsed = Number.parseFloat(savedCargo);
      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
      }
    }
    return 0;
  });

  // Save changes to cookies
  useEffect(() => {
    setCookie(SHIP_ID_COOKIE, selectedShip.id, 365);
  }, [selectedShip]);

  useEffect(() => {
    if (Number.isFinite(maxWeight) && maxWeight > 0) {
      setCookie(SHIP_MAX_WEIGHT_COOKIE, maxWeight.toString(), 365);
    } else {
      deleteCookie(SHIP_MAX_WEIGHT_COOKIE);
    }
  }, [maxWeight]);

  useEffect(() => {
    setCookie(SHIP_CURRENT_CARGO_COOKIE, currentCargo.toString(), 365);
  }, [currentCargo]);

  const selectShip = (ship) => {
    setSelectedShipState(ship);
    setMaxWeightState(null);
  };

  const setCustomMaxWeight = (weight) => {
    setMaxWeightState(Number.isFinite(weight) && weight > 0 ? weight : null);
  };

  const setCurrentCargo = (cargo) => {
    setCurrentCargoState(Number.isFinite(cargo) ? Math.max(0, cargo) : 0);
  };

  const resetToBaseWeight = () => {
    setMaxWeightState(selectedShip.baseWeight);
  };

  // maxWeight is the live total from the in-game Ship Info window. It already
  // includes the hull base, gear, sailors, and buffs, so it must never be
  // built by adding a bonus to baseWeight.
  const isCapacityValid =
    Number.isFinite(maxWeight) && maxWeight > 0 && maxWeight >= selectedShip.baseWeight;

  let maxWeightError = null;
  if (!Number.isFinite(maxWeight) || maxWeight <= 0) {
    maxWeightError = t("Enter the total max cargo shown in your ship's information window.");
  } else if (maxWeight < selectedShip.baseWeight) {
    maxWeightError = t("Must be at least the {ship} hull base of {weight} LT.", {
      ship: t(selectedShip.name),
      weight: selectedShip.baseWeight.toLocaleString(),
    });
  }

  return {
    selectedShip,
    selectShip,
    maxWeight,
    setCustomMaxWeight,
    currentCargo,
    setCurrentCargo,
    resetToBaseWeight,
    maxWeightError,
    isCapacityValid,
    capacityBonus: isCapacityValid ? maxWeight - selectedShip.baseWeight : 0,
    availableCapacity: isCapacityValid ? Math.max(0, maxWeight - currentCargo) : 0,
  };
}
