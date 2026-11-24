import { advanceCatalog, advanceSources } from "./catalog";

const ships = {
  9090: "Guild Galley",
  9124: "Improved Galley",
  31001: "Epheria Sailboat",
  31003: "Epheria Frigate",
  31048: "Epheria Caravel",
  31049: "Epheria Galleass",
  31053: "Bartali Sailboat",
  31054: "Epheria Carrack: Advance",
  31055: "Epheria Carrack: Balance",
  31056: "Epheria Carrack: Volante",
  31057: "Epheria Carrack: Valor",
  31058: "Improved Epheria Sailboat",
  31059: "Improved Epheria Frigate",
};

const codex = "https://bdocodex.com/us";
const icon = (id) => `ship-upgrade-icons/${id}.webp`;
const guildVendor = "Guild Wharf Manager; guild inventory only";
const guildMaterials = "Guild Wharf Manager or guild weekly quests";
const upgradeMaterials = "Ravinia's ship upgrade questline or processing";
const barter = "Barter with Lv. 2 sea trade goods";
const permit = "Purchase from Philaberto Falasi at Port Epheria";
const falasi = "Philaberto Falasi, Port Epheria";
const processing = "Processing or Central Market";
const galleassRecipes = [
  [
    "49667",
    "Black Dragon Figurehead",
    8847,
    { 49665: 1, 5807: 50, 5814: 300, 5829: 125, 5832: 150 },
  ],
  ["49668", "Upgraded Plating", 8848, { 49666: 1, 5820: 45, 5822: 60, 5824: 125, 5827: 300 }],
  ["49669", "Mayna Cannon", 8849, { 49663: 1, 5810: 180, 5824: 125, 5827: 300, 5828: 180 }],
  ["49670", "Stratus Wind Sail", 8850, { 49664: 1, 5807: 50, 5823: 30, 5829: 125, 5830: 30 }],
];
const galleassGreen = [
  ["49665", "White Horn Figurehead"],
  ["49666", "Enhanced Plating"],
  ["49663", "Verisha Cannon"],
  ["49664", "White Wind Sail"],
];
const epheriaGear = [
  ["49754", "Epheria: Old Figurehead"],
  ["49755", "Epheria: Old Plating"],
  ["49756", "Epheria: Old Cannon"],
  ["49757", "Epheria: Old Wind Sail"],
];
const bartaliGear = [
  ["49758", "Bartali Sailboat: Old Figurehead"],
  ["49759", "Bartali Sailboat: Old Plating"],
  ["49760", "Bartali Sailboat: Old Cannon"],
  ["49761", "Bartali Sailboat: Old Wind Sail"],
];
const galleyGear = [
  ["49701", "[Guild] Galley: Ivory Figurehead"],
  ["49702", "[Guild] Galley: Enhanced Plating"],
  ["49703", "[Guild] Galley: Maria Cannon"],
  ["49704", "[Guild] Galley: High Wind Sail"],
];

const materialEntries = [
  ["5", "Gold Bar 1,000G", "Storage Keeper currency exchange (silver)"],
  ["4077", "Steel", processing],
  ["4269", "Jade Coral Ingot", processing],
  ["4658", "Pine Plywood", processing],
  ["4685", "Standardized Timber Square", processing],
  ["4687", "Hard Pillar", processing],
  ["4691", "Pine Coated Plywood", processing],
  ["4912", "Ultimate Weapon Reform Stone", processing],
  ["4913", "Ultimate Armor Reform Stone", processing],
  ["5796", "Ship Upgrade Permit: Epheria Caravel", permit],
  ["5797", "Ship Upgrade Permit: Epheria Galleass", permit],
  ["5805", "Island Tree Coated Plywood", barter],
  ["5806", "Rock Salt Ingot", barter],
  ["5819", "Cobalt Ingot", "Crow Coin Shop, sea monsters, or barter", 120],
  ["5825", "Deep Sea Memory Filled Glue", "Crow Coin Shop, sailing quests, or barter", 110],
  ["5842", "[Guild] Blueprint: Improved Galley", guildVendor],
  ["5843", "[Guild] Abyss-drenched Ingot", guildMaterials],
  ["5844", "[Guild] Great Ocean-drenched Plywood", guildMaterials],
  ["5845", "[Guild] Deep Sea-drenched Timber Square", guildMaterials],
  ["5856", "Flax Fabric", processing],
  ["5860", "Enhanced Flax Fabric", processing],
  ["9965", "[Guild] Goddess's Tear Crystal", guildVendor],
  ["45508", "Graphite Ingot for Upgrade", upgradeMaterials],
  ["45509", "Timber for Upgrade", upgradeMaterials],
  ["45510", "Adhesive for Upgrade", upgradeMaterials],
  ["49950", "Ship Upgrade Permit: Epheria Sailboat", permit],
  ["49951", "Ship Upgrade Permit: Epheria Frigate", permit],
  ...[...galleassGreen, ...epheriaGear, ...bartaliGear].map(([id, name]) => [id, name, falasi]),
  ...galleyGear.map(([id, name]) => [id, name, guildVendor]),
];

