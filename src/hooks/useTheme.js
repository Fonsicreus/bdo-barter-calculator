import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../utils/cookies";

const THEME_COOKIE_NAME = "bdo_theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = getCookie(THEME_COOKIE_NAME);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    // Default to dark (Satella Re:Zero theme)
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setCookie(THEME_COOKIE_NAME, theme, 365);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}
