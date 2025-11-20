import React, { useContext, useState } from "react";
import Plus from "../assets/plus.png";
import Trash from "../assets/trash-2.png";
import { Context } from "../context/ContextProvider";
const Button = ({ type, handleAdd, handleDelete, isAdded }) => {
  const { addedBooks, setAddedBooks } = useContext(Context)

  return (
    <div
    
      className={`h-[48px] w-[48px]  flex ml-auto  cursor-pointer items-center justify-center rounded-full ${type == "add"
          && `bg-[#B9562D]   `
      
        } ${isAdded && `bg-white hoveer:bg-white/90 border border-[#B9562D]`}`}
    >
      {type == "add" && !isAdded ?  (
        <img   onClick={handleAdd} src={Plus} className="h-full p-2.5 " />
        
      ) : (
        <img onClick={handleDelete} src={Trash} className=" h-full p-2.5" alt="" />
      )}
    </div>
  );
};

export default Button;
