// Hull base cargo weights verified against BDO Codex and Black Desert Foundry
// (audited November 15, 2026). These are reference values only: the calculator
// uses the live total from the in-game Ship Info window, which also includes
// equipped gear, sailors, and buffs. Do not add a universal gear bonus here.
export const OFFICIAL_SHIPS = [
  // Beginner
  {
    id: "bartali_sailboat",
    name: "Bartali Sailboat",
    category: "Beginner",
    baseWeight: 2000,
    cabins: 10,
    cannons: 2,
    description: "Introductory vessel obtained during the Great Expedition questline.",
  },
  {
    id: "epheria_cog",
    name: "Epheria Cog",
    category: "Beginner",
    baseWeight: 1080,
    cabins: 0,
    cannons: 2,
    description: "Fast temporary vessel with high base speed but limited lifespan.",
  },

  // Tier 1 (Base Big Ships)
  {
    id: "epheria_sailboat",
    name: "Epheria Sailboat",
    category: "Tier 1 (Base)",
    baseWeight: 5000,
    cabins: 10,
    cannons: 2,
    description: "Cargo-focused base vessel. Stepping stone toward the Epheria Caravel.",
  },
  {
    id: "epheria_frigate",
    name: "Epheria Frigate",
    category: "Tier 1 (Base)",
    baseWeight: 4000,
    cabins: 10,
    cannons: 4,
    description: "Combat-focused base vessel. Stepping stone toward the Epheria Galleass.",
  },
  {
    id: "improved_sailboat",
    name: "Improved Epheria Sailboat",
    category: "Tier 1 (Base)",
    baseWeight: 5000,
    cabins: 10,
    cannons: 2,
    description: "Upgraded sailboat enabling manual captain cannon firing.",
  },
  {
    id: "improved_frigate",
    name: "Improved Epheria Frigate",
    category: "Tier 1 (Base)",
    baseWeight: 4000,
    cabins: 10,
    cannons: 4,
    description: "Upgraded frigate with improved manual artillery handling.",
  },

  // Tier 2 (Upgraded Intermediate Ships)
  {
    id: "epheria_caravel",
    name: "Epheria Caravel",
    category: "Tier 2 (Upgraded)",
    baseWeight: 10000,
    cabins: 30,
    cannons: 2,
    description: "Primary bartering workhorse before Carrack. Generous base cargo capacity.",
  },
  {
    id: "epheria_galleass",
    name: "Epheria Galleass",
    category: "Tier 2 (Upgraded)",
    baseWeight: 8000,
    cabins: 30,
    cannons: 4,
    description: "Combat-oriented mid-tier ship capable of solid firepower and moderate trading.",
  },
  {
    id: "panokseon",
    name: "Panokseon",
    category: "Tier 2 (Upgraded)",
    baseWeight: 12500,
    cabins: 50,
    cannons: 6,
    description: "Land of the Morning Light hybrid vessel with high cabin capacity and weight.",
  },

  // Tier 3 (Carracks - Endgame Ships)
  {
    id: "carrack_advance",
    name: "Epheria Carrack: Advance",
    category: "Tier 3 (Carrack)",
    baseWeight: 16500,
    cabins: 50,
    cannons: 6,
    description:
      "The premier bartering ship in BDO. Hull base cargo is 16,500 LT; the live maximum depends on equipped gear, sailors, and buffs.",
  },
  {
    id: "carrack_balance",
    name: "Epheria Carrack: Balance",
    category: "Tier 3 (Carrack)",
    baseWeight: 15000,
    cabins: 50,
    cannons: 6,
    description: "Well-rounded Carrack balancing high trade cargo with reliable sea mobility.",
  },
  {
    id: "carrack_volante",
    name: "Epheria Carrack: Volante",
    category: "Tier 3 (Carrack)",
    baseWeight: 13500,
    cabins: 50,
    cannons: 6,
    description:
      "Agile, speed-focused Carrack favored for rapid sea exploration and fast trade loops.",
  },
  {
    id: "carrack_valor",
    name: "Epheria Carrack: Valor",
    category: "Tier 3 (Carrack)",
    baseWeight: 13500,
    cabins: 50,
    cannons: 6,
    description: "Maximum ocean combat firepower Carrack with heavy cannon battery reload speeds.",
  },
];

export const DEFAULT_SHIP =
  OFFICIAL_SHIPS.find((s) => s.id === "epheria_caravel") || OFFICIAL_SHIPS[0];
