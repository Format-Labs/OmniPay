import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TransactionProvider } from "./context/GContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </React.StrictMode>
);
