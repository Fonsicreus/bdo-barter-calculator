import { createContext, useContext, useEffect, useState } from "react";
import { spanish } from "./spanish";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("bdo-language") === "es" ? "es" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("bdo-language", language);
    } catch {
      // Language selection remains available for this session.
    }
  }, [language]);

  const t = (text, values = {}) => {
    const translated = language === "es" ? (spanish[text] ?? text) : text;
    return translated.replace(/\{(\w+)\}/g, (match, key) =>
      Object.hasOwn(values, key) ? String(values[key]) : match,
    );
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
