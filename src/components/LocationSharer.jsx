import { useState, useEffect, useRef } from "react";
import ActiveUsersList from "./ActiveUsersList";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import MapView from "./MapView";

// Name generator fallback
function generateName() {
  const animals = ["Panda", "Lion", "Fox", "Dolphin", "Eagle", "Otter"];
  return (
    animals[Math.floor(Math.random() * animals.length)] +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

export default function LocationSharer() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState(null);
  const [allUsers, setAllUsers] = useState({});
  const watchIdRef = useRef(null);

  // Save name if not set
  const handleNameSubmit = () => {
    const finalName = name.trim() || generateName();
    localStorage.setItem("name", finalName);
    setName(finalName);
  };

  // Start live sharing
  const startSharing = () => {
    if (!name) return alert("Enter your name first!");
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name,
          lastUpdated: Date.now(),
        };
        setLocation(coords);
        setDoc(doc(db, "locations", name), coords);
      },
      (err) => console.error("Geolocation error", err),
      { enableHighAccuracy: true }
    );
    watchIdRef.current = id;
    setIsSharing(true);
  };

  // Stop sharing
  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    deleteDoc(doc(db, "locations", name));
    setIsSharing(false);
  };

  // Listen for all active users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snap) => {
      const users = {};
      snap.forEach((doc) => {
        if (doc.id !== name) {
          users[doc.id] = doc.data();
        }
      });
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, [name]);

  return (
    <div style={{ padding: "1rem" }}>
      {!name ? (
        <div>
          <h2>👤 Enter your name</h2>
          <input
            type="text"
            placeholder="Your name (or leave blank)"
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "1rem" }}
          />
          <button onClick={handleNameSubmit}>Continue</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {name}</h2>
          <button onClick={isSharing ? stopSharing : startSharing}>
            {isSharing ? "⛔ Stop Sharing" : "📡 Start Sharing"}
          </button>

          <div style={{ display: "flex", marginTop: "1rem" }}>
            <div style={{ flex: 1 }}>
              <MapView
                myLocation={location}
                otherUsers={Object.values(allUsers)}
              />
            </div>
            <ActiveUsersList users={allUsers} />
          </div>
        </div>
      )}
    </div>
  );
}
