import { MAX_FRAGMENT_PRICE } from "./inventory";

function getCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function getGearLevel(value) {
  return Number.isInteger(value) && value >= 0 && value <= 10 ? value : -1;
}

function addRequirements(total, ingredients, batches = 1) {
  for (const [id, quantity] of Object.entries(ingredients)) {
    total.set(id, (total.get(id) ?? 0) + quantity * batches);
  }
}

function orderItems(items, requirementIds, gearIds, enhancementIds) {
  const ordered = new Set();
  const visiting = new Set();

  function visit(id) {
    if (ordered.has(id)) return;
    if (visiting.has(id)) throw new Error(`Circular ship upgrade recipe: ${id}`);
    if (!Object.hasOwn(items, id)) throw new Error(`Unknown ship upgrade item: ${id}`);

    visiting.add(id);
    for (const ingredient of Object.keys(items[id].recipe?.ingredients ?? {})) {
      visit(ingredient);
    }
    if (gearIds.has(id)) {
      for (const ingredient of enhancementIds) visit(ingredient);
    }
    visiting.delete(id);
    ordered.add(id);
  }

  for (const id of requirementIds) visit(id);
  return [...ordered].reverse();
}

function pricePurchase(quantity, shop, remainingBoxes) {
  const { unitPrice, bundle } = shop;
  let best = { cost: quantity * unitPrice, boxes: 0, units: quantity, excess: 0 };
  if (!bundle) return { cost: best.cost };

  const maxBoxes = Math.min(
    bundle.weeklyLimit,
    remainingBoxes === undefined ? bundle.weeklyLimit : getCount(remainingBoxes),
    Math.ceil(quantity / bundle.quantity),
  );

  for (let boxes = 1; boxes <= maxBoxes; boxes += 1) {
    const units = Math.max(0, quantity - boxes * bundle.quantity);
    const excess = boxes * bundle.quantity + units - quantity;
    const cost = boxes * bundle.price + units * unitPrice;
    if (cost < best.cost || (cost === best.cost && excess < best.excess)) {
      best = { cost, boxes, units, excess };
    }
  }

  return {
    cost: best.cost,
    purchase: { boxes: best.boxes, units: best.units, bundleQuantity: bundle.quantity },
  };
}

function addGearEnhancements(needed, steps, tier, level, missing, repairModel, repairTotals) {
  const failureCaps = repairModel?.failuresByTier[tier];
  let newPieceWear = 0;
  let ownedPieceWear = 0;

  for (const [index, ingredients] of steps.entries()) {
    const ownedPiece = Number(level >= 0 && index >= level);
    const pieces = missing + ownedPiece;
    if (pieces === 0) continue;

    const failures = failureCaps?.[index] ?? 0;
    addRequirements(needed, ingredients, pieces * (failures + 1));
    if (failures > 0) {
      const wear = failures * repairModel.durabilityLost[index];
      newPieceWear += wear;
      ownedPieceWear += ownedPiece * wear;
      repairTotals.failures += failures * pieces;
    }
  }

  if (failureCaps) {
    const perFragment = repairModel.durabilityPerFragment[tier];
    const fragments =
      missing * Math.ceil(newPieceWear / perFragment) + Math.ceil(ownedPieceWear / perFragment);
    addRequirements(needed, { [repairModel.itemId]: fragments });
    repairTotals.durabilityLost += missing * newPieceWear + ownedPieceWear;
  }
}

export function calculatePlan(catalog, inventory, { worstCase = false } = {}) {
  const { items, requirements, gear, enhancementSteps = [] } = catalog;
  const {
    owned: stock = {},
    gearLevels = {},
    balance,
    remainingStoneBoxes,
    memoryFragmentPrice,
  } = inventory;
  const repairModel = worstCase ? catalog.repairModel : null;
  const repairTotals = repairModel ? { failures: 0, durabilityLost: 0 } : null;
  const needed = new Map(Object.entries(requirements));
  const gearById = new Map(gear.map((piece) => [piece.id, piece]));
  const gearIds = new Set(gearById.keys());
  const enhancementIds = new Set(enhancementSteps.flatMap(Object.keys));
  if (repairModel) enhancementIds.add(repairModel.itemId);

  const ordered = orderItems(items, [...needed.keys(), ...enhancementIds], gearIds, enhancementIds);
  const rowsById = new Map();
  let buyableCost = 0;
  let silverCost = 0;
  let unverifiedCount = 0;

  for (const id of ordered) {
    const item = items[id];
    const required = needed.get(id) ?? 0;
    const isGear = gearIds.has(id);
    const level = getGearLevel(gearLevels[id]);
    const owned = isGear ? Number(level >= 0) : getCount(stock[id]);
    const missing = Math.max(0, required - owned);
    const row = { id, required, owned, missing, cost: null, status: "owned" };

    if (isGear && required > 0) {
      const { tier, targetLevel = 10 } = gearById.get(id);
      addGearEnhancements(
        needed,
        enhancementSteps.slice(0, targetLevel),
        tier,
        level,
        missing,
        repairModel,
        repairTotals,
      );
    }

    if (missing > 0) {
      if (id === repairModel?.itemId) {
        row.status = "market";
      } else if (item.recipe) {
        const batches = Math.ceil(missing / (item.recipe.quantity ?? 1));
        addRequirements(needed, item.recipe.ingredients, batches);
        row.status = "craft";
      } else if (item.shop?.unitPrice > 0) {
        Object.assign(row, pricePurchase(missing, item.shop, remainingStoneBoxes));
        row.status = "buy";
        buyableCost += row.cost;
      } else if (item.shop?.unverified) {
        row.status = "unpriced";
        unverifiedCount += 1;
      } else {
        row.status = "other";
        if (item.silverPrice > 0) {
          row.silverCost = item.silverPrice * missing;
          silverCost += row.silverCost;
        }
      }
    }

    rowsById.set(id, row);
  }

  const visibleIds = new Set([...Object.keys(requirements), ...ordered]);
  const repairRow = rowsById.get(repairModel?.itemId);
  const fragmentPrice = getCount(memoryFragmentPrice);
  const repair = repairRow && {
    ...repairTotals,
    marketSilver:
      repairRow.missing === 0
        ? 0
        : fragmentPrice > 0 && fragmentPrice <= MAX_FRAGMENT_PRICE
          ? repairRow.missing * fragmentPrice
          : null,
  };
  return {
    rows: [...visibleIds].map((id) => rowsById.get(id)),
    buyableCost,
    silverCost,
    stillToEarn: Math.max(0, buyableCost - getCount(balance)),
    unverifiedCount,
    repair,
  };
}
