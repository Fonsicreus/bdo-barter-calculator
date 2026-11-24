import { afterEach, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import { ItemIcon, ShipUpgradeApp, resolveLocalIcon } from "../src/ship-upgrades/ShipUpgradeApp";
import { calculatePlan } from "../src/ship-upgrades/calculatePlan";
import { advanceCatalog } from "../src/ship-upgrades/catalog";
import { fleet } from "../src/ship-upgrades/fleet";
import { INVENTORY_COOKIE_NAME } from "../src/ship-upgrades/inventory";
import { shipUpgradeMessages } from "../src/ship-upgrades/messages";

const catalog = {
  items: {
    green: {
      name: "Green prow",
      category: "equipment",
      icon: "icons/green.png",
      shop: { unitPrice: 100 },
    },
    blue: { name: "Blue prow", category: "equipment" },
    timber: {
      name: "Timber",
      category: "material",
      source: "Local material source",
      shop: { unitPrice: 10 },
    },
    stones: { name: "Enhancement stone", category: "enhancement" },
    unknown: { name: "Unpriced material", category: "material" },
    quest: { name: "Quest material", category: "material" },
    unused: { name: "Unused material", category: "material" },
  },
  gear: [
    { id: "green", name: "Green prow", tier: "green" },
    { id: "blue", name: "Blue prow", tier: "blue" },
  ],
};
const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
afterEach(() => {
  if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
  else Reflect.deleteProperty(globalThis, "document");
});

test("the selected origin limits destinations and shows the requested route on reload", () => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      cookie: `${INVENTORY_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({
          version: 1,
          inventory: { routeId: "31049-31057", owned: { 5812: 30 } },
        }),
      )}`,
    },
  });
  const html = renderToStaticMarkup(<ShipUpgradeApp fleet={fleet} calculatePlan={calculatePlan} />);
  expect(html).toContain("Epheria Galleass → Epheria Carrack: Valor");
  expect(html).toContain('value="31049-31057" selected="">Epheria Carrack: Valor');
  expect(html).toContain('value="31049-31056">Epheria Carrack: Volante');
  expect(html).not.toContain('value="31048-31054"');
  expect(html).toContain("White Horn Figurehead");
  expect(html).not.toContain("Brass Figurehead");
  expect(html).toContain('value="30"');
});

test("guild routes don't present unavailable enhancements or Crow Coin quotes", () => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      cookie: `${INVENTORY_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({
          version: 1,
          inventory: { routeId: "9090-9124" },
        }),
      )}`,
    },
  });
  const html = renderToStaticMarkup(<ShipUpgradeApp fleet={fleet} calculatePlan={calculatePlan} />);
  expect(html).toContain("Guild Galley → Improved Galley");
  expect(html).toContain("No Crow Coin shop purchases are modeled for this route");
  expect(html).toContain('value="0">Owned');
  expect(html).not.toContain("Pity</label>");
  expect(html).not.toContain("Stone boxes remaining this week");
  expect(html).not.toContain("Ivory Figurehead +10");
});

test.each([
  [
    "es",
    "Español",
    "Calculadora de mejoras de barcos",
    "Barco actual",
    "Fibra de Kaniwha",
    "40 corvarios por unidad",
  ],
  ["zh-CN", "简体中文", "船舶扩建计算器", "当前船舶", "印着月之血管的亚麻布", "每件 40 乌鸦硬币"],
])(
  "the upgrade page renders the saved %s language and localized prices",
  (locale, language, title, currentShip, material, unitPrice) => {
    const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key) => (key === "bdo-language" ? locale : null) },
    });
    try {
      const html = renderToStaticMarkup(
        <LanguageProvider messages={shipUpgradeMessages} setPageTitle={false}>
          <ShipUpgradeApp fleet={fleet} calculatePlan={calculatePlan} />
        </LanguageProvider>,
      );
      expect(html).toContain(`lang="${locale}" class="ship-upgrade-app`);
      expect(html).toContain(`aria-label="${language}" aria-pressed="true"`);
      expect(html).toContain(`${title}</a>`);
      expect(html).toContain(`${currentShip}</label>`);
      expect(html).toContain(material);
      expect(html).toContain(unitPrice);
    } finally {
      if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  },
);

