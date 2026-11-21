import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/App";
import { LanguageProvider } from "../src/i18n/LanguageContext";

test("renders the three trade menus and the multi-trade form", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  );
  expect(html).toContain("Single trade");
  expect(html).toContain("Tier chain");
  expect(html).toContain("Multiple trades");
  expect(html).toContain("Add an exchange to your route");
  expect(html).toContain("Use matching goods from earlier stops");
});
