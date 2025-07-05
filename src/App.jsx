import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LocationSharer from "./components/LocationSharer.jsx";
import React from "react";

function App() {
  console.log("App component rendered"); // 👈 add this
  return (
    <div>
      <h1>Hello Firebase Location</h1>
      <LocationSharer />
    </div>
  );
}

export default App;
