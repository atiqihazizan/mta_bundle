import { TileLayer } from 'react-leaflet';

const TILE_CONFIGS = {
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  google_street: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
  },
  google_satellite: {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Earth',
  },
  google_terrain: {
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Terrain',
  },
};

export default function TileLayerManager({ provider = 'google_street' }) {
  const config = TILE_CONFIGS[provider] || TILE_CONFIGS.google_street;

  return (
    <TileLayer
      key={provider}
      url={config.url}
      attribution={config.attribution}
      maxZoom={20}
    />
  );
}
