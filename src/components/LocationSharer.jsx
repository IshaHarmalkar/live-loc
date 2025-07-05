// src/components/LocationSharer.jsx
import { useEffect, useState } from "react";
import MapView from "./MapView";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function LocationSharer() {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });

  const [location, setLocation] = useState(null);
  const [peerLocation, setPeerLocation] = useState(null);

  const peerId = userId === "userA" ? "userB" : "userA";

  // Watch and upload my location
  useEffect(() => {
    if (!userId) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        setDoc(doc(db, "locations", userId), coords);
      },
      (err) => console.error("Geolocation error", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);

  // Listen to peer's location
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "locations", peerId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPeerLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => unsubscribe();
  }, [userId, peerId]);

  return (
    <>
      {!userId ? (
        <div style={{ padding: "1rem" }}>
          <h2>Select your user ID</h2>
          <select
            onChange={(e) => {
              setUserId(e.target.value);
              localStorage.setItem("userId", e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="userA">userA</option>
            <option value="userB">userB</option>
          </select>
        </div>
      ) : (
        <div style={{ padding: "1rem" }}>
          <h2>📍 My Location ({userId})</h2>
          <pre>{JSON.stringify(location, null, 2)}</pre>

          <h2>👀 Peer Location ({peerId})</h2>
          <pre>{JSON.stringify(peerLocation, null, 2)}</pre>

          <MapView myLocation={location} peerLocation={peerLocation} />
        </div>
      )}
    </>
  );
}
