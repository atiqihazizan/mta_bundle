import { useStateContext } from "../contexts/ContextProvider";
import { useState } from "react";
import logo from "../assets/logojawi.png";
import axiosClient from "../axios";
import TButton from "../components/Core/TButton";

function Login() {
	const { setCurrentUser, setUserToken } = useStateContext();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [onChecking, setChecking] = useState(false);
	const [error, setError] = useState({ __html: "" });

	const onSubmit = (ev) => {
		ev.preventDefault();
		setError({ __html: "" });
		if(onChecking) return;
		setChecking(true);
		axiosClient
			.post("/login", {
				username,
				password,
			})
			.then(({ data }) => {
				setChecking(false);
				setCurrentUser(data.user);
				setUserToken(data.token);
			})
			.catch(({ response }) => {
				const finalErrors = response.data.error;
				setError({ __html: finalErrors });
				setChecking(false);
			});
	};

	return (
		<>
			<div>
				<img className=" w-full" src={logo} alt="MTA Pro" />
				<h2 className="axu mt-[2rem] text-[1.5rem] font-bold tracking-tight">
					Log Masuk
				</h2>
				{/* <p className="lb avz awo axq">Pendaftaran melalui admin</p> */}
			</div>

			<div className="h-[2.5rem]">
				{error.__html && (
					// <div
					//   className="bg-red-500 rounded py-2 px-3 text-white"
					//   dangerouslySetInnerHTML={error}
					// ></div>
					<p className="text-red-500 py-2" dangerouslySetInnerHTML={error}></p>
				)}
			</div>

			<div className="">
				<form
					onSubmit={onSubmit}
					className="space-y-6"
					action="#"
					method="POST"
				>
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Nama Pengguna
						</label>
						<div className="mt-2">
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="off"
								placeholder="Masukkan nama pengguna"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								value={username}
								onChange={(ev) => setUsername(ev.target.value)}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Katalaluan
						</label>
						{/* <div className="flex items-center justify-between">
							<div className="text-sm">
								<a
									href="#"
									className="font-semibold text-indigo-600 hover:text-indigo-500"
								>
									Forgot password?
								</a>
							</div>
						</div> */}
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								placeholder="Masukkan katalaluan"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								value={password}
								onChange={(ev) => setPassword(ev.target.value)}
							/>
						</div>
					</div>

					<div>
						<TButton onChecking={onChecking} isClasses="w-full justify-center">Masuk</TButton>
						{/* <button
							type="submit"
							disabled={!onChecking}
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Sign in
						</button> */}
					</div>
				</form>
			</div>
		</>
	);
}

export default Login;
