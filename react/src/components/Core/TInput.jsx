import { useState } from "react";

export default function TInput({
	field,
	setValue,
	data,
	holder,
	error,
	option,
	type = "text",
	classes = "",
	newclass = false, // new class
	inputClass=''
}) {
	const [aClass, setClass] = useState(["flex flex-col w-full", classes]);
	function onChange(ev) {
		setValue({ ...data, [field]: ev.target.value });
	}

	return (
		<div className={newclass ? newclass : aClass.join(" ")}>
			<input
				className={`input ${inputClass}`}
				type={type}
				placeholder={holder}
				value={data?.[field] ?? ""}
				onChange={onChange}
				{...option}
			/>
			{error?.[field] && (
				<span className="text-xs mt-2 text-red-600">{error?.[field]}</span>
			)}
		</div>
	);
}
