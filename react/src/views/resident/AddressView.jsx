import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Floppy, HouseAdd, PencilSquare, PersonAdd, PersonFillAdd, Xbox, XLg } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import axiosClient from "../../axios";

export default function AddressView({ address }) {
	const [dataAddr,setDataAddr] = useState(address)
	const [flagNew, setNew] = useState(address ? false : true)
	const [flagEdit, setEdit] = useState(false);
	const [areas, setAreas] = useState(false);
	const [cares, setCares] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate()
	const columns = [
		{ name: "label", class: "", field: "label", nClassRow: "py-2" },
		{
			name: "text",
			class: "",
			field: "text",
			nClassRow: "py-2 text-gray-700 text-sm",
		},
	];

	const option = {
		headable: false,
		checkable: false,
		nClassTable: "table align-middle text-sm text-gray-500",
	};

	const addrNew = () =>{
		setNew(true)
		setEdit(false)
		setDataAddr(null);
		navigate('/address/new')
	}

	const addrSave = (ev)=>{
		ev.preventDefault();
		setError(null);

		if(dataAddr == undefined) return alert('Sila lengkapkan maklumat rumah');

		let res = null;
		if (flagNew) {
			res = axiosClient.post("/address", dataAddr);
		} else {
			const {addr,addr2,addr3,poskod,area_id,cares_id,id:aid} = dataAddr
			const payload = {addr,addr2,addr3,poskod,area_id,cares_id}
			res = axiosClient.put(`/address/${aid}`, payload);
		}
		res
			.then(({ data: result }) => {
				if (result.errors) throw result.errors;
				const newData = result.data;
				setDataAddr(newData);
				setEdit(false);
				setNew(false);
				if (flagNew) navigate(`/address/${newData.id}`);
			})
			.catch((err) => {
				setError(err);
				console.error(err);
			});
	}

	useEffect(()=>{
		if(areas == false || cares == false) axiosClient.get('/options').then(({data}) => {
			setAreas(data.areas)
			setCares(data.cares)
		});
	},[])
	return (
		<Card>
			<Card.Header title="Alamat Rumah">
				{!flagEdit && !flagNew && (
					<div className="flex gap-2">
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							onClick={addrNew}
						>
							<PersonAdd className="w-5 h-5" />
						</TButton>
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							onClick={addrNew}
						>
							<HouseAdd className="w-5 h-5" />
						</TButton>
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							onClick={() => setEdit(true)}
						>
							<PencilSquare className="w-5 h-5" />
						</TButton>
					</div>
				)}
				{(flagEdit || flagNew) && (
					<div className="flex gap-1">
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							onClick={addrSave}
						>
							<Floppy className="w-5 h-5" />
						</TButton>
						{!flagNew && (
							<TButton
								nClasses="btn btn-sm btn-danger btn-icon btn-clear"
								onClick={() => setEdit(false)}
							>
								<XMarkIcon className="w-5 h-5" />
							</TButton>
						)}
					</div>
				)}
			</Card.Header>
			{!flagEdit && !flagNew && (
				<Card.Table
					columns={columns}
					data={[
						{ label: "No Rumah", text: dataAddr?.addr, class: false },
						{ label: "Jalan", text: dataAddr?.addr2, class: false },
						{ label: "Lorong", text: dataAddr?.addr3, class: false },
						{ label: "Poskod", text: dataAddr?.poskod, class: false },
						{
							label: "Masjid/Surau",
							text: dataAddr?.kawasan?.toUpperCase(),
							class: false,
						},
            {
              label: "Koordinat",
              text: `${dataAddr?.latlng || "-"}`,
              class: false,
            }
					]}
					oOption={option}
				/>
			)}
			{(flagEdit || flagNew) && (
				<Card.Body>
					<form>
						<FormC data={dataAddr} setValue={setDataAddr} error={error}>
							<div className="flex flex-col gap-5 w-full">
								<FormC.LText text={"No Rumah"} field={"addr"} />
								<FormC.LText text={"Jalan"} field={"addr2"} />
								<FormC.LText text={"Lorong"} field={"addr3"} />
								<FormC.LText text={"Poskod"} field={"poskod"} />
								<FormC.LSelect
									text={"Kawasan"}
									field="area_id"
									keyval="id,aname"
									listArr={areas || []}
								/>
								<FormC.LSelect
									text={"Pernah terima bantuan"}
									field="cares_id"
									keyval="id,name"
									listArr={cares || []}
								/>
								<FormC.LText text={"Koordinat"} field={"latlng"} />
							</div>
						</FormC>
					</form>
				</Card.Body>
			)}
		</Card>
	);
}
