import classNames from "classnames";
import { IoMenu } from "react-icons/io5";
import { NavLink, Outlet, useLocation } from "react-router";

import Logo from "../assets/logo_shrink.png";
import LanguagePicker from "../components/LanguagePicker";

export default function Main() {
    const { pathname } = useLocation();

    return (
        <>
            <div className="grid grid-cols-3 items-center mt-4">
                <div className="ml-4">
                    <LanguagePicker />
                </div>
                <div className="flex justify-center">
                    <NavLink to="/">
                        <img
                            src={Logo}
                            alt="Logo"
                            className={classNames(
                                "w-16 brightness-0 drop-shadow-sm drop-shadow-gray-300",
                                {
                                    hidden: pathname === "/",
                                },
                            )}
                        />
                    </NavLink>
                </div>
                <IoMenu className="justify-self-end text-5xl mr-6" />
            </div>
            <Outlet />
        </>
    );
}
