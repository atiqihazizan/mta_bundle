import { PaperClipIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import Pulse from "../components/Core/Pulse";
import AddressView from "./resident/AddressView";
import Peoples from "./resident/PeoplesView";
import TButton from "../components/Core/TButton";
import MapView from "../components/Maps/MapView";

function Resident() {
	const {id} = useParams();
	const [peoples, setPeoples] = useState([]);
	const [address, setAddress] = useState({
    cares_id:1,
    area_id:1,
  });
	const [loading, setLoading] = useState(id ? true : false);
  const [flagView, setFlagView] = useState(true);
  const [markerPosition, setMarkerPosition] = useState({
    lat: Number(import.meta.env.VITE_MAP_CENTER_LAT),
    lng: Number(import.meta.env.VITE_MAP_CENTER_LNG)
  });
  const center = {
    lat: Number(import.meta.env.VITE_MAP_CENTER_LAT),
    lng: Number(import.meta.env.VITE_MAP_CENTER_LNG)
  };
  const zoom = Number(import.meta.env.VITE_MAP_ZOOM);
  
  // Fungsi untuk mengemaskini koordinat
  const updateCoordinates = (newAddress) => {
    setAddress(newAddress);
    if (newAddress?.latlng) {
      const [lat, lng] = newAddress.latlng.split(',').map(Number);
      setMarkerPosition({ lat, lng });
    }
  };

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPosition({ lat, lng });
    
    // Update address dengan koordinat baru
    if (address) {
      const updatedAddress = {
        ...address,
        latlng: `${lat},${lng}`
      };
      setAddress(updatedAddress);
      
      // Hantar update ke server
      // axiosClient.put(`/address/${address.id}`, {
      //   latlng: `${lat},${lng}`
      // }).then(({data}) => {
      //   console.log('Koordinat telah dikemaskini:', data);
      // }).catch(err => {
      //   console.error('Ralat ketika mengemaskini koordinat:', err);
      // });
    }
  };

	const getResidency = () => {
		const url = `/kariah/${id}`;
		axiosClient.get(url).then(({ data:{data:{address:addr,people}} }) => {
			setLoading(false);
			setAddress(addr);
      // Set marker position dari data yang ada
      if (addr?.latlng) {
        const [lat, lng] = addr.latlng.split(',').map(Number);
        setMarkerPosition({ lat, lng });
      }
			setPeoples(people);
		});
	};
	useEffect(() => {
    if(id) {
      getResidency();
      setFlagView(true);
    } else {
      setFlagView(false);
      setAddress({
        poskod:'14000',
        cares_id:1,
        latlng: `${markerPosition.lat},${markerPosition.lng}`
      })
    }
  }, [id]);

	return (
		<PageComponent title="Maklumat Rumah dan Penghuni" buttons={
			<div className="flex">
				<TButton color="light" to={'/address/'}>
					Kembali
				</TButton>
			</div>
		}>
			<div className="py-6 sm:px-6 lg:px-8">
				{loading && <Pulse />}
				{!loading && (
					<div className="flex flex-col gap-6">
						<div className="grid grid-cols-3 gap-6">
							<AddressView address={address} view={flagView} setView={setFlagView} />
              <div className="col-span-2">
                <MapView
                  markers={[{
                    position: markerPosition,
                    draggable: !flagView,
                    popup: (marker) => (
                      <>
                        {address?.address1}<br/>
                        {address?.address2}<br/>
                        {address?.address3}<br/>
                        <strong>Lat: {marker.position.lat}</strong><br/>
                        <strong>Lng: {marker.position.lng}</strong>
                      </>
                    )
                  }]}
                  onMarkerDrag={(e) => handleMarkerDrag(e)}
                  showCenterMarker={false}
                />
              </div>
						</div>
						{address?.id && <Peoples
							addr_id={id}
							updated={setPeoples}
							title="Isi Rumah"
							data={peoples}
							cols="name,nokp,mobile,edustatus,sibling,employee,stshealthy"
						/>}
					</div>
				)}
			</div>
		</PageComponent>
	);
}

export default Resident;