function renderApp(inventory = {}, override = {}) {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      cookie: `${INVENTORY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ version: 1, inventory }))}`,
    },
  });
  let receivedInventory;
  const html = renderToStaticMarkup(
    <ShipUpgradeApp
      catalog={catalog}
      calculatePlan={(receivedCatalog, current) => {
        expect(receivedCatalog).toBe(catalog);
        receivedInventory = current;
        return {
          rows: [
            {
              id: "green",
              required: current.gearLevels.blue >= 0 ? 0 : 1,
              owned: 0,
              missing: 1,
              cost: 100,
              status: "buy",
            },
            {
              id: "blue",
              required: 1,
              owned: current.gearLevels.blue >= 0 ? 1 : 0,
              missing: current.gearLevels.blue >= 0 ? 0 : 1,
              cost: 0,
              status: "craft",
            },
            {
              id: "timber",
              required: 5,
              owned: current.owned.timber ?? 0,
              missing: Math.max(0, 5 - (current.owned.timber ?? 0)),
              cost: 10 * Math.max(0, 5 - (current.owned.timber ?? 0)),
              status: "buy",
            },
            {
              id: "stones",
              required: 40,
              owned: 0,
              missing: 40,
              cost: 80,
              status: "buy",
              purchase: { boxes: 2, units: 20, bundleQuantity: 20 },
            },
            { id: "unknown", required: 2, owned: 0, missing: 2, cost: null, status: "unpriced" },
            { id: "quest", required: 1, owned: 0, missing: 1, cost: null, status: "other" },
          ],
          buyableCost: 230,
          silverCost: 1000000,
          stillToEarn: Math.max(0, 230 - current.balance),
          unverifiedCount: 1,
          ...override,
        };
      }}
    />,
  );
  return { html, receivedInventory };
}

test("upgrade app renders standalone English page, navigation and price summaries", () => {
  const { html, receivedInventory } = renderApp();
  expect(html).toContain('lang="en"');
  expect(html).toContain("Epheria Caravel → Epheria Carrack: Advance");
  expect(html).toContain("Crow Coins needed");
  expect(html).toContain("Your balance");
  expect(html).toContain("Still to earn");
  expect(html).toContain("not an all-in upgrade cost");
  expect(html).not.toContain("Estimate limitations");
  expect(html).not.toContain("Silver for missing green gear");
  expect(html).not.toContain("1,000,000");
  expect(html).toContain('href="/ship-upgrades/" aria-current="page"');
  expect(html).toContain("Reset upgrade inventory");
  expect(html).not.toContain("NaN");
  expect(receivedInventory).toEqual({
    owned: {},
    gearLevels: {},
    balance: 0,
    remainingStoneBoxes: 10,
  });
});

test("owned blue +0 shows current enhancement progress, not upgrade readiness", () => {
  const { html, receivedInventory } = renderApp({ gearLevels: { blue: 0 } });
  expect(receivedInventory.gearLevels.blue).toBe(0);
  expect(html).toContain("Current +0 / target +10");
  expect(html).toContain("Base part owned");
  expect(html).not.toContain("+10 reached");
  expect(html).not.toMatch(/\bready\b/i);
  expect(html).not.toContain("Green prow");
  expect(html).toContain("its green part and recipe are hidden");
});

test("needed equipment is editable, with Not owned then +0 through +10 and no raw quantity fields", () => {
  const { html } = renderApp({ gearLevels: { green: 10 } });
  expect(html.match(/<select/g)).toHaveLength(3);
  const gearSelects = [...html.matchAll(/<select[^>]*>(.*?)<\/select>/g)].slice(0, 2);
  for (const [, options] of gearSelects) {
    expect(options.match(/<option/g)).toHaveLength(12);
    expect(options).toMatch(/^<option value="-1"[^>]*>Not owned<\/option><option value="0"/);
    expect(options).toContain('value="10"');
  }
  expect(html).not.toContain("Owned Green prow");
  expect(html).not.toContain("Owned Blue prow");
  expect(html).toContain("+10 reached");
  expect(html).toContain("Green equipment at +10 is consumed");
});

