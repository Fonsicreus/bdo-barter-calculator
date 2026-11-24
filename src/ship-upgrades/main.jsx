import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageProvider } from "../i18n/LanguageContext";
import { ShipUpgradeApp } from "./ShipUpgradeApp";
import { calculatePlan } from "./calculatePlan";
import { fleet } from "./fleet";
import { shipUpgradeMessages } from "./messages";
import "../index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider messages={shipUpgradeMessages} setPageTitle={false}>
        <ShipUpgradeApp fleet={fleet} calculatePlan={calculatePlan} />
      </LanguageProvider>
    </React.StrictMode>,
  );
}
