import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { TabungProvider } from "../contexts/TabungProvider";
import axiosClient from "../axios";
import Toast from "./Toast";
import Spinner from "./Spinner";
import Navigation from "./Navigation";
import TokenService from "../utils/token";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout() {
	const navigate = useNavigate();
	const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		if (!userToken) {
			navigate('/login');
			return;
		}
		
		axiosClient
			.get("/me")
			.then(({ data }) => setCurrentUser(data))
			.catch(() => {
				// If we can't get user data, clear the token
				setCurrentUser({});
				setUserToken(null);
			});
		
		// const checkToken = () => {
		// 	if (!TokenService.hasToken() || TokenService.isTokenExpired()) {
		// 		navigate("/login");
		// 	}
		// };

		// window.addEventListener("focus", checkToken);
		// return () => window.removeEventListener("focus", checkToken);
		
	}, [userToken]);

	const logout = (ev) => {
		ev.preventDefault();
		
		axiosClient.post("/logout")
			.then(() => {
				setCurrentUser({});
				setUserToken(null);
				navigate("/login");
			})
			.catch((error) => {
				// If logout API fails, still clear the local session
				console.error("Logout failed:", error);
				setCurrentUser({});
				setUserToken(null);
			});
	};

	// Don't render anything while loading user data
	if (!userToken || !currentUser?.id) {
		return null;
	}

	return (
		<TabungProvider>
			<div className="h-screen flex bg-gray-100 overflow-hidden">
				<Navigation currentUser={currentUser} onLogout={logout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main className="flex-1 relative">
					<Outlet context={{ sidebarOpen, setSidebarOpen }} />
				</main>

				<Spinner />
				<Toast />
			</div>
		</TabungProvider>
	);
}
