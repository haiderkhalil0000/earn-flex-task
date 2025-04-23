import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapComponent = ({ locations }) => {
  const position = [51.505, -0.09]; 
  const mapRef = useRef(null);
  const icon = createIcon();

  const getBounds = () => {
    if (locations && locations.length > 0) {
      return L.latLngBounds(locations.map(loc => loc.position));
    }
    return null;
  };

  useEffect(() => {
    if (mapRef.current && locations && locations.length > 0) {
      const bounds = getBounds();
      if (bounds) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [locations]);

  return (
    <div style={{ height: "100%", width: "100%", padding: "20px" }}>
      <div style={{ 
        height: "100%", 
        width: "100%", 
        backgroundColor: "#fff",
        boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <MapContainer
          center={position}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => {
            mapRef.current = map;
            const bounds = getBounds();
            if (bounds) {
              map.fitBounds(bounds);
            }
          }}
        >
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          {locations && locations.map((location) => (
            <Marker 
              key={location.id} 
              position={location.position}
              icon={icon}
            >
              <Popup>
                <div>
                  <h4>{location.name || "Employee"}</h4>
                  <p>{location.label || location.city}</p>
                  {location.email && <p>{location.email}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;