import spanish from "./i18n/es";
import japanese from "./i18n/ja";
import korean from "./i18n/ko";
import simplifiedChinese from "./i18n/zh-CN";

export const shipUpgradeMessages = {
  es: spanish,
  ko: korean,
  ja: japanese,
  "zh-CN": simplifiedChinese,
};

export const calculatorNavigationMessages = Object.fromEntries(
  Object.entries(shipUpgradeMessages).map(([language, messages]) => [
    language,
    Object.fromEntries(
      ["Calculators", "Barter Calculator", "Ship Upgrade Calculator"].map((key) => [
        key,
        messages[key],
      ]),
    ),
  ]),
);
