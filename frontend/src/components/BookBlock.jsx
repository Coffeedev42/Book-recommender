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
      className={`flex flex-col gap-[10px] w-[500px] 
      `}
    >
      <div className="flex w-full">
        <h3 className="text-[18px] text-[#B9562D] inter-medium">
          {content} {`(${count})`}
        </h3>
        <div
          onClick={() => setHide((h) => !h)}
          className="flex ml-auto items-center gap-[5px] justify-center w-max"
        >
          <h3 className=" font-medium font-sans text-[#522614]">{hide ? `Reveal` : `Hide`}</h3>
          {
            hide ? <EyeIcon size={20} className="text-[#522614]"/> : <EyeClosedIcon size={20} className="text-[#522614]"/>
          }
        </div>
      </div>
      { (
        <div
          className={`flex ${
            type === "add" && `z-10`
          } flex-col h-[300px] overflow-y-auto
            gap-[10px]  ${hide && `opacity-0`}`}
        >
          {items.map((item, key) => (
            <BookBlockCard key={key} img={item.src}
             title={item.title} author={item.author} 
             type={type}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookBlock;