test("fully owned and currently unused materials remain editable and are not charged twice", () => {
  const { html } = renderApp({ owned: { timber: 5, unused: 9 } });
  expect(html).toContain("Owned Timber");
  expect(html).toContain("Owned Unused material");
  expect(html).toContain('value="5"');
  expect(html).toContain('value="9"');
  const timberRow = html.match(/<tr[^>]*><th[^>]*>.*?Timber.*?<\/tr>/)?.[0];
  expect(timberRow).toBeDefined();
  expect(timberRow).toContain(">Owned</span>");
  expect(timberRow).toMatch(/tabular-nums">0<\/td><\/tr>$/);
});

test("weekly availability, purchase quantities, gear acquisition, and unknown versus other costs are shown", () => {
  const { html, receivedInventory } = renderApp({ remainingStoneBoxes: 0 });
  expect(receivedInventory.remainingStoneBoxes).toBe(0);
  expect(html).toContain("Stone boxes remaining this week");
  expect(html).toContain("Update this manually");
  expect(html).toContain("2 × box of 20 + 20 individual");
  expect(html).toContain("100 CC per unit");
  expect(html).toContain("10 CC per unit");
  expect(html).not.toContain(">Buy 5");
  expect(html).toContain("Other acquisition");
  expect(html).toContain("Unpriced");
  expect(html).toContain("1 acquisition entry needs verification");
  expect(html).toContain("Minimum stones");
  expect(html).toContain("Local material source");
});

test("stored balance is passed once to the injected planner and its totals are used directly", () => {
  const { html, receivedInventory } = renderApp(
    { balance: 200 },
    { buyableCost: 1234, stillToEarn: 1034 },
  );
  expect(receivedInventory.balance).toBe(200);
  expect(html).toContain("1,234");
  expect(html).toContain("1,034");
  expect(html).toContain('value="200"');
});

test("malformed inventory cookie does not crash server rendering", () => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { cookie: `${INVENTORY_COOKIE_NAME}=%ZZ` },
  });
  const html = renderToStaticMarkup(
    <ShipUpgradeApp
      catalog={catalog}
      calculatePlan={() => ({
        rows: [],
        buyableCost: 0,
        silverCost: 0,
        stillToEarn: 0,
        unverifiedCount: 0,
      })}
    />,
  );
  expect(html).toContain("Plan your next ship upgrade");
});

test("the production page shows all four recipes, item icons and credits", () => {
  const html = renderToStaticMarkup(
    <ShipUpgradeApp catalog={advanceCatalog} calculatePlan={calculatePlan} />,
  );
  expect(html.match(/Recipe source \(BDO Codex\)/g)).toHaveLength(4);
  expect(html.match(/<img\b/g)).toHaveLength(26);
  expect(html).toContain("180 × Bright Reef Piece");
  expect(html).toContain("Verisha Cannon +10");
  expect(html).toContain("210,720");
  expect(html).toContain("BDO Atlas");
  expect(html).not.toMatch(/(?:7|8|9|32),000,000/);
  expect(html.match(/Satella Shadow Violet/g)).toHaveLength(2);
  expect(html).toMatch(
    /<section aria-label="Sources and credits".*BDO Atlas.*<\/section><\/main><footer.*Crafted with.*<\/footer>/,
  );
  expect(html.match(/<footer.*<\/footer>/)?.[0]).not.toContain("BDO Atlas");
  expect(html).toMatch(
    /<span>by<\/span><a href="https:\/\/github\.com\/Fonsicreus"[^>]*>Satella<\/a>/,
  );
});

test("owning a blue part hides its green part and recipe without moving other pairs", () => {
  for (const blueLevel of [0, 10, -1]) {
    const inventory = { gearLevels: { 49651: 7, 49657: blueLevel } };
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        cookie: `${INVENTORY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ version: 1, inventory }))}`,
      },
    });
    let savedGreenLevel;
    const html = renderToStaticMarkup(
      <ShipUpgradeApp
        catalog={advanceCatalog}
        calculatePlan={(catalog, stock, options) => {
          savedGreenLevel = stock.gearLevels["49651"];
          return calculatePlan(catalog, stock, options);
        }}
      />,
    );
    expect(savedGreenLevel).toBe(7);
    expect(html).toContain("Brass Figurehead");
    expect(html).toContain("Mayna Cannon");
    expect(html.includes("Verisha Cannon")).toBe(blueLevel === -1);
    expect(html.includes("bdocodex.com/us/design/8841/")).toBe(blueLevel === -1);
    expect(html.includes("Current +7 / target +10")).toBe(blueLevel === -1);
    const groups = [...html.matchAll(/data-gear-pair="([^"]+)"/g)];
    expect(groups.map((group) => group[1])).toEqual(["49655", "49656", "49657", "49658"]);
    const cannon = html.slice(groups[2].index, groups[3].index);
    const sail = html.slice(groups[3].index, html.indexOf("Blue equipment recipes"));
    expect(cannon.includes("Verisha Cannon")).toBe(blueLevel === -1);
    expect(cannon).not.toContain("White Wind Sail");
    expect(sail).toContain("White Wind Sail");
    if (blueLevel === -1) {
      expect(cannon.indexOf(">Mayna Cannon</label>")).toBeLessThan(
        cannon.indexOf(">Verisha Cannon</label>"),
      );
    }
  }
});

