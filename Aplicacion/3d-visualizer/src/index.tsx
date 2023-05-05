import "./init"

import React from "react";
import ReactDOM from "react-dom";
import { MainComponent } from "./Graph/MainComponent";
import { createRoot } from "react-dom/client";
import { createTheme, NextUIProvider } from "@nextui-org/react"

function App() {
  return (
      <MainComponent />
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}