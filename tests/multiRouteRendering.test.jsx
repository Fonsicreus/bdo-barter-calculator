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
  expect(html).toContain("Minimum level");
  expect(html).toContain("Automatic exchange preview");
  expect(html).toContain("1:2");
  expect(html).toContain("1:3");
  expect(html).toContain("Barter route unlocks");
  expect(html).toMatch(/20[,.\s]?470/);
  expect(html).toContain("Special Barter may start appearing at around 140");
  expect(html).toContain("Special Barter requirements");
  expect(html).toContain("gold bars or Level 4 goods");
  expect(html).not.toContain("Supreme Gold Candlestick");
});
