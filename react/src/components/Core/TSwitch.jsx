import { useEffect, useState } from "react";

export default function TSwitch({
	field,
	setValue,
	defVal = 1,
	text,
	data,
	error,
	option,
	classes = "",
	newclass = false, // new class
}) {
	const [isChecked, setChecked] = useState(false);
	const [aClass, setClass] = useState(["flex flex-col w-full", classes]);
	function onChange(ev) {
		const chked = !isChecked;//ev.target.checked
		if (chked) setValue({ ...data, [field]: defVal });
		else setValue({ ...data, [field]: 0 });
		setChecked(chked);
	}
	useEffect(()=>{
		if (data[field] == defVal) setChecked(true);
	},[])
	return (
		<div className={newclass ? newclass : aClass.join(" ")}>
			<label className="checkbox-group w-full">
				<input
					className="checkbox checkbox-sm"
					name="check"
					type="checkbox"
					value={defVal}
					onChange={onChange}
					checked={isChecked}
					{...option}
				/>
				<span className="checkbox-label">{text}</span>
			</label>
			{error?.[field] && (
				<span className="text-xs mt-2 text-red-600">{error?.[field]}</span>
			)}
		</div>
	);
}
