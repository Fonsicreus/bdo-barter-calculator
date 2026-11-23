import { afterEach, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TripPlanner } from "../src/components/TripPlanner";
import { LanguageProvider } from "../src/i18n/LanguageContext";

const previousStorage = globalThis.localStorage;
afterEach(() => {
  globalThis.localStorage = previousStorage;
});

test("shows route cargo, space throughout the voyage and space after each stop in Spanish", () => {
  globalThis.localStorage = { getItem: () => "es" };
  const stops = [
    {
      id: "a",
      inputTierLevel: 1,
      outputTierLevel: 2,
      ratioInput: 1,
      ratioOutput: 2,
      tradeCount: 1,
    },
  ];
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <TripPlanner stops={stops} shipMaxWeight={19300} initialCargoWeight={0} shipCapacityValid />
    </LanguageProvider>,
  );
  expect(html).toContain("Resumen de carga de la ruta");
  expect(html).toContain("Carga adicional para toda la ruta");
  expect(html).toContain("Carga después de esta parada");
  expect(html).toMatch(/18[.,\s]?500 LT/);
  expect(html).toContain('role="progressbar"');
});
