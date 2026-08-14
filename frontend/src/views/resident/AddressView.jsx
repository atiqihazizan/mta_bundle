import {  XMarkIcon } from "@heroicons/react/24/outline";
import { Floppy,  PencilSquare } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import axiosClient from "../../axios";

export default function AddressView({ address, view, setView }) {
  const [flagView , setFlagView] = useState(view)
	const [dataAddr,setDataAddr] = useState(address)
	const [flagNew, setNew] = useState(address?.id ? false : true)
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

	const addrSave = (ev)=>{
		ev.preventDefault();
		setError(null);

		if(dataAddr == undefined) return alert('Sila lengkapkan maklumat rumah');
    if(dataAddr?.addr == undefined) return alert('No rumah diperlukan');
    if(dataAddr?.addr2 == undefined) return alert('Jalan diperlukan');
    if(dataAddr?.addr3 == undefined) return alert('Lorong diperlukan');
    if(dataAddr?.poskod == undefined) return alert('Poskod diperlukan');
    if(dataAddr?.area_id == undefined) return alert('Kawasan diperlukan');
    if(dataAddr?.cares_id == undefined) return alert('Maklumat terima  bantuan diperlukan');
    if(dataAddr?.latlng == undefined) return alert('Maklumat koordinat diperlukan');

		let res = null;
		if (flagNew) {
			res = axiosClient.post("/address", dataAddr);
		} else {
			const {addr,addr2,addr3,poskod,area_id,cares_id,latlng,id:aid} = dataAddr
			const payload = {addr,addr2,addr3,poskod,area_id,cares_id,latlng}
			res = axiosClient.put(`/address/${aid}`, payload);
		}
		res
			.then(({ data: result }) => {
				if (result.errors) throw result.errors;
				const newData = result.data;
        console.log(newData)
				setDataAddr(newData);
        setView(true)
        setFlagView(true);
        setNew(false)
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
  useEffect(()=>{ 
      setDataAddr(address)
      setFlagView(view)
  },[address,view])
	return (
    <Card>
      <Card.Header title="Alamat Rumah">
        {flagView && (
          <div className="flex gap-2">
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={() => {
                setFlagView(false)
                setView(false)
              }}
            >
              <PencilSquare className="w-5 h-5" />
            </TButton>
          </div>
        )}
        {(!flagView) && (
          <div className="flex gap-1">
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={addrSave}
            >
              <Floppy className="w-5 h-5" />
            </TButton>
            {dataAddr.id && (
              <TButton
                nClasses="btn btn-sm btn-danger btn-icon btn-clear"
                onClick={() => {
                  setFlagView(true)
                  setView(true)
                }}
              >
                <XMarkIcon className="w-5 h-5" />
              </TButton>
            )}
          </div>
        )}
      </Card.Header>
      {flagView && (
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
              text: `${dataAddr?.latlng?.split(',')?.map((o) => parseFloat(o).toFixed(6))?.join(', ') || "-"}`,
              class: false,
            },
          ]}
          oOption={option}
        />
      )}
      {(!flagView) && (
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
