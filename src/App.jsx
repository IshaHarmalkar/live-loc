import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import RideLiveTracker from "./components/RideShare/RideLiveTracker";
import React from "react";

function App() {
  console.log("App component rendered"); // 👈 add this
  return (
    <div>
      <h1>Hello Firebase Location</h1>
      {/* <LocationSharer /> */}
      <RideLiveTracker
        currentUserId="user_123"
        participants={[
          { rideId: "ride_abc", userId: "user_123", name: "You" },
          { rideId: "ride_abc", userId: "user_456", name: "Alice" },
          { rideId: "ride_abc", userId: "user_789", name: "Bob" },
        ]}
      />
    </div>
  );
}

export default App;
