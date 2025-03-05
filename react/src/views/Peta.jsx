import React, { useCallback, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageComponent from '../components/PageComponent';
import axiosClient from '../axios';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 250px)', // Minimum height
  borderRadius: '0.5rem'
};

// Koordinat Masjid Tuan Abdullah Tanah Liat, Bukit Mertajam
const center = {
  lat: 5.388705352614487,  // Latitude
  lng: 100.46439001031244 // Longitude
};

export default function Peta() {
  const [markers, setMarkers] = useState([]);

  // Fetch markers from API
  const fetchMarkers = useCallback(async () => {
    try {
      const response = await axiosClient.get('/address');
      const addresses = response.data.data || [];
      
      // Transform addresses to markers
      const newMarkers = addresses.map(addr => ({
        id: addr.id,
        position: {
          lat: parseFloat(addr.latitude || center.lat),
          lng: parseFloat(addr.longitude || center.lng)
        },
        title: addr.name || 'Tidak diketahui',
        address: addr.address || 'Alamat tidak diketahui',
        zone: addr.zone || 'Zone tidak diketahui'
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return (
    <PageComponent title="Peta Kariah">
      <div className="h-[calc(100vh-100px)] overflow-hidden p-4">
        <Card className="h-full">
          <CardHeader variant="gradient" color="blue" className="p-6">
            <div className="flex justify-between items-center">
              <Typography variant="h6" color="white">
                Peta Kawasan Kariah
              </Typography>
              <Button
                color="white"
                size="sm"
                onClick={fetchMarkers}
                className="flex items-center gap-2"
              >
                Refresh Peta
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-6 h-[calc(100%-88px)]">
            <div className="w-full h-full">
              <MapContainer 
                center={[center.lat, center.lng]} 
                zoom={14} 
                style={mapContainerStyle}
              >
                <TileLayer
                  url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAksuOzVFXO7VubvpbpZK7WqKvy0ku8Zbo"
                  attribution='&copy; Google Maps'
                />
                {markers.map(marker => (
                  <Marker
                    key={marker.id}
                    position={[marker.position.lat, marker.position.lng]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{marker.title}</h3>
                        <p className="text-gray-600 mt-1">{marker.address}</p>
                        <p className="text-blue-600 text-sm mt-1">{marker.zone}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageComponent>
  );
}
