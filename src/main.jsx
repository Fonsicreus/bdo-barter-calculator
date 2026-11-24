import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import { calculatorNavigationMessages } from "./ship-upgrades/messages";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider messages={calculatorNavigationMessages}>
        <App />
      </LanguageProvider>
    </React.StrictMode>,
  );
}
