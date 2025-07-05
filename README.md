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
