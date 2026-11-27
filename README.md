# BDO Barter Calculator

**English** · [Español](README.es.md) · [한국어](README.ko.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

Plan cargo and barter routes, then work out which ship parts and Crow Coins you still need. **BDO Barter Calculator 2.0** brings both tools together in an unofficial Black Desert Online planner by [Satella](https://github.com/Fonsicreus).

**Open the app:** [Barter Calculator](https://fonsicreus.github.io/bdo-barter-calculator/) · [Ship Upgrade Calculator](https://fonsicreus.github.io/bdo-barter-calculator/ship-upgrades/)

Both tools support English, Español, 한국어, 日本語, and 简体中文. Your language and theme carry across pages.

## What you can plan

| In the planner | What you can do |
| --- | --- |
| **Single trade** | Find how many exchanges fit and check the cargo weight after one island offer. |
| **Tier chain** | Choose a target level and find the starting quantity that maximizes your haul within the remaining exchanges at each step. |
| **Multiple trades** | Combine linked and independent offers. Change quantities or move a stop to see where cargo weight peaks. |
| **Goods reference** | Look up item weights, NPC sale prices, route unlock counts, and Special Barter requirements. |

For a first calculation, select your ship, enter its maximum LT from **Ship Info**, and choose **Single trade**. For example, if an island offers two Level 2 goods for one Level 1 good, four exchanges turn 400 LT of goods into 3,200 LT. Any other cargo already on board adds to both totals.

## Ship Upgrade Calculator

Use **Ship Upgrade Calculator** in the header to open `/ship-upgrades/`. Choose **Current ship** and **Upgrade to** to plan one of 13 wharf upgrades: Bartali to Sailboat or Frigate, the optional Improved variants, Caravel and Galleass, all four Carracks, and the guild Galley upgrade. Direct builds such as [Panokseon](https://blackdesert.pearlabyss.com/Asia/fr-FR/News/Notice/Detail?_boardNo=3855), licenses, and gear worn by a finished Carrack or Panokseon are outside the planner.

- Use **Ship Equipment** for gear, recipes, stones and repairs, and **Ship Upgrade** for the final hand-in. Each pending piece has its own expandable recipe, open by default. Owning a blue part hides its recipe and matching green part without deleting progress. Repeated ingredients share inventory and plan-wide shortages. The one-year cookie saves your route, gear levels, stock, balance and boxes; reset from **Inventory** without affecting barter settings, theme, or language.
- Hover, focus, or tap the source badges to see how to get each Carrack material, including daily and weekly quest yields. Selectable quest rewards are marked as such; they are not subtracted from the shopping estimate. The layout and source guide draw inspiration from [BDO Workshop](https://bdoworkshop.com/carrack-resource-management). Quest rewards were checked against the English PC BDO Codex on November 27, 2026; see the item and quest IDs in [sailingSources.js](src/ship-upgrades/sailingSources.js).
- **Acquisition** shows the Crow Coin price per unit; **Purchase cost** shows the total for missing units. **Still to earn** subtracts your balance from confirmed shop costs. It excludes silver, guild funds, barter, and other unpriced acquisitions. The planner finds the cheapest combination of individual Tidal Black Stones and available boxes. On Carrack routes, the default assumes first-attempt success; **Pity** counts all failures to the [Ancient Anvil](https://www.sa.playblackdesert.com/pt-BR/Wiki?wikiNo=395) guarantee from zero Agris Essence per level, plus the success.
- The worst-case repair estimate budgets full max-durability restoration with [Memory Fragments (44195)](https://bdoatlas.com/item/44195/memory-fragment/): +5 for green and +2 for blue per fragment. The repair summary and materials table subtract the fragments you own and use your editable Central Market price. The optional 2.27M PC EU reference is a [Garmoth](https://garmoth.com/market/category/enhancement-upgrade/enhancement/) snapshot from November 24, 2026, not a live quote. This does not model force enhancement, existing wear, other repair methods, or alternative purchases.
- PC data checked November 24, 2026. The app links to each destination's BDO Codex upgrade record (English PC database), and to workshop designs [8839–8842](https://bdocodex.com/us/design/8839/) for Caravel and [8847–8850](https://bdocodex.com/us/design/8847/) for Galleass. Shop prices use [Pearl Abyss's May 21, 2026 PC Asia update](https://blackdesert.pearlabyss.com/Asia/en-US/News/Notice/Detail?_boardNo=13225) and community shop screenshots, including [Cobalt Ingot (5819)](https://bdocodex.com/us/item/5819/) at 120 and [Deep Sea Memory Filled Glue (5825)](https://bdocodex.com/us/item/5825/) at 110. Check prices and limits on your server.
- Black Desert Online artwork belongs to Pearl Abyss. Icons are sourced from [BDO Atlas](https://bdoatlas.com/), [BDO Codex](https://bdocodex.com/us/items/), and in-game screenshots. The code license does not apply to these assets. This is an unofficial fan project and is not endorsed by Pearl Abyss.

## Barter data

The base weights and NPC sale prices below follow the April 16, 2026 Pearl Abyss update.

| Level | Weight per item | NPC sale price |
| --- | --- | --- |
| 1 | 100 LT | Not sellable |
| 2 | 400 LT | Not sellable |
| 3 | 900 LT | 1,000,000 Silver |
| 4 | 1,000 LT | 2,000,000 Silver |
| 5 | 1,000 LT | 10,000,000 Silver normal / 25,000,000 Silver Great Ocean |
| 6 | 2,000 LT | 50,000,000 Silver |
| 7 | 2,000 LT | 100,000,000 Silver |

- Use the quantities and remaining exchange count shown on the individual in-game offer. The header's **Debug** button enables custom ratios for supported offers.
- Level 0 → 1 yields one Level 1 good per completed exchange. Enter the number of exchanges and include the land materials in **Pre-loaded Cargo**. Their weight remains in the estimate throughout the route.
- Ship materials have item-specific weights. Crow Coin payouts vary by offer. For Level 5 sales, check whether the item is tagged **Great Ocean**.
- The planner matches goods by tier when it reuses earlier outputs. Confirm that the items are the exact ones requested by the next offer.

### Ship capacity

Enter the current maximum LT shown in **Ship Info**, including gear, sailors, and buffs. Keep goods you are about to exchange out of **Pre-loaded Cargo**, except for Level 0 land materials as described above. The route planner assumes any inputs unavailable from earlier stops are loaded at the first port.

**Overload** lets the final island offer finish above normal capacity when the entire offer is exchanged in one batch. The boat must still fit within normal capacity when loading at port and before starting another offer. The final cap of **150%** is a provisional planning assumption.

### Sources

- Pearl Abyss patch notes and update history. [April 16, 2026 update](https://www.naeu.playblackdesert.com/News/Detail?groupContentNo=9973) · [Barter update history](https://www.naeu.playblackdesert.com/Adventure/History?_groupMasterNo=10127)
- Hull capacities and route unlocks. [BDO Codex](https://bdocodex.com/us/) · [Black Desert Foundry](https://www.blackdesertfoundry.com/bartering-guide/)
- Changes to Special Barter requirements. [Pearl Abyss patch notes](https://www.tw.playblackdesert.com/zh-TW/News/Detail?countryType=zh-TW&groupContentNo=19419)

## Run locally

Install [Bun](https://bun.sh) and run these commands from the project directory. Open the local address Vite prints in the terminal.

```bash
bun install --frozen-lockfile
bun run dev
```

The app uses React, Vite, Tailwind CSS, and Lucide. Run these checks before submitting a change.

```bash
bun run lint
bun test
bun run build
```

Use `bun run preview` to serve the production build locally. A push to `main` triggers the Pages workflow. Each successful deployment publishes `dist/` at the address GitHub assigned to the calculator. [Deployment workflow](.github/workflows/pages.yml) · [GitHub Pages address](https://fonsicreus.github.io/bdo-barter-calculator/)

## Contributing and license

The project uses AI assistance under human supervision. Contributors review generated changes and check game data against patch notes and observations in the game. When reporting a data correction, include the game region, patch date, and evidence for the value. [Contribution guide](CONTRIBUTING.md) · [Agent guide](AGENTS.md) · [Code of conduct](CODE_OF_CONDUCT.md)

The project code uses PolyForm Noncommercial 1.0.0. Commercial use requires separate permission. Black Desert Online is a Pearl Abyss game. [License](LICENSE.md)
