import { createContext, useContext, useState } from "react";

const TabungContext = createContext({
	tabungType: [],
	userCount: [],
	itemBernilai: [],
	typeMoney: [],
	setTypeMoney: () => {},
});

export const TabungProvider = ({ children }) => {
	// tabung part
	const [tabungType] = useState([
		{ key: 1, value: "Tabung Statik" },
		{ key: 2, value: "Tabung Jumaat" },
		{ key: 3, value: "Tabung Mingguan" },
	]);
	const [userCount] = useState([
		"AHMAD BUSTAMAM BIN ABD RAHMAN",
		"MOHD FISOL BIN SAAD",
		"SOBERI BIN ISAHAK",
		"HJ ZAKARIA BIN ABDUL",
	]);
	const [itemBernilai, setItemBernilai] = useState([
		{ perkara: "", qty: "", remark: "" },
		{ perkara: "", qty: "", remark: "" },
		{ perkara: "", qty: "", remark: "" },
	]);
	const [typeMoney, setTypeMoney] = useState([
		{ name: "RM 100", money: 100, value: 0 },
		{ name: "RM 50", money: 50, value: 0 },
		{ name: "RM 20", money: 20, value: 0 },
		{ name: "RM 10", money: 10, value: 0 },
		{ name: "RM 5", money: 5, value: 0 },
		{ name: "RM 1", money: 1, value: 0 },
		// { name: "50 sen", money: 0.5, value: 0 },
		// { name: "20 sen", money: 0.2, value: 0 },
		// { name: "10 sen", money: 0.1, value: 0 },
	]);
	// tabung

	return (
		<TabungContext.Provider
			value={{ tabungType, userCount, itemBernilai, typeMoney, setTypeMoney }}
		>
			{children}
		</TabungContext.Provider>
	);
};

export const useTabungContext = () => useContext(TabungContext);
