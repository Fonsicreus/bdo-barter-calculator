import { createContext, useContext, useEffect, useState } from "react";
import { japanese } from "./japanese";
import { korean } from "./korean";
import { LOCALES } from "./locales";
import { simplifiedChinese } from "./simplifiedChinese";
import { spanish } from "./spanish";

const translations = { es: spanish, ko: korean, ja: japanese, "zh-CN": simplifiedChinese };
const LanguageContext = createContext({ language: "en", t: interpolate });

function interpolate(text, values = {}) {
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}

export function LanguageProvider({ children, messages, setPageTitle = true }) {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem("bdo-language");
      return LOCALES.some(({ id }) => id === savedLanguage) ? savedLanguage : "en";
    } catch {
      return "en";
    }
  });
  const dictionary = translations[language];
  const extra = messages?.[language];

  useEffect(() => {
    document.documentElement.lang = language;
    if (setPageTitle) {
      document.title = dictionary?.["BDO Barter Calculator"] ?? "BDO Barter Calculator";
    }
    try {
      localStorage.setItem("bdo-language", language);
    } catch {
      // Language selection remains available for this session.
    }
  }, [dictionary, language, setPageTitle]);

  const t = (text, values = {}) => {
    return interpolate(
      extra && Object.hasOwn(extra, text)
        ? extra[text]
        : dictionary && Object.hasOwn(dictionary, text)
          ? dictionary[text]
          : text,
      values,
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
