import { ArrowLeftRight, ListPlus, Route } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { CalculatorMenuTabs } from "./CalculatorMenuTabs";

const MENUS = [
  { id: "single", label: "Single trade", icon: ArrowLeftRight },
  { id: "chain", label: "Tier chain", icon: Route },
  { id: "route", label: "Multiple trades", icon: ListPlus },
];

export function TradeMenuTabs({ active, onChange }) {
  const { t } = useLanguage();
  return (
    <CalculatorMenuTabs
      label={t("Choose a trade calculator")}
      menus={MENUS.map((menu) => ({ ...menu, label: t(menu.label) }))}
      active={active}
      onChange={onChange}
    />
  );
}
