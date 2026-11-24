import { useRef, useState } from "react";
import { setCookie } from "../utils/cookies";
import { THEME_COOKIE_NAME } from "../utils/theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const root = typeof document === "undefined" ? null : document.documentElement;
    return root && !root.classList.contains("dark") ? "light" : "dark";
  });
  const themeFrame = useRef(null);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    const isDark = root.classList.toggle("dark");
    const nextTheme = isDark ? "dark" : "light";
    setTheme(nextTheme);

    if (themeFrame.current !== null) cancelAnimationFrame(themeFrame.current);
    themeFrame.current = requestAnimationFrame(() => {
      themeFrame.current = requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
        themeFrame.current = null;
      });
    });

    try {
      setCookie(THEME_COOKIE_NAME, nextTheme, 365);
    } catch {
      return;
    }
  };

  return { theme, toggleTheme };
}
