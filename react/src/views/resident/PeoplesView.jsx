import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import Card from "../../components/Card";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import axiosClient from "../../axios";

export default function PeopleView({ title, data, cols, updated }) {
	const [columns, setColumns] = useState();
	const [person, setPerson] = useState(false);
	const [diri, setDiri] = useState(false);
	const [brotherhood, setRelation] = useState(false);
	const [error, setError] = useState(null);
	const { showToast } = useStateContext();
	const _cols = [
		{
			name: "Nama",
			field: "name",
			nClass: "text-left",
			nClassRow: "text-left",
		},
		{
			name: "No. K/P",
			field: "nokp",
			nClass: "w-[100px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
		{
			name: "No. Tel",
			field: "mobile",
			nClass: "w-[100px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
		{
			name: "Pelajaran",
			field: "edustatus",
			nClass: "w-[170px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
		{
			name: "Hubungan",
			field: "sibling",
			nClass: "w-[110px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
		{
			name: "Pekerjaan",
			field: "employee",
			nClass: "w-[170px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
		{
			name: "Penyakit",
			field: "penyakit",
			nClass: "w-[250px] text-left",
			nClassRow: "text-left text-sm font-normal text-gray-700",
		},
	];

	const option = {
		headable: false,
		checkable: false,
		nClassTable: "table-auto",
	};

	const onEdit = (ev, id) => {
		ev.preventDefault();
		const _pre = data.filter((d) => d.id == id)[0];
		axiosClient
			.get("/kariah/people/" + id)
			.then(({ data: { relation, status, self } }) => {
				setRelation(relation);
				setDiri(status);
				setPerson({ ...self, name: _pre.name });
			});
	};
	const onSave = (ev) => {
		const {name,id, ...payload} = person
		const _pre = data.filter((d) => d.id == id)[0];
		ev.preventDefault();
		setError(null);
		axiosClient
			.put("/kariah/" + id, payload)
			.then(({ data: result }) => {
				if (result.errors) throw result.errors;
				showToast(`Kemaskini maklumat ${name}`);
				updated(result?.data);
				setPerson(false);
			})
			.catch((err) => {
				setError(err);
				console.error(err);
			});
	};
	useEffect(() => {
		const ar = cols.split(",");
		const aCol = _cols.filter((f) => ar.includes(f.field)).map((c) => c);
		const myCols = [
			...aCol,
			{
				name: "",
				class: "w-[50px]",
				nClassRow: "px-3",
				render: ({ id: kid, ppl_id: id }) => (
					<div className="flex gap-0.5">
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							to={`/people/${id}`}
						>
							<i className="ki-outline ki-user-edit">
								<span className="path1"></span>
								<span className="path2"></span>
								<span className="path3"></span>
							</i>
						</TButton>
						<TButton
							nClasses="btn btn-sm btn-icon btn-clear btn-primary"
							onClick={(ev) => onEdit(ev, kid)}
						>
							<i className="ki-outline ki-setting-2"></i>
						</TButton>
					</div>
				),
			},
		];
		setColumns(myCols);
	}, []);

	return (
		<Card>
			<Card.Header title={title}>
				{person && (
					<div>
						<TButton nClasses="btn btn-sm btn-primary" onClick={onSave}>
							Simpan
						</TButton>
						&nbsp; &nbsp;
						<TButton
							nClasses="btn btn-sm btn-light"
							onClick={() => setPerson(false)}
						>
							Kembali
						</TButton>
					</div>
				)}
			</Card.Header>
			{!person && (
				<Card.Table
					columns={columns}
					data={data}
					oOption={{ checkable: false }}
				/>
			)}
			{person && (
				<Card.Body>
					<form>
						<FormC data={person} setValue={setPerson} error={error}>
							<div className="flex flex-col gap-5 w-full">
								<FormC.LRead text={"Nama"} field={"name"} />
								<FormC.LSelect
									text={"Status Diri"}
									field="status"
									keyval="id,name"
									listArr={diri}
								/>
								<FormC.LSelect
									text={"Hubungan"}
									field="relation"
									keyval="id,name"
									listArr={brotherhood}
								/>
								<FormC.LCheckbox
									text2={"Tanggungan"}
									field={"tanggungan"}
									val={1}
								/>
								<FormC.LCheckbox
									text2={"Penama"}
									field={"penama"}
									val={1}
								/>
							</div>
						</FormC>
					</form>
				</Card.Body>
			)}
		</Card>
	);
}
