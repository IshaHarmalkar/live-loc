import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Activity,
  AlertCircle,
  Users,
  Share2,
  Wifi,
  WifiOff,
  Database,
} from "lucide-react";

const FirebaseLocationSharing = () => {
  const [myPosition, setMyPosition] = useState(null);
  const [peerPositions, setPeerPositions] = useState({});
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [myDeviceId] = useState(
    () => `device_${Math.random().toString(36).substr(2, 9)}`
  );
  const [positionHistory, setPositionHistory] = useState([]);
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });
  const [configSet, setConfigSet] = useState(false);

  const watchIdRef = useRef(null);
  const dbRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // Initialize Firebase
  const initializeFirebase = async () => {
    try {
      if (!configSet) {
        setError("Please configure Firebase settings first");
        return;
      }

      // For demo purposes, we'll simulate Firebase functionality
      // In real implementation, you'd use: import { initializeApp } from 'firebase/app';
      console.log("Firebase initialized with config:", firebaseConfig);
      setConnected(true);
      setError(null);
    } catch (error) {
      setError("Failed to initialize Firebase: " + error.message);
      setConnected(false);
    }
  };

  // Simulate Firebase real-time database
  const simulateFirebaseConnection = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    // In real implementation, this would be:
    // const db = getDatabase();
    // const roomRef = ref(db, `rooms/${roomId}`);

    const roomKey = `firebase_room_${roomId}`;

    // Listen for changes
    const pollForChanges = setInterval(() => {
      try {
        const roomData = JSON.parse(localStorage.getItem(roomKey) || "{}");
        const otherDevices = Object.keys(roomData).filter(
          (id) => id !== myDeviceId
        );

        const newPeerPositions = {};
        otherDevices.forEach((deviceId) => {
          if (roomData[deviceId]) {
            newPeerPositions[deviceId] = roomData[deviceId];
          }
        });

        setPeerPositions(newPeerPositions);
        setConnected(true);
        setError(null);
      } catch (error) {
        console.error("Error polling for changes:", error);
      }
    }, 1000);

    unsubscribeRef.current = () => clearInterval(pollForChanges);
    setConnected(true);
  };

  // Send position to Firebase
  const sendPositionToFirebase = (position) => {
    if (!roomId || !connected) return;

    try {
      const roomKey = `firebase_room_${roomId}`;
      const roomData = JSON.parse(localStorage.getItem(roomKey) || "{}");

      roomData[myDeviceId] = {
        position: position,
        timestamp: Date.now(),
        deviceId: myDeviceId,
      };

      localStorage.setItem(roomKey, JSON.stringify(roomData));

      // In real implementation, this would be:
      // const db = getDatabase();
      // const deviceRef = ref(db, `rooms/${roomId}/${myDeviceId}`);
      // set(deviceRef, { position, timestamp: Date.now(), deviceId: myDeviceId });
    } catch (error) {
      console.error("Error sending position:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const connectToRoom = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    simulateFirebaseConnection();
  };

  const disconnectFromRoom = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setConnected(false);
    setPeerPositions({});
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setError(null);
    setTracking(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setMyPosition(position);
        setPositionHistory((prev) => [
          ...prev.slice(-49),
          {
            timestamp: Date.now(),
            coords: position.coords,
          },
        ]);

        // Send to Firebase
        sendPositionToFirebase(position);
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        setTracking(false);
      },
      options
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  const updateFirebaseConfig = (field, value) => {
    setFirebaseConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveConfig = () => {
    const requiredFields = ["apiKey", "authDomain", "databaseURL", "projectId"];
    const missingFields = requiredFields.filter(
      (field) => !firebaseConfig[field]
    );

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    setConfigSet(true);
    setError(null);
    initializeFirebase();
  };

  const formatSpeed = (speed) => {
    return speed ? (speed * 3.6).toFixed(1) : "0.0";
  };

  const getDistanceToDevice = (deviceId) => {
    if (myPosition && peerPositions[deviceId]) {
      return calculateDistance(
        myPosition.coords.latitude,
        myPosition.coords.longitude,
        peerPositions[deviceId].position.coords.latitude,
        peerPositions[deviceId].position.coords.longitude
      );
    }
    return null;
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  if (!configSet) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Database className="text-blue-600" size={32} />
            Firebase Configuration
          </h1>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Setup Instructions:</strong>
              <br />
              1. Go to{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Firebase Console
              </a>
              <br />
              2. Create a new project
              <br />
              3. Go to Project Settings → General → Your apps
              <br />
              4. Add a web app and copy the config values below
              <br />
              5. Enable Realtime Database in the Firebase console
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={firebaseConfig.apiKey}
                onChange={(e) => updateFirebaseConfig("apiKey", e.target.value)}
                placeholder="AIzaSyC..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={firebaseConfig.authDomain}
                onChange={(e) =>
                  updateFirebaseConfig("authDomain", e.target.value)
                }
                placeholder="your-project.firebaseapp.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database URL
              </label>
              <input
                type="text"
                value={firebaseConfig.databaseURL}
                onChange={(e) =>
                  updateFirebaseConfig("databaseURL", e.target.value)
                }
                placeholder="https://your-project-default-rtdb.firebaseio.com/"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={firebaseConfig.projectId}
                onChange={(e) =>
                  updateFirebaseConfig("projectId", e.target.value)
                }
                placeholder="your-project-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                value={firebaseConfig.storageBucket}
                onChange={(e) =>
                  updateFirebaseConfig("storageBucket", e.target.value)
                }
                placeholder="your-project.appspot.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={firebaseConfig.messagingSenderId}
                onChange={(e) =>
                  updateFirebaseConfig("messagingSenderId", e.target.value)
                }
                placeholder="123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={firebaseConfig.appId}
                onChange={(e) => updateFirebaseConfig("appId", e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button
            onClick={saveConfig}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Configuration & Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Share2 className="text-blue-600" size={32} />
          Firebase Live Location Sharing
        </h1>

        {/* Connection Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Database size={20} />
            Room Connection
          </h3>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID (e.g., 'family-trip')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={connected}
            />
            <button
              onClick={connected ? disconnectFromRoom : connectToRoom}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                connected
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {connected ? "Disconnect" : "Connect"}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            {connected ? (
              <Database className="text-green-500" size={16} />
            ) : (
              <Database className="text-red-500" size={16} />
            )}
            <span className="text-sm font-medium">
              Firebase: {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Your Device ID:{" "}
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              {myDeviceId}
            </span>
          </p>
        </div>

        {/* GPS Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={tracking ? stopTracking : startTracking}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              tracking
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {tracking ? "Stop GPS" : "Start GPS"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Positions Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* My Position */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <MapPin size={20} />
              My Position
            </h3>
            {myPosition ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Latitude:</span>{" "}
                  {myPosition.coords.latitude.toFixed(6)}
                </p>
                <p>
                  <span className="font-medium">Longitude:</span>{" "}
                  {myPosition.coords.longitude.toFixed(6)}
                </p>
                <p>
                  <span className="font-medium">Accuracy:</span> ±
                  {myPosition.coords.accuracy.toFixed(1)}m
                </p>
                <p>
                  <span className="font-medium">Speed:</span>{" "}
                  {formatSpeed(myPosition.coords.speed)} km/h
                </p>
                <p>
                  <span className="font-medium">Last Update:</span>{" "}
                  {new Date(myPosition.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                Start GPS tracking to see your location
              </p>
            )}
          </div>

          {/* Peer Positions */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Users size={20} />
              Other Devices ({Object.keys(peerPositions).length})
            </h3>
            {Object.keys(peerPositions).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(peerPositions).map(([deviceId, data]) => (
                  <div key={deviceId} className="bg-white p-3 rounded border">
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Device:</span> {deviceId}
                      </p>
                      <p>
                        <span className="font-medium">Lat:</span>{" "}
                        {data.position.coords.latitude.toFixed(6)}
                      </p>
                      <p>
                        <span className="font-medium">Lng:</span>{" "}
                        {data.position.coords.longitude.toFixed(6)}
                      </p>
                      <p>
                        <span className="font-medium">Speed:</span>{" "}
                        {formatSpeed(data.position.coords.speed)} km/h
                      </p>
                      <p>
                        <span className="font-medium">Distance:</span>{" "}
                        {myPosition
                          ? `${(getDistanceToDevice(deviceId) / 1000).toFixed(
                              2
                            )} km`
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {connected
                  ? "No other devices in room"
                  : "Connect to a room to see other devices"}
              </p>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                tracking ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-600">
              GPS: {tracking ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? "bg-blue-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-600">
              Firebase: {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseLocationSharing;
