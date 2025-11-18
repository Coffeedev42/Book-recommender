import React, { useContext } from "react";
import Plus from "../assets/plus.png";
import Trash from "../assets/trash-2.png";
import { Context } from "../context/ContextProvider";
const Button = ({ type, handleOnclick,  }) => {
  const {addedBooks, setAddedBooks} = useContext(Context)
  return (
    <div
    onClick={() => handleOnclick}
      className={`h-[48px] w-[48px]  flex ml-auto cursor-pointer items-center justify-center rounded-full ${
        type == "add"
          ? `bg-[#B9562D] hover:bg-[#B9562D]/90 transition-all active:bg-[#B9562D]/80`
          : `bg-white border border-[#B9562D] hover:bg-gray-100 transition-all active:bg-gray-50`
      }`}
    >
      {type == "add" ? (
        <img   src={Plus} className="h-[24px] " />
      ) : (
        <img  src={Trash} className=" h-[24px]" alt="" />
      )}
    </div>
  );
};

export default Button;
