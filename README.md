# BDO Barter & Ship Weight Calculator ⚓

A high-performance web application designed for Black Desert Online (BDO) captains and barterers to calculate and optimize trade cargo weights without exceeding their vessel's maximum LT capacity.

## Version 1.1

- Three menus separate single trades, automatic tier chains, and custom routes with multiple exchanges. A route can mix linked and independent trades; the user must confirm the items are the same before reusing an earlier output, since levels alone do not identify items.
- Added an automatic multi-tier chain planner: enter the starting level, maximum level and quantity to see each exchange and the cargo weight at every stage.
- Typical offer ratios are applied by default; custom ratios and each offer's remaining exchange limit can be entered when the in-game offer differs.
- Increased small text sizes and removed cookie-storage notices from the interface.

Features a dark theme inspired by **Satella (The Witch of Envy from Re:Zero)** with deep obsidian void backgrounds, glowing amethyst/violet highlights, and ethereal silver accents.

---

## 🛠️ Tech Stack

- **Runtime & Package Manager:** [Bun](https://bun.sh)
- **Frontend Framework:** [React 18](https://react.dev) (Pure JavaScript & JSX)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Linter & Formatter:** [Biome](https://biomejs.dev/)
- **Diagnostics & Code Health:** [React Doctor](https://react.doctor/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` (**Zero PostCSS**)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Persistence:** Native Cookies API (persists ship choice, max LT capacity, and theme for 365 days)

---

## ✨ Key Architectural Highlights

* **Zero TypeScript:** 100% clean, standard modern JavaScript (ESM + JSX).
* **Zero PostCSS:** Powered by the new **Tailwind CSS v4 engine** via `@tailwindcss/vite`. No `postcss.config.js`, no `autoprefixer`, and no `tailwind.config.js` required.
* **React Doctor Integrated:** Run deterministic static analysis to catch React anti-patterns, performance bottlenecks, and accessibility issues.

---

## 🚀 Available Scripts

```bash
# Start local development server
bun run dev

# Run React Doctor health scan
bun run doctor

# Check code with Biome
bun run lint

# Auto-format codebase with Biome
bun run format

# Production build
bun run build

# Preview production build
bun run preview
```

---

## 📊 Barter Data and Variable Inputs

### Fixed base data

Unit weights and NPC sale prices follow the official Pearl Abyss barter update from **April 16, 2026**, audited again on **November 15, 2026**:

| Tier | Unit weight | NPC sale price |
| --- | --- | --- |
| Level 1 | 100 LT | Not sellable |
| Level 2 | 400 LT | Not sellable |
| Level 3 | 900 LT | 1,000,000 Silver |
| Level 4 | 1,000 LT | 2,000,000 Silver |
| Level 5 | 1,000 LT | 10,000,000 normal / 25,000,000 Great Ocean |
| Level 6 | 2,000 LT | 50,000,000 Silver |
| Level 7 | 2,000 LT | 100,000,000 Silver |

Sources: Pearl Abyss [April 16, 2026 barter update](https://www.naeu.playblackdesert.com/News/Detail?groupContentNo=9973) and [barter update history](https://www.naeu.playblackdesert.com/Adventure/History?_groupMasterNo=10127). Hull base weights were cross-checked with BDO Codex and Black Desert Foundry.

### Data that must come from the current offer

- **Exchange ratio:** preset buttons are suggestions only. Level 1 to Level 2 and Level 2 to Level 3 offers currently return 2 or 3 outputs per input; other next-tier ratios shown are typical values. The in-game offer is authoritative.
- **Remaining exchange cap:** the cap belongs to the individual barter offer, not to the island node.
- **Land goods, ship materials, and Crow Coins:** weights, quantities, and payouts are item- or offer-specific.
- **Level 5 price:** confirm whether the item is a normal or Great Ocean variant before selling.
- **Great Ocean goods:** `[Great Ocean]` marks specific rare Level 5 barter goods worth 25M Silver; it is not a price applied to every Level 5 item. Sail from a wharf aboard an ocean-going ship to the barter island shown by the relevant offer, and verify the tagged item in-game before traveling.

### Ship capacity and cargo semantics

- **Actual Max Cargo** is the live total shown in the in-game Ship Info window. It already includes equipped gear, sailors, and buffs. The app never derives it by adding a universal gear preset to the hull base.
- The **hull base** is displayed for reference only and must not be added again.
- **Pre-loaded Cargo** is existing cargo, sailor food, or supplies. It must exclude the goods being exchanged. The calculator counts input goods on top of pre-loaded cargo for departure and replaces them with received goods at arrival.
- Multi-stop route simulation loads inputs that are not produced by an earlier stop at the first port, because barter islands do not provide storage.
- The multi-tier chain planner treats the starting quantity as available stock and recommends the smallest load that maximizes the output at the selected level. It checks intermediate leftovers, offer limits and cargo throughout the chain. It also shows extra cargo that could be carried unchanged using the space free at peak load; alternatives must not be combined without recalculating their total weight. Ratios are presets and should be adjusted to match the offers.
- The language selector switches the interface between English and Spanish and remembers the selection on this device.
- Optional final-overload simulation caps the final cargo at 150% of normal capacity, a provisional planning assumption rather than a verified game limit. Each exchange must start within normal capacity. The multi-stop route planner applies the same final exchange restriction. [Black Desert Foundry's bartering guide](https://www.blackdesertfoundry.com/bartering-guide/) says a ship cannot barter while overweight and Breezy Sail does not work when overweight.

### Validation

```bash
bun run format
bun run lint
bun run build
bun run doctor
```

There is no automated `test` script in `package.json`. Manual checks should cover a valid custom capacity, an invalid capacity below the hull base, a variable-weight item without an entered weight, an offer cap, a multi-stop route with an overloaded leg, and an automatic chain from a fixed starting quantity with limited cargo and leftover goods.
