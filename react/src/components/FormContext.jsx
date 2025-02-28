import { createContext, useContext } from "react";
import TInput from "./Core/TInput";
import TSelect from "./Core/TSelect";
import TSwitch from "./Core/TSwitch";

const FormContext = createContext();

function FormC({ children, setValue, data, error }) {
	return (
		<FormContext.Provider value={{ setValue, data, error }}>
			{children}
		</FormContext.Provider>
	);
}
// function FLabel({ text, oCLass = "max-w-56" }) {
function FLabel({ text, oCLass = "max-w-46" }) {
	return <label className={`form-label ${oCLass}`}>{text}</label>;
}
function FInput({ field, holder = "", type = "text", option, classes = "" ,inputClass='' }) {
	const { setValue, data, error } = useContext(FormContext);
	return (
		<TInput
			data={data}
			field={field}
			setValue={setValue}
			error={error}
			holder={holder}
			type={type}
			option={option}
			classes={classes}
			inputClass={inputClass}
		/>
	);
}
function FSwitch({field, text, defval}){
	const { setValue, data, error } = useContext(FormContext);
	return (<TSwitch data={data} field={field} text={text} defVal={defval} setValue={setValue} />)
}
function FSelect({ field, keyval, listArr }) {
	const { setValue, data, error } = useContext(FormContext);
	return (
		<TSelect
			data={data}
			setValue={setValue}
			field={field}
			keyval={keyval}
			error={error}
			list={listArr}
		/>
	);
}

function CSelect({ text, field, keyval, listArr }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FSelect field={field} keyval={keyval} listArr={listArr} />
		</div>
	);
}
function CText({ text, field, holder, classes }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput field={field} holder={holder} inputClass={classes} />
		</div>
	);
}
function CRead({ text, field, holder }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput field={field} option={{readOnly:'readonly'}} />
		</div>
	);
}
function CCurrency({ text, field, holder, option }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput type="number" field={field} holder={holder} option={option} />
		</div>
	);
}
function CNumber({ text, field, holder, option }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput type="number" field={field} holder={holder} option={option} />
		</div>
	);
}
function ColPassword({ text, field, holder }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput field={field} holder={holder} type="password" />
		</div>
	);
}
function CDate({ text, field, holder }) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FInput field={field} holder={holder} type="date" />
		</div>
	);
}
function CCheckbox({ text, text2, val ,field}) {
	return (
		<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
			<FLabel text={text} />
			<FSwitch field={field} text={text2} defval={val} />
		</div>
	);
}
function CBButton({ save = true, cancel = false ,saveOpt={}}) {
	return (
		<div className="flex justify-end">
			{save && (
				<button
					type="submit"
					className="btn btn-primary"
					disabled={saveOpt?.disabled ?? false}
				>
					Save Changes
				</button>
			)}
		</div>
	);
}
FormC.label = FLabel;
FormC.input = FInput;
FormC.select = FSelect;
FormC.LRead = CRead;
FormC.LText = CText;
FormC.LDate = CDate;
FormC.LPassword = ColPassword;
FormC.LCurrency = CCurrency;
FormC.LNumber = CNumber;
FormC.LSelect = CSelect;
FormC.LCheckbox = CCheckbox;
FormC.FSave = CBButton;

export default FormC;
