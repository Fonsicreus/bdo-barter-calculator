import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { RouteRatioSelector } from "../src/components/RouteRatioSelector";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { calculateAutomaticTierChain, simulateRoute } from "../src/utils/calculator";
import { buildRouteChain } from "../src/utils/routeChain";

test("tier zero exchanges use the preloaded weight without inventing material quantities", () => {
  const ratios = { 0: { input: 1, output: 1 }, 1: { input: 1, output: 2 } };
  const chain = calculateAutomaticTierChain({
    startTier: 0,
    targetTier: 2,
    startUnits: 4,
    shipMaxWeight: 2000,
    preloadedCargoWeight: 500,
    ratios,
  });
  expect(chain.plan.sourceUnits).toBe(1);
  expect(chain.plan.finalCargoWeight).toBe(1300);
  const route = buildRouteChain({ startTier: 0, targetTier: 2, quantity: 1, ratios });
  expect(route.stops.map((stop) => stop.tradeCount)).toEqual([1, 1]);
  const simulation = simulateRoute(route.stops, 2000, 500, true);
  expect(simulation.startWeight).toBe(500);
  expect(simulation.totalCargoWeight).toBe(1300);
});

test("custom ratios are available only in debug and never on the fixed tier zero leg", () => {
  const render = (tier, debugEnabled) =>
    renderToStaticMarkup(
      <LanguageProvider>
        <RouteRatioSelector
          tier={tier}
          debugEnabled={debugEnabled}
          value={{ mode: "preset", presetIndex: 0 }}
          onChange={() => {}}
        />
      </LanguageProvider>,
    );
  expect(render(1, false)).not.toContain("Custom");
  expect(render(1, true)).toContain("Custom");
  expect(render(0, true)).not.toContain("Custom");
  expect(render(0, true)).toContain("1:1");
});
