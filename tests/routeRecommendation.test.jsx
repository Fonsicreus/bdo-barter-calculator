import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { RouteTradeForm } from "../src/components/RouteTradeForm";
import { TripPlanner } from "../src/components/TripPlanner";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { findFittingQuantity } from "../src/utils/routeRecommendation";

const stop = {
  id: "last",
  inputTierLevel: 1,
  outputTierLevel: 2,
  ratioInput: 1,
  ratioOutput: 2,
  tradeCount: 4,
};

test("finds the largest fitting count and honors final overload rules", () => {
  const options = {
    quantity: 4,
    makeStops: (count) => [{ ...stop, tradeCount: count }],
    shipMaxWeight: 2000,
    initialCargoWeight: 0,
    shipCapacityValid: true,
  };
  expect(findFittingQuantity(options).quantity).toBe(2);
  expect(findFittingQuantity({ ...options, finalCargoLimit: 3000 }).quantity).toBe(3);
  expect(findFittingQuantity({ ...options, initialCargoWeight: 2001 }).quantity).toBeNull();
});

test("shows live draft cargo and warns before the exchange is added", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <RouteTradeForm
        onAddStops={() => {}}
        existingStops={[]}
        shipMaxWeight={500}
        initialCargoWeight={0}
        shipCapacityValid
      />
    </LanguageProvider>,
  );
  expect(html).toContain("Cargo overview includes this unsaved exchange");
  expect(html).toContain("This proposed exchange makes the route exceed an allowed cargo limit.");
  expect(html).toContain("Voyage cargo overview");
});

test("offers a fitting reduction for the latest stop and exposes its editor", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <TripPlanner
        stops={[stop]}
        latestStopId="last"
        onChangeTradeCount={() => {}}
        shipMaxWeight={2000}
        initialCargoWeight={0}
        shipCapacityValid
      />
    </LanguageProvider>,
  );
  expect(html).toContain("Change the last added stop to 2 exchanges");
  expect(html).toContain("Reduce exchange count");
  expect(html).toContain("Increase exchange count");
});
