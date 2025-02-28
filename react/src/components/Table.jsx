import { cloneElement, createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationLinks from "./PaginationLinks";

function Table({ columns, data, meta, loading, onReload, onChecked, tOption }) {
	const option = {
		oClassParent: "",
		nClassTable: "",
		oClassTable: "",
		nClassThead: "",
		oClassThead: "",
		headable: true,
		checkable: true,
		...tOption,
	};
	const [headerable, setHeader] = useState(option.headable);
	const [searchParams, setSearchParams] = useSearchParams();
	const [checkedState, setCheckedState] = useState([]);
	const classTable =
		option.nClassTable === false
			? ""
			: option.nClassTable.length > 0
			? option.nClassTable
			: `w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400 ${option.oClassTable}`;

	const classThead =
		option.nClassThead === false
			? ""
			: option.nClassThead.length > 0
			? option.nClassThead
			: `text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ${option.oClassThead}`;

	const onCheckHandle = (e, position) => {
		const updateCheckedState = checkedState.map((item, idx) =>
			idx === position ? !item : item
		);
		setCheckedState(updateCheckedState);
		onChecked?.(updateCheckedState);
	};

	const onPageClick = (link) => {
		const pageNum = parseInt(link.url.split("=")[1]);
		setSearchParams(`?${new URLSearchParams({ page: pageNum })}`);
		if (link.active) return;

		// // reset selected
		// const arrChk = new Array(data.length).fill(false)
		// if(arrChk.length > 0) setCheckedState(arrChk)
		// //

		onReload(link.url);
	};

	useEffect(() => {
		const arrChk = new Array(data.length).fill(false);
		if (arrChk.length > 0) setCheckedState(arrChk);
	}, [data]);

	function Row({ raw, field, classRow, nClassRow = "", render }) {
		const classes =
			nClassRow.length > 0 ? nClassRow : `pl-4 py-4 ${classRow ?? ""}`;
		if (field == undefined) {
			return <td className={classes.trim()}>{render(raw)}</td>;
		}
		let concanate = [];
		field.split(",").forEach((multi) => {
			let value = raw;
			// ketua.name @ ketua.notel
			multi
				.split(".")
				.forEach((v) => typeof field == "string" && (value = value[v]));
			concanate.push(value);
		});
		return <td className={classes.trim()}>{concanate.join(", ")}</td>;
	}

	function Cols({ name, oClass, nClass = "" }) {
		const classes = nClass.length > 0 ? nClass : `pl-4 py-3 ${oClass}`;
		return (
			<th scope="col" className={classes}>
				{name}
			</th>
		);
	}

	return (
		<div className={`relative ${option.oClassParent}`}>
			<table className={classTable}>
				{headerable && (
					<thead className={classThead}>
						<tr>
							{option.checkable && <th scope="col" className="w-[64px]"></th>}
							{columns?.map(({ name, class: classes, nClass }, idx) => {
								if (idx == columns.length - 1)
									classes = classes ? classes + " pr-4" : "";
								return (
									<Cols
										key={idx}
										nClass={nClass}
										oClass={classes}
										name={name}
									/>
								);
							})}
						</tr>
					</thead>
				)}
				<tbody>
					{!loading && (
						<>
							{data?.length === 0 && (
								<tr>
									<td
										colSpan={columns?.length + 1 || 1}
										className="text-center py-4 italic"
									>
										No Data Record
									</td>
								</tr>
							)}
							{data?.map((raw, idx) => (
								<tr
									key={idx}
									className={
										raw?.class === false
											? ""
											: idx == data.length - 1
											? "bg-white dark:bg-gray-800 dark:border-gray-700"
											: raw?.class?.length > 0
											? raw?.class
											: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
									}
								>
									{option.checkable && (
										<td className="px-6 py-4">
											<input
												type="checkbox"
												checked={checkedState[idx] ?? false}
												value={idx}
												onChange={(e) => onCheckHandle(e, idx)}
											/>
										</td>
									)}
									{columns?.map(
										({ classRow, field, nClassRow, render }, idx) => {
											if (idx == columns.length - 1)
												classRow = classRow ? classRow + " pr-4" : " pr-4";
											return (
												<Row
													key={idx}
													raw={raw}
													field={field}
													classRow={classRow}
													nClassRow={nClassRow}
													render={render}
												/>
											);
										}
									)}
								</tr>
							))}
						</>
					)}
				</tbody>
			</table>
			{meta && data?.length > 0 && (
				<PaginationLinks meta={meta} onPageClick={onPageClick} />
			)}
		</div>
	);
}

export default Table;
