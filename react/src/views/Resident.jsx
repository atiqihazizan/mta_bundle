import { PaperClipIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import Pulse from "../components/Core/Pulse";
import AddressView from "./resident/AddressView";
import Peoples from "./resident/PeoplesView";
import TButton from "../components/Core/TButton";

function Resident() {
	const {id} = useParams();
	const [peoples, setPeoples] = useState([]);
	const [address, setAddress] = useState();
	const [loading, setLoading] = useState(id ? true : false);

	const getResidency = () => {
		const url = `/kariah/${id}`;
		axiosClient.get(url).then(({ data:{data:{address:addr,people}} }) => {
			setLoading(false);
			setAddress(addr)
			setPeoples(people);
		});
	};
	useEffect(() => id && getResidency(), []);

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
							<AddressView address={address} />
							<div className="col-span-2 flex flex-col gap-6">
								<Peoples
									updated={setPeoples}
									title="Ketua Rumah dan Pasangan"
									data={peoples.filter(({ status }) => [1, 2].includes(status))}
									cols="name,nokp,mobile,sibling"
								/>
								<Peoples
									updated={setPeoples}
									title="Penama Kedua"
									data={peoples.filter(({ penama }) => penama == 1)}
									cols="name,mobile,sibling"
								/>
								<Peoples
									updated={setPeoples}
									title="Penyakit Kekal"
									data={peoples.filter(({ stshealthy }) => stshealthy == 1)}
									cols="name,penyakit,sibling"
								/>
							</div>
						</div>
						<Peoples
							updated={setPeoples}
							title="Tanggungan"
							data={peoples.filter(({ tanggungan }) => tanggungan == 1)}
							cols="name,nokp,mobile,edustatus,sibling,employee"
						/>
					</div>
				)}
			</div>
		</PageComponent>
	);
}

export default Resident;
