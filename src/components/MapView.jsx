import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix leaflet icon path bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to move the map when your location changes
function RecenterOnLocation({ latlng }) {
  const map = useMap();
  useEffect(() => {
    if (latlng) {
      map.setView(latlng, map.getZoom());
    }
  }, [latlng, map]);
  return null;
}

export default function MapView({ myLocation, peerLocation }) {
  const center = myLocation || { lat: 40.7128, lng: -74.006 }; // fallback to NYC

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", width: "100%", marginTop: "1rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterOnLocation latlng={myLocation} />

      {myLocation && (
        <Marker position={myLocation}>
          <Popup>🚩 You</Popup>
        </Marker>
      )}

      {peerLocation && (
        <Marker position={peerLocation}>
          <Popup>👀 Peer</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
