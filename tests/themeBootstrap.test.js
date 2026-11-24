import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import viteConfig from "../vite.config";

const bootstrap = viteConfig.plugins.find(({ name }) => name === "theme-bootstrap");

test("both HTML entries can set the saved theme and background before loading React", () => {
  const [script, style] = bootstrap.transformIndexHtml();
  expect(script).toMatchObject({ tag: "script", injectTo: "head-prepend" });
  expect(style).toMatchObject({ tag: "style", injectTo: "head-prepend" });
  expect(style.children).toContain(":root.dark { color-scheme: dark");

  for (const [cookie, expectedDark] of [
    ["", true],
    ["bdo_theme=dark", true],
    ["bdo_theme=light", false],
    ["other=dark; bdo_theme=light; another=dark", false],
    ["other_bdo_theme=light; bdo_theme=invalid", true],
    ["bdo_theme=%ZZ", true],
    [null, true],
  ]) {
    const toggles = [];
    runInNewContext(script.children, {
      document: {
        documentElement: { classList: { toggle: (...args) => toggles.push(args) } },
        get cookie() {
          if (cookie === null) throw new Error("Cookies blocked");
          return cookie;
        },
      },
    });
    expect(toggles).toEqual([["dark", expectedDark]]);
  }
});
