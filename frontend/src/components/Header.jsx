import React from "react";
import NavigateComponent from "./NavigateComponent";
import HeaderUserProfile from "./HeaderUserProfile";

function Header({ className, step, path, steps }) {
    return (
        <div
            className={`${className} fixed top-0 left-0 right-0 bg-white z-50 w-full px-[50px] py-2 flex items-center border-b-1 border-b-gray-200`}
        >
            <NavigateComponent step={step} path={path} steps={steps} />
            <HeaderUserProfile className="ml-auto" />
        </div>
    );
}

export default Header;
