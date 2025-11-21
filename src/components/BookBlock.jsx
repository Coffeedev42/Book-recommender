import React, { useContext, useState } from "react";
import BookBlockCard from "./BookBlockCard";
import EyeClosed from "../assets/eye-closed.png";
import sample from "../assets/whatever.jpg";
import { Context } from "../context/ContextProvider";
import {EyeClosedIcon, EyeIcon, User} from 'lucide-react'

const BookBlock = ({ items, type, content, handleDelete }) => {
  const count = items.length;
  const [hide, setHide] = useState(false);
  const {addedBooks, setAddedBooks} = useContext(Context)

  return (
    <div
      className={`flex flex-col  relative gap-[10px] w-[500px] 
      `}
    >
      <div className="flex w-full">
        <h3 className="text-[18px] text-[#B9562D] inter-medium">
          {content} {`(${count})`}
        </h3>
      </div>
      { (
        <div
          className={`bg-linear-50 flex    ${
            type === "add" && `z-10`
          } flex-col h-[300px] overflow-y-auto
          gap-[10px]  ${hide && `opacity-0`}`}
          >
          {
          items.length > 0 ? 
          items.map((item, key) => (
            <BookBlockCard key={key} img={item.src}
            title={item.title} author={item.author} 
            type={type}  />
          )) : <div className="flex bg-white p-5 rounded-xl  border border-gray-200">
            <p className="inter-medium text-lg text-[#522614] ">Start adding books through searching</p>
          </div>
        }

        </div>
      )}
    </div>
  );
};

export default BookBlock;
