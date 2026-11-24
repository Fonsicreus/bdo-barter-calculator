export const advanceSources = {
  verifiedOn: "November 24, 2026",
  upgrade: "https://bdocodex.com/us/mount/31054/",
  prices: "https://blackdesert.pearlabyss.com/Asia/en-US/News/Notice/Detail?_boardNo=13225",
  greenGearPrices:
    "https://www.blackdesertfoundry.com/epheria-sailboat-and-caravel-guide/#Epheria_Caravel_Gear",
  gearIcons: "https://bdoatlas.com/",
  ancientAnvil: "https://www.sa.playblackdesert.com/pt-BR/Wiki?wikiNo=395",
  memoryFragment: "https://bdoatlas.com/item/44195/memory-fragment/",
  memoryMarket: "https://garmoth.com/market/category/enhancement-upgrade/enhancement/",
};

const finalMaterials = [
  ["5809", "Moon Vein Flax Fabric", 40, 180],
  ["5812", "Deep Tide-Dyed Standardized Timber Square", 80, 144],
  ["5815", "Brilliant Rock Salt Ingot", 400, 35],
  ["5821", "Tear of the Ocean", 400, 42],
  ["5831", "Brilliant Pearl Shard", 400, 35],
];

const recipeMaterials = [
  ["5807", "Ruddy Manganese Nodule", 200],
  ["5810", "Tide-Dyed Standardized Timber Square", 80],
  ["5814", "Enhanced Island Tree Coated Plywood", 40],
  ["5820", "Pure Pearl Crystal", 200],
  ["5822", "Cox Pirates' Artifact (Parley Beginner)", 120],
  ["5823", "Cox Pirates' Artifact (Parley Expert)", 400],
  ["5824", "Cox Pirates' Artifact (Combat)", 120],
  ["5827", "Moon Scale Plywood", 15],
  ["5828", "Bright Reef Piece", 30],
  ["5829", "Seaweed Stalk", 80],
  ["5830", "Luminous Cobalt Ingot", 400],
  ["5832", "Great Ocean Dark Iron", 130],
];

const greenEquipment = [
  ["49653", "Brass Figurehead", 8_000_000],
  ["49654", "Enhanced Plating", 9_000_000],
  ["49651", "Verisha Cannon", 8_000_000],
  ["49652", "White Wind Sail", 7_000_000],
];

const blueEquipment = [
  [
    "49655",
    "Black Dragon Figurehead",
    8839,
    { 49653: 1, 5807: 50, 5814: 300, 5829: 125, 5832: 150 },
  ],
  ["49656", "Upgraded Plating", 8840, { 49654: 1, 5820: 45, 5822: 60, 5824: 60, 5827: 200 }],
  ["49657", "Mayna Cannon", 8841, { 49651: 1, 5810: 180, 5824: 60, 5827: 200, 5828: 180 }],
  ["49658", "Stratus Wind Sail", 8842, { 49652: 1, 5807: 40, 5823: 30, 5829: 80, 5830: 30 }],
];

const stoneId = "756001";
const memoryFragmentId = "44195";
const materialIcon = (id) => `ship-upgrade-icons/${id}.png`;
const gearIcon = (id) => `ship-upgrade-icons/${id}.webp`;
const materialEntries = (materials, source) =>
  materials.map(([id, name, unitPrice]) => [
    id,
    { name, icon: materialIcon(id), source, shop: { unitPrice } },
  ]);

export const advanceCatalog = {
  items: {
    ...Object.fromEntries([
      ...materialEntries(finalMaterials, "Carrack upgrade material · Crow Coin Shop"),
      ...materialEntries(recipeMaterials, "Equipment crafting material · Crow Coin Shop"),
      ...greenEquipment.map(([id, name, silverPrice]) => [
        id,
        { name, silverPrice, icon: gearIcon(id), source: "Philaberto Falasi, Port Epheria" },
      ]),
      ...blueEquipment.map(([id, name, design, ingredients]) => [
        id,
        {
          name,
          icon: gearIcon(id),
          recipe: { ingredients, source: `https://bdocodex.com/us/design/${design}/` },
        },
      ]),
    ]),
    [stoneId]: {
      name: "Tidal Black Stone",
      category: "enhancement",
      icon: materialIcon(stoneId),
      source: "Crow Coin Shop · individual stones or boxes of 20",
      shop: { unitPrice: 10, bundle: { price: 150, quantity: 20, weeklyLimit: 10 } },
    },
    [memoryFragmentId]: {
      name: "Memory Fragment",
      category: "repair",
      icon: `ship-upgrade-icons/${memoryFragmentId}.webp`,
      source: "Central Market · priced separately in silver",
    },
  },
  gear: [
    ...blueEquipment.map(([id, name]) => ({ id, name, tier: "blue" })),
    ...greenEquipment.map(([id, name]) => ({ id, name, tier: "green" })),
  ],
  requirements: Object.fromEntries([
    ...blueEquipment.map(([id]) => [id, 1]),
    ...finalMaterials.map(([id, , , quantity]) => [id, quantity]),
  ]),
  enhancementSteps: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2].map((quantity) => ({ [stoneId]: quantity })),
  repairModel: {
    itemId: memoryFragmentId,
    failuresByTier: {
      green: [3, 4, 4, 5, 5, 5, 5, 5, 5, 6],
      blue: [3, 3, 3, 4, 4, 4, 7, 9, 12, 20],
    },
    durabilityLost: [5, 5, 5, 5, 5, 10, 10, 10, 10, 10],
    durabilityPerFragment: { green: 5, blue: 2 },
    marketReference: { region: "PC EU", date: "November 24, 2026", silver: 2_270_000 },
  },
  sources: advanceSources,
};
