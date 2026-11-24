import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { THEME_COOKIE_NAME } from "./src/utils/theme.js";

const themeBootstrap = {
  name: "theme-bootstrap",
  transformIndexHtml() {
    return [
      {
        tag: "script",
        injectTo: "head-prepend",
        children: `(() => {
  let light = false;
  try {
    light = /(?:^|;\\s*)${THEME_COOKIE_NAME}=light(?:;|$)/.test(document.cookie);
  } catch {
    light = false;
  }
  document.documentElement.classList.toggle("dark", !light);
})();`,
      },
      {
        tag: "style",
        injectTo: "head-prepend",
        children: `
  :root { color-scheme: light; --page-background: #f8fafc; background-color: var(--page-background); }
  :root.dark { color-scheme: dark; --page-background: #080611; }
`,
      },
    ];
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), themeBootstrap],
  build: {
    rollupOptions: {
      input: {
        barter: fileURLToPath(new URL("./index.html", import.meta.url)),
        shipUpgrades: fileURLToPath(new URL("./ship-upgrades/index.html", import.meta.url)),
      },
    },
  },
});
