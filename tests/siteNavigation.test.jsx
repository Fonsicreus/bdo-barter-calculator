import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Header } from "../src/components/Header";
import { SiteFooter } from "../src/components/SiteFooter";
import { SiteHeader } from "../src/components/SiteHeader";
import { SiteNavigation, getSitePaths } from "../src/components/SiteNavigation";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { spanish } from "../src/i18n/spanish";

test("calculator navigation honors root and nested Vite bases", () => {
  expect(getSitePaths("/")).toEqual({ barter: "/", shipUpgrades: "/ship-upgrades/" });
  expect(getSitePaths("/bdo/")).toEqual({ barter: "/bdo/", shipUpgrades: "/bdo/ship-upgrades/" });
  expect(getSitePaths("/bdo")).toEqual(getSitePaths("/bdo/"));
});

test("both calculator links stay visible without a mobile disclosure", () => {
  for (const current of ["barter", "ship-upgrades"]) {
    const html = renderToStaticMarkup(<SiteNavigation current={current} baseUrl="/bdo/" />);
    expect(html).toContain('aria-label="Calculators"');
    expect(html).toContain('href="/bdo/"');
    expect(html).toContain('href="/bdo/ship-upgrades/"');
    expect(html).toContain("Barter Calculator</a>");
    expect(html).toContain("Ship Upgrade Calculator</a>");
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(
      current === "barter"
        ? /href="\/bdo\/" aria-current="page"/
        : /href="\/bdo\/ship-upgrades\/" aria-current="page"/,
    );
    expect(html).not.toContain("hidden");
    expect(html).not.toContain("<details");
  }
});

test("existing barter header includes active navigation without replacing language controls", () => {
  const html = renderToStaticMarkup(
    <LanguageProvider>
      <Header theme="light" />
    </LanguageProvider>,
  );
  expect(html).toContain('href="/" aria-current="page"');
  expect(html).toContain('href="/ship-upgrades/"');
  expect(html).toContain('aria-label="English"');
  expect(html).toContain('aria-label="Toggle theme"');
  expect(html).toContain('title="Silver Mist"');
});

test("upgrade header displays the theme name without barter controls", () => {
  for (const [theme, name] of [
    ["dark", "Satella Shadow Violet"],
    ["light", "Silver Mist"],
  ]) {
    const header = renderToStaticMarkup(
      <SiteHeader current="ship-upgrades" title="Ship Upgrade Calculator" theme={theme} />,
    );
    expect(header).toContain(`>${name}</span>`);
    expect(header).not.toContain("Debug");
    expect(header).not.toContain('aria-label="English"');
    expect(header.includes("Satella Mode")).toBe(theme === "dark");
  }
});

test("the shared footer credits Satella with a GitHub profile link", () => {
  const footer = renderToStaticMarkup(
    <SiteFooter description="Barter Calculator" t={(label) => spanish[label] ?? label} />,
  );
  expect(footer).toContain("Creado con");
  expect(footer).toMatch(
    /<span>por<\/span><a href="https:\/\/github\.com\/Fonsicreus"[^>]*>Satella<\/a>/,
  );
  expect(footer).not.toMatch(/Satella Shadow Violet|Silver Mist/);
});
