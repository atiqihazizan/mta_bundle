import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

import "../assets/css/login.css";
import bgMta from "../assets/bg-masjid.jpg";

function GuestLayout() {
  const { currentUser, userToken } = useStateContext();

  if (userToken) {
    return <Navigate to="/" />;
  }

  // return <Outlet />;
  return (
    <div className="flex min-h-[700px] h-full flex-col alm">
      <div className="flex flex-1 min-h-[100%]">
        <div className="px-[2rem] py-[3rem] lg:px-[6rem] flex justify-center flex-col">
          <div className=" mx-auto">{<Outlet />}</div>
          {/* <div className="w-[24rem] max-w-[24rem] mx-auto">{<Outlet />}</div> */}
        </div>
        <div className="relative flex-1 bg-slate-50">
          <img className="absolute w-full h-full object-cover" src={bgMta} />
        </div>
      </div>
    </div>
  );
}

export default GuestLayout;
