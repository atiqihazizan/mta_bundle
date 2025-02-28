import { Navigate, createBrowserRouter } from "react-router-dom";

import DefaultLayout from "./components/DefaultLayout";
import Dashboard from "./views/Dashboard";
import Address from "./views/Address";
import Peoples from "./views/Peoples";
import Jenazah from "./views/Jenazah";
import Tabung from "./views/Tabung";
import Maintainance from "./views/Maintainance";

import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Resident from "./views/Resident";
import Letter from "./views/Letters";
import TabungForm from "./views/tabung/form";
import LetterForm from "./views/letter/form";
import Voucher from "./views/Voucher";
import VoucherForm from "./views/voucher/form";
import JenazahForm from "./views/jenazah/form";
import People from "./views/resident/People";

const router = createBrowserRouter([
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{ path: "/dashboard", element: <Navigate to="/" /> },
			{ path: "/", element: <Dashboard /> },
			{ path: "/address", element: <Address /> },
			{ path: "/address/new", element: <Resident /> },
			{ path: "/address/:id", element: <Resident /> },
			{ path: "/peoples", element: <Peoples /> },
			{ path: "/people/:id", element: <People /> },
			{ path: "/tabung", element: <Tabung /> },
			{ path: "/tabung/new", element: <TabungForm /> },
			{ path: "/tabung/:tid", element: <TabungForm /> },
			{ path: "/jenazah", element: <Jenazah /> },
			{ path: "/jenazah/new", element: <JenazahForm /> },
			{ path: "/jenazah/:jid", element: <JenazahForm /> },
			{ path: "/maintainance", element: <Maintainance /> },
			{ path: "/letters", element: <Letter /> },
			{ path: "/letters/new", element: <LetterForm /> },
			{ path: "/letters/:lid", element: <LetterForm /> },
			{ path: "/voucher", element: <Voucher /> },
			{ path: "/voucher/new", element: <VoucherForm /> },
			{ path: "/voucher/:vid", element: <VoucherForm /> },
		],
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/signup", element: <Signup /> },
		],
	},
]);

export default router;
