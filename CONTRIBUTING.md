# Contributing

## Report a problem or suggest a change

Search the open issues first. Use the [issue templates](.github/ISSUE_TEMPLATE) for a calculation or interface bug, a correction to game data, or a feature request. Describe the expected result and include the settings needed to reproduce it.

For game data changes, include the region, patch date, and an official source or an in-game screenshot where possible. Keep values that vary by offer configurable and identify estimates as such.

## Submit a change

1. Fork the repository and create a branch for your change.
2. Install dependencies with `bun install --frozen-lockfile` and start the app with `bun run dev`.
3. Keep the change focused. When calculator text changes, update the translations for the affected page in [all supported languages](src/i18n/locales.js) and the relevant READMEs. Preserve translation placeholders and use in-game terminology where available.
4. Run the checks below and describe what you verified in your pull request. Include a screenshot if you changed the interface.

```bash
bun run lint
bun test
bun run build
```

## AI assistance

You may use AI tools. Follow [AGENTS.md](AGENTS.md), review the output yourself, verify the calculations and any cited sources, and describe material AI assistance in your pull request.
