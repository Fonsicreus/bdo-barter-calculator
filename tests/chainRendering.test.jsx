import { afterEach, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BarterChainResult } from "../src/components/BarterChainResult";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { calculateAutomaticTierChain } from "../src/utils/calculator";

const previousStorage = globalThis.localStorage;
afterEach(() => {
  globalThis.localStorage = previousStorage;
});

test("shows recommended and extra cargo in Spanish", () => {
  globalThis.localStorage = { getItem: () => "es" };
  const result = calculateAutomaticTierChain({
    startTier: 2,
    targetTier: 5,
    startUnits: 10,
    shipMaxWeight: 10000,
    ratios: { 2: { input: 1, output: 2 }, 3: { input: 1, output: 2 }, 4: { input: 1, output: 1 } },
  });
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <BarterChainResult result={result} startTier={2} shipMaxWeight={10000} />
    </LanguageProvider>,
  );
  expect(html).toContain("Cantidad recomendada para este viaje");
  expect(html).toContain("deja 8 en el almacén");
  expect(html).toContain("20 × Nivel 1");
  expect(html).toContain("no las sumes entre sí");
});

test("renders a localized explanation when no trade fits", () => {
  globalThis.localStorage = { getItem: () => "es" };
  const result = calculateAutomaticTierChain({
    startTier: 2,
    targetTier: 3,
    startUnits: 1,
    shipMaxWeight: 500,
    ratios: { 2: { input: 1, output: 2 } },
  });
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <BarterChainResult result={result} startTier={2} shipMaxWeight={500} />
    </LanguageProvider>,
  );
  expect(html).toContain("No cabe ningún intercambio");
});
