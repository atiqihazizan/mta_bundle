import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PropTypes from 'prop-types';

// Fix untuk ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapView({
  center = {
    lat: Number(import.meta.env.VITE_MAP_CENTER_LAT),
    lng: Number(import.meta.env.VITE_MAP_CENTER_LNG)
  },
  zoom = Number(import.meta.env.VITE_MAP_ZOOM),
  height = '500px',
  width = '100%',
  markers = [],
  onMarkerDrag,
  showCenterMarker = true,
  showLayerControl = true,
  attributionControl = false,
  className = ''
}) {
  // Jika tiada markers dan showCenterMarker true, tambah marker di tengah
  const displayMarkers = markers.length > 0 
    ? markers 
    : (showCenterMarker ? [{
        position: { lat: center.lat, lng: center.lng },
        draggable: false,
        popup: 'Titik Tengah'
      }] : []);

  return (
    <div className={`maps rounded-xl shadow-lg overflow-hidden ${className}`} style={{ height, width }}>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={attributionControl}
      >
        {showLayerControl && (
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street">
              <TileLayer
                attribution={import.meta.env.VITE_MAP_ATTRIBUTION}
                url={import.meta.env.VITE_MAP_TILE_URL_MAP}
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution={false}
                url={import.meta.env.VITE_MAP_TILE_URL}
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        )}

        {!showLayerControl && (
          <TileLayer
            attribution={attributionControl ? import.meta.env.VITE_MAP_ATTRIBUTION : false}
            url={import.meta.env.VITE_MAP_TILE_URL_MAP}
            maxZoom={20}
          />
        )}

        {displayMarkers.map((marker, index) => (
          <Marker 
            key={index}
            position={[marker.position.lat, marker.position.lng]}
            draggable={marker.draggable}
            eventHandlers={onMarkerDrag ? {
              dragend: (e) => onMarkerDrag(e, index),
            } : {}}
          >
            {marker.popup && (
              <Popup>
                {typeof marker.popup === 'function' 
                  ? marker.popup(marker)
                  : marker.popup}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

MapView.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  zoom: PropTypes.number,
  height: PropTypes.string,
  width: PropTypes.string,
  markers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }).isRequired,
    draggable: PropTypes.bool,
    popup: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.string
    ])
  })),
  onMarkerDrag: PropTypes.func,
  showCenterMarker: PropTypes.bool,
  showLayerControl: PropTypes.bool,
  attributionControl: PropTypes.bool,
  className: PropTypes.string
};

export default MapView;
