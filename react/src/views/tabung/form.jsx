import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useTabungContext } from "../../contexts/TabungProvider";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "@heroicons/react/24/outline";
import PageTabung from "../../components/PageTabung";
import axiosClient from "../../axios";
import Pulse from "../../components/Core/Pulse";
import Card from "../../components/Card";
import FormC from "../../components/FormContext";
import TButton from "../../components/Core/TButton";
import TabungPrint from "./print";

export default function TabungForm() {
	const contPrint = useRef(null);
	const navigate = useNavigate();
	const { showToast } = useStateContext();
	const { userCount, tabungType, itemBernilai, typeMoney, setTypeMoney } =
		useTabungContext();
	const { tid } = useParams();
	const [searchParams] = useSearchParams();
	const [pageBack] = useState(() => searchParams.get("page") ? `/tabung?page=${searchParams.get("page")}` : "/tabung");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [sumTotal, setSumTotal] = useState(0);
	const [kutipan, setKutipan] = useState({
		dateTime: new Date().toISOString().slice(0, 10),
		ttype: "",
		total: "0.00",
		voucher: "",
		t100: "0.00",
		t50: "0.00",
		t20: "0.00",
		t10: "0.00",
		t5: "0.00",
		t1: "0.00",
	});
	const url = `/kutipan/${tid}`;
	const flagNew = tid == undefined ? true : false;
	const cardTitle = flagNew ? "Kutipan Baru" : "Kemaskini Kutipan";

	const formatCurr = (value) =>
		new Intl.NumberFormat().format(parseFloat(value));

	const fetchData = () => {
		if (loading) return;

		setLoading(true);
		if (flagNew) {
			axiosClient.get("/nvchr").then(({ data }) => {
				setLoading(false);
				setKutipan({ ...kutipan, voucher: parseInt(data) + 1 });
			});
			return;
		}

		axiosClient.get(url).then(({ data }) => {
			// data.total = formatCurr(data.total);
			setLoading(false);
			setKutipan(data);
		});
	};

	const onPrint = useReactToPrint({
		content: () => contPrint.current,
	});

	function onSubmit(ev) {
		ev.preventDefault();
		const payload = { ...kutipan };
		const dt = kutipan.dateTime.split("-");

		setError(null);
		payload.dateTime = `${dt[2]}-${dt[1]}-${dt[0]}`;
		let res = null;
		if (flagNew) {
			res = axiosClient.post("/kutipan", payload);
		} else {
			res = axiosClient.put(url, payload);
		}

		res
			.then(({ data: result }) => {
				if (result.errors) throw result.errors;
				const myTabung = tabungType.find((t) => t.key == payload.ttype).value;
				const myDate = payload.dateTime;
				if (flagNew) {
					showToast(`${myTabung} berjaya ditambah`);
					navigate(`/tabung/${result.data.id}`);
				} else {
					showToast(`${myTabung} berjaya dikemaskini`);
				}
			})
			.catch((err) => {
				setError(err);
				console.error(err);
			});
	}

	useEffect(() => !loading && fetchData(), []);
	useEffect(() => {
		if (loading) return true;
		// {new Intl.NumberFormat().format(parseFloat(value))}
		const m = [...typeMoney];
		m[0].value = parseFloat(kutipan.t100 || 0);
		m[1].value = parseFloat(kutipan.t50 || 0);
		m[2].value = parseFloat(kutipan.t20 || 0);
		m[3].value = parseFloat(kutipan.t10 || 0);
		m[4].value = parseFloat(kutipan.t5 || 0);
		m[5].value = parseFloat(kutipan.t1 || 0);
		setTypeMoney(m);
		setSumTotal(() => m.reduce((a, c) => a + parseFloat(c.value), 0));
	}, [kutipan]);

	return (
		<PageTabung
			title="Tabung Kutipan"
			buttons={
				<div className="flex gap-2">
					{!flagNew && (
						<TButton color="light" onClick={onPrint}>
							<PrinterIcon className="h-5" />
							Cetak
						</TButton>
					)}
					<TButton color="light" to={pageBack}>
						Kembali
					</TButton>
				</div>
			}
		>
			<div className="container-fixed pt-5">
				<div className="grid gap-5 lg:gap-7.5 xl:w-[58.75rem] mx-auto">
					{loading && <Pulse />}
					{!loading && (
						<>
							<div className="container">
								<Card>
									<Card.Header title={cardTitle} />
									<Card.Body>
										<form onSubmit={(ev) => onSubmit(ev)}>
											<FormC data={kutipan} setValue={setKutipan} error={error}>
												<div className="flex justify-between gap-7 mb-4">
													<div className="flex flex-col gap-5 w-full">
														<FormC.LDate
															text={"Tarikh"}
															field={"dateTime"}
															holder={"Tarikh Kutipan"}
														/>
														<FormC.LText
															text={"No Baucar"}
															field={"voucher"}
															holder={"No turutan baucar"}
														/>
														<FormC.LCurrency
															text={"Jumlah"}
															field={"total"}
															holder={"Jumlah Kutipan"}
														/>
														<FormC.LSelect
															text={"Jumlah"}
															field="ttype"
															keyval="key,value"
															listArr={tabungType}
														/>
														{sumTotal}
													</div>
													<div className="flex flex-col gap-5 w-full ">
														<FormC.LCurrency
															text={"Amount RM 100"}
															field={"t100"}
															holder={"Masukkan amoun"}
														/>
														<FormC.LCurrency
															text={"Amount RM 50"}
															field={"t50"}
															holder={"Masukkan amoun"}
														/>
														<FormC.LCurrency
															text={"Amount RM 20"}
															field={"t20"}
															holder={"Masukkan amoun"}
														/>
														<FormC.LCurrency
															text={"Amount RM 10"}
															field={"t10"}
															holder={"Masukkan amoun"}
														/>
														<FormC.LCurrency
															text={"Amount RM 5"}
															field={"t5"}
															holder={"Masukkan amoun"}
														/>
														<FormC.LCurrency
															text={"Amount RM 1"}
															field={"t1"}
															holder={"Masukkan amoun"}
														/>
													</div>
												</div>
												<FormC.FSave
													saveOpt={{
														disabled:
															sumTotal === 0 ||
															sumTotal != parseFloat(kutipan?.total || 0),
													}}
												/>
											</FormC>
										</form>
									</Card.Body>
								</Card>
							</div>
							{!flagNew && (
								<div className="hidden">
									<TabungPrint
										ref={contPrint}
										data={kutipan}
										userCount={userCount}
										typeMoney={typeMoney}
										typeList={tabungType}
										others={itemBernilai}
									></TabungPrint>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</PageTabung>
	);
}
