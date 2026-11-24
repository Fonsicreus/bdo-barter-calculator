# BDO Barter Calculator — agent guide

## Work in this repository

- Use Bun and the existing React, Vite, and Biome setup. Install with `bun install --frozen-lockfile` and develop with `bun run dev`.
- Check `git status` before editing. Preserve unrelated changes and keep patches focused. Read [CONTRIBUTING.md](CONTRIBUTING.md) for contributor conventions.
- Do not commit, push, change the deployment configuration in GitHub, or publish without explicit permission. Pushing to `main` deploys GitHub Pages.
- If working in parallel, agree on the data and component interfaces first. Give independent edits separate worktrees and keep research or review read-only.

## Keep game data auditable

- Record the item ID, platform/region, source, and verification date for changed requirements, recipes, or shop prices. Prefer Pearl Abyss patch notes and current in-game evidence; use BDO Codex to cross-check IDs, names, and recipes.
- Verify prices, pack sizes, purchase limits, and enhancement rules separately. Keep unknown prices explicit and never treat them as zero.
- Keep personal screenshots and balances out of shipped defaults. Credit any third-party game assets and keep their rights and attribution separate from the repository code license.

## Check changes before handoff

- Run `bun test`, `bun run lint`, and `bun run build`. For navigation changes, also build with `bun run build --base /bdo-barter-calculator/` and check both entry points and their asset URLs.
- Preserve the five supported languages and shared language and theme settings. Keep the Ship Upgrade Calculator inventory and reset isolated from the barter preferences.
- Report verified checks, remaining uncertainties, and any changes that still need human review.
