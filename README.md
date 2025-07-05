# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🗺️ Live Location Sharing App

A real-time location-sharing app built with **React**, **Firebase**, and **Leaflet**, allowing users to share and track live movement on a map. Each user is assigned a name (custom or auto-generated) and can view others’ locations in real time.

---

## 🚀 Features

- 📍 **Live Location Tracking** using `navigator.geolocation.watchPosition`
- 🧑‍🤝‍🧑 **User-Specific Markers** on map with visible names
- 🗂️ **List of Active Users** displayed alongside the map
- 🔄 **Automatic Sync** using Firebase Firestore
- 🌐 **Realtime Updates** as users move
- 🧭 **Map Recenters** automatically to your current location

---

## 🧱 Tech Stack

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Frontend | React 18 + Vite                           |
| Mapping  | Leaflet + react-leaflet                   |
| Backend  | Firebase Firestore                        |
| Styling  | Tailwind CSS (optional)                   |
| Hosting  | Firebase Hosting                          |
| Auth     | (Optional / not included in base version) |

---

## 🧩 Component Overview

### 1. **MapView**

- Renders a Leaflet map
- Displays markers for your location and others'
- Shows name above each marker with permanent `Tooltip`
- Automatically recenters on location updates

### 2. **ActiveUsersList**

- Displays a sidebar list of all users currently sharing location
- Uses green indicators (🟢) to show active users
- Receives and renders data from Firebase in real-time

### 3. **LocationSharer**

- Main app logic
- Handles:
  - Name input
  - Toggling live sharing
  - Storing user name in localStorage
  - Uploading location to Firestore
  - Listening for other users’ updates

### 4. **Firebase Firestore**

- Stores each user’s live location as a document
- Subscribed via `onSnapshot()` for real-time updates

---

## 🧪 How to Test Movement (Desktop Simulation)

1. Open the app in Chrome.
2. Open **DevTools** → press `Ctrl+Shift+P` → type `Sensors` → open **Sensors panel**.
3. Set **Geolocation → Custom location**.
4. Change lat/lng values every few seconds to simulate movement.
5. Watch your marker move in real time on the map!

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/live-location-app.git
cd live-location-app
```

Absolutely! Here's a **detailed step-by-step procedure** for setting up a Firebase project from scratch, configuring Firestore, getting Firebase config, deploying, and hosting your live tracking module. This guide is tailored for your **React + Firebase** live location sharing app.

---

## 🚀 Firebase Setup & Deployment Guide

---

### ✅ 1. **Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add Project"**.
3. Enter your **Project Name** (e.g., `LiveTrackingApp`).
4. Click **Continue**, disable Google Analytics (optional), and click **Create Project**.
5. Wait a few seconds and then click **Continue to Console**.

---

### 🔥 2. **Register Your App in Firebase (React Web App)**

1. In the Firebase project dashboard, click the **Web icon (\</>)** to register a new web app.
2. Set an **App nickname** (e.g., `live-tracking-client`).
3. Click **Register App**.
4. You'll now see your **Firebase config object**. It looks like this:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "1:XXXXXXX:web:XXXXXX",
};
```

✅ **Copy this**, you’ll need it in your React project (usually in `firebase.js` or `firebase.ts`).

---

### 📦 3. **Install Firebase in Your React App**

In your project root, install the Firebase SDK:

```bash
npm install firebase
```

---

### 🛠 4. **Initialize Firestore in React App**

Create a file like `src/firebase.js` or `src/firebase.ts`:

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "1:XXXXXXX:web:XXXXXX",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

---

### 🧱 5. **Enable Firestore in Firebase Console**

1. In the Firebase console, go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose **Start in test mode** (for development).
4. Select a region (e.g., `asia-south1` for India).
5. Click **Enable**.

---

### 🧑‍💻 6. **Use Firestore in Your Live Location App**

You’re already using `setDoc`, `onSnapshot`, etc., in components like `LocationSharer`, right? That’s good. Just make sure you’re importing `db` from your `firebase.js`.

```js
import { db } from "../firebase";
```

---

### 🌐 7. **Set Up Firebase Hosting**

#### a. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

#### b. **Login to Firebase**

```bash
firebase login
```

#### c. **Initialize Firebase Hosting**

From the root of your React app:

```bash
firebase init
```

✅ **Select**:

- **Hosting**
- **Firestore** (if you want to use emulator, optional)

Then follow prompts:

- **Use existing project** (select your Firebase project)
- **Public directory** → type: `dist` (if using Vite) or `build` (for CRA)
- **Single-page app?** → `Yes`
- **Overwrite index.html?** → `No`

---

### ⚒️ 8. **Build Your App**

For Vite:

```bash
npm run build
```

For Create React App:

```bash
npm run build
```

---

### 🚀 9. **Deploy to Firebase**

```bash
firebase deploy
```

You’ll get a public URL like:

```
Hosting URL: https://your-app-id.web.app
```

---

### 🛑 Optional: Disable or Pause Hosting

If you want to pause or disable Firebase Hosting:

```bash
firebase hosting:disable
```

To enable again:

```bash
firebase deploy --only hosting
```

---

## ✅ Summary

| Step | Description                   |
| ---- | ----------------------------- |
| 1.   | Create project in Firebase    |
| 2.   | Register Web App & Get config |
| 3.   | Install Firebase in React app |
| 4.   | Initialize Firestore          |
| 5.   | Enable Firestore in console   |
| 6.   | Use Firestore in components   |
| 7.   | Set up Hosting via CLI        |
| 8.   | Build React app               |
| 9.   | Deploy to Firebase            |

---
