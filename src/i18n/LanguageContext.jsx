import { createContext, useContext, useEffect, useState } from "react";
import { japanese } from "./japanese";
import { korean } from "./korean";
import { LOCALES } from "./locales";
import { simplifiedChinese } from "./simplifiedChinese";
import { spanish } from "./spanish";

const LanguageContext = createContext(null);
const translations = { es: spanish, ko: korean, ja: japanese, "zh-CN": simplifiedChinese };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem("bdo-language");
      return LOCALES.some(({ id }) => id === savedLanguage) ? savedLanguage : "en";
    } catch {
      return "en";
    }
  });
  const dictionary = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = dictionary?.["BDO Barter Calculator"] ?? "BDO Barter Calculator";
    try {
      localStorage.setItem("bdo-language", language);
    } catch {
      // Language selection remains available for this session.
    }
  }, [dictionary, language]);

  const t = (text, values = {}) => {
    const translated = dictionary && Object.hasOwn(dictionary, text) ? dictionary[text] : text;
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
