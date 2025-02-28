import { createContext, useContext, useState } from "react";
import TokenService from "../utils/token";

const StateContext = createContext({
	currentUser: {},
	userToken: null,
	surveys: [],
	toast: { message: null, show: false },
	spinner: { message: null, show: false },
	setCurrentUser: () => { },
	setUserToken: () => { },
});

export const ContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});
	const [userToken, _setUserToken] = useState(TokenService.getToken() || "");
	const [toast, setToast] = useState({ message: "", show: false });
	const [spinner, setSpinner] = useState({ message: "", show: false });

	const setUserToken = (token) => {
		if (token) {
			TokenService.setToken(token);
		} else {
			TokenService.clearAuth();
		}
		_setUserToken(token);
	};

	const showToast = (message) => {
		setToast({ message, show: true });
		setTimeout(() => setToast({ message: "", show: false }), 5000);
	};

	const showSpinner = (show = false, message = "") => setSpinner({ message, show: show });

	return (
		<StateContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				userToken,
				setUserToken,
				toast,
				showToast,
				spinner,
				showSpinner,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
