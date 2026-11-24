import { deleteCookie, getCookie, setCookie } from "../utils/cookies";

export const INVENTORY_COOKIE_NAME = "bdo.ship-upgrades.inventory.v1";
export const INVENTORY_VERSION = 1;
export const MAX_QUANTITY = Number.MAX_SAFE_INTEGER;
export const MAX_FRAGMENT_PRICE = 1_000_000_000;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function boundedInteger(value, minimum, maximum, fallback) {
  return Number.isSafeInteger(value) && value >= minimum && value <= maximum ? value : fallback;
}

export function createDefaultInventory() {
  return { owned: {}, gearLevels: {}, balance: 0, remainingStoneBoxes: 10 };
}

export function normalizeInventory(catalog, value) {
  const inventory = createDefaultInventory();
  if (!isRecord(value)) return inventory;

  const gearIds = new Set(catalog.gear.map((gear) => gear.id));
  if (isRecord(value.owned)) {
    for (const id of Object.keys(catalog.items)) {
      if (gearIds.has(id) || !Object.hasOwn(value.owned, id)) continue;
      const quantity = boundedInteger(value.owned[id], 0, MAX_QUANTITY, 0);
      if (quantity > 0) {
        Object.defineProperty(inventory.owned, id, {
          value: quantity,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }
    }
  }
  if (isRecord(value.gearLevels)) {
    for (const id of gearIds) {
      if (!Object.hasOwn(value.gearLevels, id)) continue;
      const level = boundedInteger(value.gearLevels[id], -1, 10, -1);
      if (level >= 0) {
        Object.defineProperty(inventory.gearLevels, id, {
          value: level,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }
    }
  }
  inventory.balance = boundedInteger(value.balance, 0, MAX_QUANTITY, 0);
  inventory.remainingStoneBoxes = boundedInteger(value.remainingStoneBoxes, 0, 10, 10);
  const fragmentPrice = boundedInteger(value.memoryFragmentPrice, 1, MAX_FRAGMENT_PRICE, null);
  if (fragmentPrice !== null) inventory.memoryFragmentPrice = fragmentPrice;
  if (catalog.routes?.some(({ id }) => id === value.routeId)) inventory.routeId = value.routeId;
  return inventory;
}

export function parseInventoryQuantity(value) {
  if (value === "") return 0;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const quantity = Number(value);
  return Number.isSafeInteger(quantity) && quantity >= 0 ? quantity : null;
}

export function loadInventory(catalog) {
  try {
    const raw = getCookie(INVENTORY_COOKIE_NAME);
    if (!raw || raw.length > 3800) return createDefaultInventory();
    const saved = JSON.parse(raw);
    if (!isRecord(saved) || saved.version !== INVENTORY_VERSION) return createDefaultInventory();
    return normalizeInventory(catalog, saved.inventory);
  } catch {
    return createDefaultInventory();
  }
}

export function saveInventory(catalog, value) {
  try {
    if (typeof document === "undefined") return false;
    const serialized = JSON.stringify({
      version: INVENTORY_VERSION,
      inventory: normalizeInventory(catalog, value),
    });
    if (
      encodeURIComponent(INVENTORY_COOKIE_NAME).length + encodeURIComponent(serialized).length >
      3800
    ) {
      return false;
    }
    setCookie(INVENTORY_COOKIE_NAME, serialized, 365);
    return getCookie(INVENTORY_COOKIE_NAME) === serialized;
  } catch {
    return false;
  }
}

export function resetInventory() {
  try {
    deleteCookie(INVENTORY_COOKIE_NAME);
  } catch {
    return false;
  }
  return true;
}
