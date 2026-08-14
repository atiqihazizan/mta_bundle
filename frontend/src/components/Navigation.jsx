import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { navigation } from "../config/navigation";
import { useStateContext } from "../contexts/ContextProvider";
import logo from "../assets/logojawi-w.svg";
import axiosClient from "../axios";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const NavItem = ({ item }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      classNames(
        isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700",
        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      )
    }
  >
    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
    {item.name}
  </NavLink>
);

const ChangePasswordDialog = ({ isOpen, setIsOpen }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showToast("Katalaluan baru tidak sama");
      return;
    }

    try {
      const res = await axiosClient.post("/change-password", {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      showToast("Katalaluan berjaya diubah");
      setIsOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
			if (error.response && error.response.status === 422) {
				showToast(error.response.data.error);
				// console.error("Validasi gagal:", error.response.data);
			} else {
				// showToast(error);
					console.error("Terjadi kesalahan:", error);
			}
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Ubah Katalaluan
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Katalaluan Lama
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Katalaluan Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sahkan Katalaluan Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const UserMenu = ({ currentUser, onLogout }) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-x-4 text-sm font-semibold leading-6 text-white">
          <UserIcon className="h-8 w-8 rounded-full bg-white/25 p-1" />
          <span className="sr-only">Your profile</span>
          <span aria-hidden="true">{currentUser.name}</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-12 left-0 z-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                >
                  Ubah Katalaluan
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={(ev) => onLogout(ev)}
                  className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                >
                  Log Keluar
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
      <ChangePasswordDialog isOpen={isChangePasswordOpen} setIsOpen={setIsChangePasswordOpen} />
    </>
  );
};

const NavigationContent = ({ currentUser, onLogout }) => (
  <div className="flex grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden bg-gray-800">
    <div className="flex shrink-0 items-center justify-center px-4 py-6 mt-2">
      <img className="h-11" src={logo} alt="Masjid Tuan Abdullah" />
    </div>
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="space-y-1 p-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto border-t border-gray-700 p-4">
          <UserMenu currentUser={currentUser} onLogout={onLogout} />
        </li>
      </ul>
    </nav>
  </div>
);

export default function Navigation({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <NavigationContent currentUser={currentUser} onLogout={onLogout} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        <NavigationContent currentUser={currentUser} onLogout={onLogout} />
      </div>
    </>
  );
}
