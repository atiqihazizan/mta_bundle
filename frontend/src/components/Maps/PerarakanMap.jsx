import { Fragment, useCallback, useEffect, useState } from 'react';
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

const startIcon = L.divIcon({
  className: '',
  html: `<div style="background:#16a34a;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.4)">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: '',
  html: `<div style="background:#dc2626;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.4)">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

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

export default function PerarakanMap({ routes = [], drawMode = false, activeRoute = null, onRouteComplete, initialWaypoints = [] }) {
  const [waypoints, setWaypoints] = useState([]);

  const handleAddWaypoint = useCallback((point) => {
    setWaypoints((prev) => [...prev, point]);
  }, []);

  useEffect(() => {
    if (drawMode) {
      setWaypoints(initialWaypoints.length > 0 ? initialWaypoints : []);
    } else {
      setWaypoints([]);
    }
  }, [drawMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (onRouteComplete && waypoints.length > 0) {
      onRouteComplete(waypoints, calculateDistance(waypoints));
    }
  }, [waypoints, onRouteComplete]);

  const displayRoute = activeRoute ?? routes[0] ?? null;
  const displayIndex = routes.findIndex((r) => r.id === displayRoute?.id);
  const displayColor = displayIndex >= 0 ? COLORS[displayIndex % COLORS.length] : COLORS[0];

  return (
    <>
      <MapContainer center={CENTER} zoom={15} style={mapContainerStyle}>
        <TileLayer url={TILE_URL} attribution="&copy; Google Maps" />
        <DrawEvents drawMode={drawMode} onAddWaypoint={handleAddWaypoint} />

        {routes.map((route, index) => (
          <Fragment key={route.id}>
            <Polyline
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

            {route.coords?.length >= 2 && (
              <>
                <Marker position={route.coords[0]} icon={startIcon}>
                  <Popup>
                    <span>Mula: {route.name}</span>
                  </Popup>
                </Marker>
                <Marker position={route.coords[route.coords.length - 1]} icon={endIcon}>
                  <Popup>
                    <span>
                      Akhir: {route.name}
                      <br />
                      Jarak: {route.distance_km ?? '0.00'} km
                    </span>
                  </Popup>
                </Marker>
              </>
            )}
          </Fragment>
        ))}

        {drawMode && waypoints.length > 0 && (
          <Polyline
            positions={waypoints}
            pathOptions={{ color: '#2563eb', weight: 4, dashArray: '6 4' }}
          />
        )}

        {drawMode && waypoints.length > 0 && (
          <Marker position={waypoints[0]} icon={startIcon}>
            <Popup>
              <span>Mula</span>
            </Popup>
          </Marker>
        )}

        {drawMode && waypoints.length > 1 && (
          <Marker position={waypoints[waypoints.length - 1]} icon={endIcon}>
            <Popup>
              <span>Akhir</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {displayRoute && !drawMode && (
        <div className="absolute bottom-4 right-4 z-[1000] min-w-[200px] rounded-lg bg-white p-3 text-sm shadow-xl">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: displayColor }}
            />
            <span className="font-semibold text-gray-900">{displayRoute.name}</span>
          </div>
          <div className="mt-1 text-gray-600">Jarak: {displayRoute.distance_km ?? '0.00'} km</div>
          <div className="text-gray-600">Waypoint: {displayRoute.coords?.length ?? 0} titik</div>
        </div>
      )}
    </>
  );
}

PerarakanMap.propTypes = {
  routes: PropTypes.array,
  drawMode: PropTypes.bool,
  activeRoute: PropTypes.object,
  onRouteComplete: PropTypes.func,
  initialWaypoints: PropTypes.array,
};