test("the fragment row and the repair summary agree on missing fragment costs", () => {
  for (const [owned, price, expected] of [
    [4, 2_000_000, "3,000,000,000 silver"],
    [4, 1_000_000, "1,500,000,000 silver"],
    [4, 0, "Price not set"],
    [1504, 0, "0 silver"],
  ]) {
    const inventory = { owned: { 44195: owned }, memoryFragmentPrice: price };
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        cookie: `${INVENTORY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ version: 1, inventory }))}`,
      },
    });
    const html = renderToStaticMarkup(
      <ShipUpgradeApp
        catalog={advanceCatalog}
        calculatePlan={(catalog, stock) => calculatePlan(catalog, stock, { worstCase: true })}
      />,
    );
    const fragmentRow = (html.match(/<tr\b.*?<\/tr>/g) ?? []).find((row) =>
      row.includes(">Memory Fragment</span>"),
    );
    expect(fragmentRow).toContain(`>${expected}</td>`);
    expect(html.match(/<section aria-labelledby="repair-heading".*?<\/section>/)?.[0]).toContain(
      `>${expected}</p>`,
    );
    expect(html).not.toContain("Total silver including green gear");
  }
});

test("equipment and ship tabs separate materials and keep inventory controls near the top", () => {
  const html = renderToStaticMarkup(
    <ShipUpgradeApp catalog={advanceCatalog} calculatePlan={calculatePlan} />,
  );
  expect(html).toContain('aria-pressed="true" aria-controls="ship-panel"');
  expect(html).toContain('aria-pressed="false" aria-controls="equipment-panel"');
  expect(html).toContain(" Ship Equipment</button>");
  expect(html.indexOf('aria-controls="ship-panel"')).toBeLessThan(
    html.indexOf('aria-controls="equipment-panel"'),
  );
  expect(html).toContain('id="equipment-panel" hidden=""');
  const equipment = html.slice(
    html.indexOf('id="equipment-panel"'),
    html.indexOf('id="ship-panel"'),
  );
  const ship = html.slice(html.indexOf('id="ship-panel"'));
  expect(equipment).toContain("Owned Bright Reef Piece");
  expect(equipment).not.toContain("Owned Moon Vein Flax Fabric");
  expect(ship).toContain("Owned Moon Vein Flax Fabric");
  expect(ship).not.toContain("Owned Bright Reef Piece");
  expect(html.indexOf("Reset upgrade inventory")).toBeLessThan(html.indexOf("Crow Coins needed"));
  expect(html).not.toContain("Your local inventory");
  expect(equipment).toContain("Pity</label>");
  expect(ship).not.toContain("Pity</label>");
});

test("local icons honor the deployment base and reject remote or escaping paths", () => {
  expect(resolveLocalIcon("icons/ship.png", "/bdo/")).toBe("/bdo/icons/ship.png");
  for (const icon of [
    undefined,
    "",
    "https://example.com/a.png",
    "//example.com/a.png",
    "data:image/png;base64,test",
    "/root.png",
    "../a.png",
    "%2e%2e/a.png",
    "%2f%2fexample.com/a.png",
    "icons\\a.png",
    "%ZZ",
    " a.png",
  ]) {
    expect(resolveLocalIcon(icon, "/bdo/")).toBeNull();
  }
  const local = renderToStaticMarkup(<ItemIcon icon="icons/ship.png" />);
  expect(local).toContain('src="/icons/ship.png" alt=""');
  expect(local).toContain('aria-hidden="true"');
  const fallback = renderToStaticMarkup(<ItemIcon />);
  expect(fallback).not.toContain("<img");
  expect(fallback).toContain("◇");
  expect(renderToStaticMarkup(<ItemIcon icon="https://example.com/a.png" />)).not.toContain("<img");
});
