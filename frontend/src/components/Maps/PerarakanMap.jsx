import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

const CENTER = [5.388783338110887, 100.46425691764681];
const TILE_URL =
  'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAksuOzVFXO7VubvpbpZK7WqKvy0ku8Zbo';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const calculateDistance = (coords) => {
  if (!coords || coords.length < 2) return 0;
  const R = 6371000;
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const [lat1, lng1] = coords[i];
    const [lat2, lng2] = coords[i + 1];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return total;
};

function DrawEvents({ drawMode, onAddWaypoint }) {
  useMapEvents({
    click(e) {
      if (drawMode) onAddWaypoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

DrawEvents.propTypes = {
  drawMode: PropTypes.bool.isRequired,
  onAddWaypoint: PropTypes.func.isRequired,
};

export default function PerarakanMap({ routes = [], drawMode = false, activeRoute = null, onRouteComplete }) {
  const [waypoints, setWaypoints] = useState([]);

  const handleAddWaypoint = useCallback((point) => {
    setWaypoints((prev) => [...prev, point]);
  }, []);

  useEffect(() => {
    if (!drawMode) setWaypoints([]);
  }, [drawMode]);

  useEffect(() => {
    if (onRouteComplete && waypoints.length > 0) {
      onRouteComplete(waypoints, calculateDistance(waypoints));
    }
  }, [waypoints, onRouteComplete]);

  return (
    <MapContainer center={CENTER} zoom={15} style={mapContainerStyle}>
      <TileLayer url={TILE_URL} attribution="&copy; Google Maps" />
      <DrawEvents drawMode={drawMode} onAddWaypoint={handleAddWaypoint} />

      {routes.map((route, index) => (
        <Polyline
          key={route.id}
          positions={route.coords}
          pathOptions={{
            color: COLORS[index % COLORS.length],
            weight: 4,
            opacity: activeRoute?.id === route.id ? 1 : 0.6,
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold">{route.name}</h3>
              <p className="text-gray-600 text-sm mt-1">Jarak: {route.distance_km ?? '0.00'} km</p>
            </div>
          </Popup>
        </Polyline>
      ))}

      {drawMode && waypoints.length > 0 && (
        <Polyline
          positions={waypoints}
          pathOptions={{ color: '#2563eb', weight: 4, dashArray: '6 4' }}
        />
      )}

      {drawMode &&
        waypoints.map((wp, i) => (
          <Marker key={`${wp[0]}-${wp[1]}-${i}`} position={wp}>
            <Popup>
              <span>
                Titik {i + 1}: {wp[0].toFixed(6)}, {wp[1].toFixed(6)}
              </span>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

PerarakanMap.propTypes = {
  routes: PropTypes.array,
  drawMode: PropTypes.bool,
  activeRoute: PropTypes.object,
  onRouteComplete: PropTypes.func,
};