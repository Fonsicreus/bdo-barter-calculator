# BDO Barter Calculator

**English** · [Español](README.es.md)

Work out what to load at port, how heavy your cargo will be after each island, and how many goods you can bring home. Satella maintains this unofficial Black Desert Online planner.

Use the language selector to switch between English, Spanish, Korean, Japanese, and Simplified Chinese.

## What you can plan

| In the planner | What you can do |
| --- | --- |
| **Single trade** | Find how many exchanges fit and check the cargo weight after one island offer. |
| **Tier chain** | Choose a target level and find the starting quantity that maximizes your haul within the remaining exchanges at each step. |
| **Multiple trades** | Combine linked and independent offers. Change quantities or move a stop to see where cargo weight peaks. |
| **Goods reference** | Look up item weights, NPC sale prices, route unlock counts, and Special Barter requirements. |

For a first calculation, select your ship, enter its maximum LT from **Ship Info**, and choose **Single trade**. For example, if an island offers two Level 2 goods for one Level 1 good, four exchanges turn 400 LT of goods into 3,200 LT. Any other cargo already on board adds to both totals.

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
- Level 0 → 1 uses one Level 1 good per completed exchange. Enter the number of exchanges and include the land materials in **Pre-loaded Cargo**. Their weight remains in the estimate throughout the route.
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

The project uses AI assistance under human supervision. Contributors review generated changes and check barter data against patch notes and observations in the game. When reporting a data correction, include the game region, patch date, and evidence for the value. [Contribution guide](CONTRIBUTING.md) · [Code of conduct](CODE_OF_CONDUCT.md)

The project code uses PolyForm Noncommercial 1.0.0. Commercial use requires separate permission. Black Desert Online is a Pearl Abyss game. [License](LICENSE.md)