const items = {
  ...advanceCatalog.items,
  ...Object.fromEntries([
    ...materialEntries.map(([id, name, source, unitPrice]) => [
      id,
      { name, icon: icon(id), source, ...(unitPrice ? { shop: { unitPrice } } : {}) },
    ]),
    ...galleassRecipes.map(([id, name, design, ingredients]) => [
      id,
      { name, icon: icon(id), recipe: { ingredients, source: `${codex}/design/${design}/` } },
    ]),
  ]),
  16001: {
    name: "Black Stone",
    category: "enhancement",
    icon: icon(16001),
    source: "Central Market or in-game rewards",
  },
};

const gearSet = (entries, tier) => entries.map(([id, name]) => ({ id, name, tier }));
const galleassBlue = gearSet(galleassRecipes, "blue");
const galleassGear = [...galleassBlue, ...gearSet(galleassGreen, "green")];
const requirementSet = (gear, materials) => ({
  ...Object.fromEntries(gear.map(({ id }) => [id, 1])),
  ...materials,
});
const epheriaSet = gearSet(epheriaGear, "green");
const bartaliSet = gearSet(bartaliGear, "green");
const galleySet = gearSet(galleyGear, "green").map((part) => ({ ...part, fixedLevel: true }));
const epheriaSteps = Array.from({ length: 10 }, () => ({ 756001: 1 }));
const bartaliSteps = Array.from({ length: 10 }, (_, index) => ({ 16001: index + 1 }));
const improvedMaterials = { 4077: 200, 4658: 500, 4685: 250, 4687: 30, 5856: 100 };
const sailingMaterials = { 45508: 100, 45509: 100, 45510: 100, 5805: 100 };

function makeRoute(
  origin,
  destination,
  { gear, requirements, enhancementSteps, repairModel, guaranteedEnhancement },
) {
  const routeItems = {};
  function addItem(id) {
    if (Object.hasOwn(routeItems, id)) return;
    routeItems[id] = items[id];
    for (const ingredientId of Object.keys(items[id].recipe?.ingredients ?? {}))
      addItem(ingredientId);
  }
  for (const id of Object.keys(requirements)) addItem(id);
  for (const step of enhancementSteps) for (const id of Object.keys(step)) addItem(id);
  if (repairModel) addItem(repairModel.itemId);

  return {
    id: `${origin}-${destination}`,
    origin,
    destination,
    originName: ships[origin],
    destinationName: ships[destination],
    items: routeItems,
    gear,
    requirements,
    enhancementSteps,
    repairModel,
    guaranteedEnhancement,
    sources: { ...advanceSources, upgrade: `${codex}/mount/${destination}/` },
  };
}

function earlyRoute(origin, destination, gear, materials, enhancementSteps = []) {
  return makeRoute(origin, destination, {
    gear: gear.map((part) => ({ ...part, targetLevel: enhancementSteps.length })),
    requirements: requirementSet(gear, materials),
    enhancementSteps,
    guaranteedEnhancement: enhancementSteps.length > 0,
  });
}

function carrackRoute(origin, destination, gear, materials) {
  return makeRoute(origin, destination, {
    gear,
    requirements: requirementSet(
      gear.filter(({ tier }) => tier === "blue"),
      materials,
    ),
    enhancementSteps: advanceCatalog.enhancementSteps,
    repairModel: advanceCatalog.repairModel,
  });
}

const routes = [
  earlyRoute(
    31053,
    31001,
    bartaliSet,
    { 5: 5, 4077: 250, 4658: 700, 4685: 350, 5856: 100, 49950: 1 },
    bartaliSteps,
  ),
  earlyRoute(
    31053,
    31003,
    bartaliSet,
    { 5: 5, 4269: 350, 4685: 450, 4691: 750, 5860: 200, 49951: 1 },
    bartaliSteps,
  ),
  earlyRoute(31001, 31058, epheriaSet, { ...improvedMaterials, 4913: 10 }),
  earlyRoute(31003, 31059, epheriaSet, { ...improvedMaterials, 4912: 10 }),
  ...[31001, 31058].map((origin) =>
    earlyRoute(
      origin,
      31048,
      epheriaSet,
      { ...sailingMaterials, 5796: 1, 5806: 100, 5825: 4, 5829: 4 },
      epheriaSteps,
    ),
  ),
  ...[31003, 31059].map((origin) =>
    earlyRoute(
      origin,
      31049,
      epheriaSet,
      { ...sailingMaterials, 5797: 1, 5810: 3, 5819: 2, 5827: 10 },
      epheriaSteps,
    ),
  ),
  makeRoute(31048, 31054, advanceCatalog),
  carrackRoute(31048, 31055, advanceCatalog.gear, {
    5809: 180,
    5812: 144,
    5815: 30,
    5821: 50,
    5831: 30,
  }),
  carrackRoute(31049, 31056, galleassGear, { 5809: 210, 5812: 144, 5815: 30, 5821: 42, 5831: 30 }),
  carrackRoute(31049, 31057, galleassGear, { 5809: 180, 5812: 170, 5815: 30, 5821: 42, 5831: 30 }),
  {
    ...earlyRoute(9090, 9124, galleySet, { 5842: 10, 5843: 100, 5844: 100, 5845: 100, 9965: 100 }),
    guild: true,
  },
];

export const fleet = {
  defaultRouteId: "31048-31054",
  routes,
  items,
  gear: [...new Map(routes.flatMap(({ gear }) => gear.map((part) => [part.id, part]))).values()],
};
