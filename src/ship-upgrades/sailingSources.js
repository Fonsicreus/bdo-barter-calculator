export const sailingSources = {
  guide: "https://bdoworkshop.com/carrack-resource-management",
  verifiedOn: "November 27, 2026",
  region: "PC · BDO Codex (EN)",
};

export const sailingQuests = [
  {
    id: "3707/23",
    name: "Old Moon Guild's Young Sea Monster Hunter",
    period: "daily",
    rewards: { 5809: 3, 5821: 1, 5827: 10 },
  },
  {
    id: "3707/8",
    name: "Win-win Situation",
    period: "daily",
    choice: true,
    rewards: { 5812: 4 },
  },
  {
    id: "3707/6",
    name: "Our Guild is Not a Charity Group",
    period: "daily",
    choice: true,
    rewards: { 5810: 5 },
  },
  {
    id: "3707/7",
    name: "Do You Have What it Takes?",
    period: "daily",
    choice: true,
    rewards: { 5824: 3 },
  },
  {
    id: "3736/12",
    name: "Lively Iliya Island",
    period: "daily",
    rewards: { 5814: 10, 5820: 2, 5823: 1, 5825: 8, 5828: 8 },
  },
  {
    id: "3736/1",
    name: "Supplies Delivery (Iliya Island)",
    period: "daily",
    rewards: { 5822: 1 },
  },
  {
    id: "3736/2",
    name: "Supplies Delivery (Oquilla's Eye)",
    period: "daily",
    rewards: { 5822: 2 },
  },
  {
    id: "3707/25",
    name: "For the Young Otter Merchants",
    period: "weekly",
    rewards: { 5807: 15, 5829: 45 },
  },
  {
    id: "3707/19",
    name: "Old Moon Guild's Candidum Hunter",
    period: "weekly",
    choice: true,
    rewards: { 5807: 4 },
  },
  {
    id: "3707/20",
    name: "Old Moon Guild's Nineshark Hunter",
    period: "weekly",
    choice: true,
    rewards: { 5821: 2 },
  },
  {
    id: "3707/21",
    name: "Old Moon Guild's Black Rust Hunter",
    period: "weekly",
    choice: true,
    rewards: { 5824: 6 },
  },
  {
    id: "3707/22",
    name: "Monster Increase Report",
    period: "weekly",
    rewards: { 5824: 2 },
  },
];

export const sailingMaterials = {
  5805: { barter: "2" },
  5806: { barter: "2" },
  5807: { barter: "4", exploration: true },
  5809: { barter: "5", khan: "Khan's Tendon" },
  5810: { barter: "4", exploration: true },
  5812: { barter: "5" },
  5814: { barter: true },
  5815: { barter: "5" },
  5819: { barter: "2", seaMonster: true },
  5820: { barter: "3" },
  5821: { barter: "5", fishing: true },
  5822: { barter: "2", exploration: true },
  5823: { barter: "4", exploration: true },
  5824: { barter: "4–5", exploration: true },
  5825: { barter: "3" },
  5827: { barter: "5", khan: "Khan's Scale" },
  5828: { barter: "3", exploration: true },
  5829: { barter: true },
  5830: { barter: "4", exploration: true },
  5831: { barter: "5" },
  5832: { barter: "4" },
};

export function getSailingRewards(itemId, period) {
  return sailingQuests
    .filter((quest) => quest.period === period && Object.hasOwn(quest.rewards, itemId))
    .map(({ id, name, choice = false, rewards }) => ({
      id,
      name,
      choice,
      quantity: rewards[itemId],
    }));
}
