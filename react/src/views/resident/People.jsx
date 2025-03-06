import { PaperClipIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import Pulse from "../../components/Core/Pulse";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import Card from "../../components/Card";

function People() {
	const [people, setPeople] = useState({});
	const [educData, setEduc] = useState([]);
	const [healthData, setHealth] = useState([]);
	const [jobData, setJob] = useState([]);
	const [marriedData, setMarried] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const {id:kid} = useParams();
  const [flagNew, setFlagNew] = useState(false);
	const { showToast } = useStateContext();
	const navigate = useNavigate()

	const getPeople = () => {
		const url = `/peoples/${kid}`;
		axiosClient.get(url).then(({ data:{people,education,job,married,health} }) => {
			setLoading(false);
			setPeople(people)
			setEduc(() =>
				education.reduce((a, c) => {
					return [...a, { key: c.id, value: c.name }];
				}, [])
			);
			setJob(() =>
				job.reduce((a, c) => {
					return [...a, { key: c.id, value: c.name }];
				}, [])
			);
			setMarried(() =>
				married.reduce((a, c) => {
					return [...a, { key: c.id, value: c.name }];
				}, [])
			);
			setHealth(() =>
				health.reduce((a, c) => {
					return [...a, { key: c.id, value: c.name }];
				}, [])
			);

		});
	};
	useEffect(() => {
    if(kid) {
      getPeople()
    } else {
      setFlagNew(true)
      setLoading(false)
    }
  }, [kid]);

	const onSubmit = (ev)=>{
		const {id,...payload} = people;

		ev.preventDefault();
		setError(null);

		// let res = null;
		// if (flagNew) {
		// 	res = axiosClient.post("/peoples", payload);
		// } else {
		// 	res = axiosClient.put("/peoples/" + id, payload);
		// }

		payload.name = payload.name.toUpperCase();

		axiosClient
			.put("/peoples/" + id, payload)
			.then(({ data: result }) => {
				if (result.errors) throw result.errors;
				showToast(`Kemaskini maklumat ${result?.data?.name}`);
				navigate(-1);
			})
			.catch((err) => {
				setError(err);
				console.error(err);
			});
	}

	return (
		<PageComponent
			title="Kemaskini Maklumat"
			buttons={
				<div className="flex">
					<TButton color="light" to={-1}>
						Kembali
					</TButton>
				</div>
			}
		>
			<div className="py-6 sm:px-6 lg:px-8">
				{loading && <Pulse />}
				{!loading && (
					<div className="container">
						<Card>
							{/* <Card.Header title="Maklumat Ahli" /> */}
							<Card.Body>
								<form onSubmit={(ev) => onSubmit(ev)}>
									<FormC data={people} setValue={setPeople} error={error}>
										<div className="flex justify-between gap-7 mb-4">
											<div className="flex flex-col gap-5 w-full">
												<FormC.LText text={"Nama Penuh"} field={"name"} classes='uppercase' />
												<FormC.LText
													text={"Nama Panggilan"}
													field={"nickname"}
												/>
												<FormC.LNumber text={"No K/P"} field={"nokp"} />
												<FormC.LNumber
													text={"Telefon Bimbit"}
													field={"mobile"}
												/>
												<FormC.LSelect
													text={"Perkahwinan"}
													field={"married_id"}
													keyval="key,value"
													listArr={marriedData}
												/>
												<FormC.LSelect
													text={"Pekerjaan"}
													field={"job_id"}
													keyval="key,value"
													listArr={jobData}
												/>
												<FormC.LSelect
													text={"Pendidikan"}
													field={"edu_id"}
													keyval="key,value"
													listArr={educData}
												/>
												<FormC.LCheckbox
													text=""
													field={"stshealthy"}
													text2="Sakit Berpanjangan"
													val={1}
												/>
												{people?.stshealthy > 0 && (
													<FormC.LText
														text={"Penyakit yang dihidap"}
														field={"penyakit"}
													/>
												)}
												<FormC.LCheckbox
													text=""
													field={"stspencen"}
													text2="Persara pencen"
													val={1}
												/>
												{people?.stspencen > 0 && (
													<FormC.LText
														text={"Pesara sebagai"}
														field={"pencen"}
													/>
												)}
											</div>
										</div>
										<FormC.FSave />
									</FormC>
								</form>
							</Card.Body>
						</Card>
					</div>
				)}
			</div>
		</PageComponent>
	);
}

export default People;
