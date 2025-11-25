import React from "react";
import NavigateComponent from "./NavigateComponent";
import HeaderUserProfile from "./HeaderUserProfile";

function Header({ className, step, path, steps }) {
    return (
        <div
            className={`${className} w-full px-[50px] py-2 flex items-center border-b-1 border-b-gray-200`}
        >
            <NavigateComponent step={step} path={path} steps={steps} />
            <HeaderUserProfile className="ml-auto" />
        </div>
    );
}

export default Header;
