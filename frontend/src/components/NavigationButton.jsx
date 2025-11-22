import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NavigationButton = ({ path, top = 0, left }) => {
  return (
    <Link className={`absolute  top-1        flex mr-40`} to={path}>
      <button
        className=" border hover:bg-gray-100/50 cursor-pointer active:bg-gray-100 
    border-[#B9562D] rounded-full p-[5px]"
      >
        <ArrowLeft size={18} color="#B9562D" />
      </button>
    </Link>
  );
};

export default NavigationButton;
