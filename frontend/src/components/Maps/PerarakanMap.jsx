import { Fragment, useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
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

const waypointIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.5);cursor:grab"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const midpointIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:9px;height:9px;border-radius:50%;border:2px solid white;opacity:0.45;cursor:pointer"></div>`,
  iconSize: [9, 9],
  iconAnchor: [4, 4],
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

function DrawEvents({ drawMode, isEditing, onAddWaypoint }) {
  useMapEvents({
    click(e) {
      if (drawMode && !isEditing) onAddWaypoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

DrawEvents.propTypes = {
  drawMode: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onAddWaypoint: PropTypes.func.isRequired,
};

function GeomanEditLayer({ waypoints, onUpdate }) {
  const map = useMap();

  useEffect(() => {
    // Buat polyline layer dan enable geoman edit
    const layer = L.polyline(waypoints, {
      color: '#2563eb',
      weight: 4,
      dashArray: '6 4',
    }).addTo(map);

    layer.pm.enable({
      allowSelfIntersection: false,
      draggable: true,
    });

    // Update coords setiap kali waypoint berubah
    const handleEdit = () => {
      const latlngs = layer.getLatLngs();
      const coords = latlngs.map((ll) => [ll.lat, ll.lng]);
      onUpdate(coords);
    };

    layer.on('pm:edit', handleEdit);
    layer.on('pm:vertexadded', handleEdit);
    layer.on('pm:vertexremoved', handleEdit);
    layer.on('pm:markerdragend', handleEdit);

    // Cleanup semasa unmount
    return () => {
      layer.pm.disable();
      map.removeLayer(layer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

GeomanEditLayer.propTypes = {
  waypoints: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default function PerarakanMap({ routes = [], drawMode = false, activeRoute = null, onRouteComplete, initialWaypoints = [] }) {
  const [waypoints, setWaypoints] = useState([]);

  const isEditing = drawMode && initialWaypoints.length > 0;
  const isDrawingNew = drawMode && !isEditing;

  const handleAddWaypoint = useCallback((point) => {
    setWaypoints((prev) => [...prev, point]);
  }, []);

  const handleDragWaypoint = useCallback((index, { lat, lng }) => {
    setWaypoints((prev) => prev.map((wp, i) => (i === index ? [lat, lng] : wp)));
  }, []);

  const handleDeleteWaypoint = useCallback((index) => {
    setWaypoints((prev) =>
      prev.length > 2 ? prev.filter((_, i) => i !== index) : prev
    );
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
        <DrawEvents drawMode={drawMode} isEditing={isEditing} onAddWaypoint={handleAddWaypoint} />

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

        {drawMode && isEditing && waypoints.length > 1 && (
          <GeomanEditLayer
            waypoints={waypoints}
            onUpdate={(coords) => setWaypoints(coords)}
          />
        )}

        {isDrawingNew && waypoints.length > 1 && (
          <Polyline
            positions={waypoints}
            pathOptions={{ color: '#2563eb', weight: 4, dashArray: '6 4' }}
          />
        )}

        {isDrawingNew && waypoints.length > 1 &&
          waypoints.slice(0, -1).map((wp, i) => {
            const mid = [(wp[0] + waypoints[i + 1][0]) / 2, (wp[1] + waypoints[i + 1][1]) / 2];
            return (
              <Marker
                key={`mid-${i}`}
                position={mid}
                icon={midpointIcon}
                eventHandlers={{
                  click() {
                    setWaypoints((prev) => [
                      ...prev.slice(0, i + 1),
                      mid,
                      ...prev.slice(i + 1),
                    ]);
                  },
                }}
              />
            );
          })
        }

        {isDrawingNew && waypoints.length > 0 && (
          <Marker
            position={waypoints[0]}
            icon={startIcon}
            draggable
            eventHandlers={{
              dragend: (e) => handleDragWaypoint(0, e.target.getLatLng()),
              click: (e) => L.DomEvent.stopPropagation(e.originalEvent),
            }}
          >
            <Popup>
              <span>Mula (drag untuk ubah)</span>
            </Popup>
          </Marker>
        )}

        {isDrawingNew &&
          waypoints.map((wp, i) => {
            if (i === 0 || i === waypoints.length - 1) return null;
            return (
              <Marker
                key={i}
                position={wp}
                icon={waypointIcon}
                draggable
                title="Drag untuk ubah posisi. Klik kanan untuk padam"
                eventHandlers={{
                  dragend: (e) => handleDragWaypoint(i, e.target.getLatLng()),
                  click: (e) => L.DomEvent.stopPropagation(e.originalEvent),
                  contextmenu: () => handleDeleteWaypoint(i),
                }}
              />
            );
          })}

        {isDrawingNew && waypoints.length > 1 && (
          <Marker
            position={waypoints[waypoints.length - 1]}
            icon={endIcon}
            draggable
            eventHandlers={{
              dragend: (e) =>
                handleDragWaypoint(waypoints.length - 1, e.target.getLatLng()),
              click: (e) => L.DomEvent.stopPropagation(e.originalEvent),
            }}
          >
            <Popup>
              <span>Akhir (drag untuk ubah)</span>
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