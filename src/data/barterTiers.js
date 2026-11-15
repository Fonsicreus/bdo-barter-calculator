// Official base barter values from the Pearl Abyss barter update published on
// April 16, 2026 and audited again on November 15, 2026. Unit weights and NPC
// sale prices are fixed per good. Exchange ratios and remaining exchange caps
// belong to the individual in-game offer and are only shown here as presets.

export const BARTER_TIERS = {
  0: {
    id: 0,
    name: "Land Materials (Tier 0)",
    shortName: "Tier 0 (Land)",
    unitWeight: null,
    description:
      "Land-item weights and barter quantities vary by item and offer; enter the exact values shown in-game.",
    typicalRatios: [],
    isTradeGood: false,
  },
  1: {
    id: 1,
    name: "Level 1 Barter Goods",
    shortName: "Level 1",
    unitWeight: 100,
    description:
      "Entry-level ocean barter goods. Cannot be sold to NPC vendors. Current Level 1 to Level 2 offers return 2 or 3 items per input.",
    typicalRatios: [
      // Current official minimum is 2 outputs per input; the old x1 option no longer applies.
      { input: 1, output: 2 },
      { input: 1, output: 3 },
    ],
    isTradeGood: false,
  },
  2: {
    id: 2,
    name: "Level 2 Barter Goods",
    shortName: "Level 2",
    unitWeight: 400,
    description:
      "Intermediate sea trade goods. Cannot be sold to NPC vendors. Current Level 2 to Level 3 offers return 2 or 3 items per input.",
    typicalRatios: [
      // Preset only: confirm the exact count on the offer.
      { input: 1, output: 2 },
      { input: 1, output: 3 },
    ],
    isTradeGood: false,
  },
  3: {
    id: 3,
    name: "Level 3 Barter Goods",
    shortName: "Level 3",
    unitWeight: 900,
    description:
      "Sellable for 1,000,000 Silver or exchanged for Level 4 goods. The typical Level 3 to Level 4 preset is 1:2; the offer is authoritative.",
    typicalRatios: [{ input: 1, output: 2 }],
    silverValues: [1000000],
    silverLabels: ["1M"],
    isTradeGood: true,
  },
  4: {
    id: 4,
    name: "Level 4 Barter Goods",
    shortName: "Level 4",
    unitWeight: 1000,
    description:
      "Sellable for 2,000,000 Silver. Also used for Crow Coin exchanges; the exchange ratio varies by offer.",
    typicalRatios: [{ input: 1, output: 1 }],
    silverValues: [2000000],
    silverLabels: ["2M"],
    isTradeGood: true,
  },
  5: {
    id: 5,
    name: "Level 5 Barter Goods",
    shortName: "Level 5",
    unitWeight: 1000,
    description:
      "Normal Level 5 goods sell for 10,000,000 Silver; rare Great Ocean Level 5 goods sell for 25,000,000 Silver. Confirm the variant before selling.",
    typicalRatios: [{ input: 1, output: 1 }],
    silverValues: [10000000, 25000000],
    silverLabels: ["10M normal", "25M Great Ocean"],
    isTradeGood: true,
  },
  6: {
    id: 6,
    name: "Level 6 Extended Trade Goods",
    shortName: "Level 6",
    unitWeight: 2000,
    description:
      "Level 6 Great Ocean goods sell to an NPC vendor for 50,000,000 Silver. Exchange ratios are offer-specific.",
    typicalRatios: [{ input: 1, output: 1 }],
    silverValues: [50000000],
    silverLabels: ["50M"],
    isTradeGood: true,
  },
  7: {
    id: 7,
    name: "Level 7 Luxury Ocean Goods",
    shortName: "Level 7",
    unitWeight: 2000,
    description:
      "Level 7 Great Ocean goods sell to an NPC vendor for 100,000,000 Silver. This is the terminal tier, with no next-tier exchange.",
    typicalRatios: [],
    silverValues: [100000000],
    silverLabels: ["100M"],
    isTradeGood: true,
  },
  crow_coins: {
    id: "crow_coins",
    name: "Crow Coins",
    shortName: "Crow Coins",
    unitWeight: 0,
    description:
      "Crow's Nest currency weighing 0 LT. Coin payouts are offer-specific; enter the exact ratio shown in-game.",
    typicalRatios: [],
    isTradeGood: false,
  },
  ship_materials: {
    id: "ship_materials",
    name: "Ship Upgrade Materials",
    shortName: "Ship Materials",
    unitWeight: null,
    description:
      "Each ship material has its own weight and exchange quantity; enter the exact values shown in-game.",
    typicalRatios: [],
    isTradeGood: false,
  },
};

export const ORDERED_TIER_KEYS = [1, 2, 3, 4, 5, 6, 7, "crow_coins", "ship_materials", 0];
