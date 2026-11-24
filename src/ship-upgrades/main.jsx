import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageProvider } from "../i18n/LanguageContext";
import { ShipUpgradeApp } from "./ShipUpgradeApp";
import { calculatePlan } from "./calculatePlan";
import { fleet } from "./fleet";
import "../index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider setPageTitle={false}>
        <ShipUpgradeApp fleet={fleet} calculatePlan={calculatePlan} />
      </LanguageProvider>
    </React.StrictMode>,
  );
}
