import React, { useContext, useState } from "react";
import BookBlockCard from "./BookBlockCard";
import EyeClosed from "../assets/eye-closed.png";
import sample from "../assets/whatever.jpg";
import { Context } from "../context/ContextProvider";

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
          <h3 className=" font-medium font-sans text-[#522614]">Hide</h3>
          <img src={EyeClosed} className="h-[18px]" />
        </div>
      </div>
      {!hide && (
        <div
          className={`flex ${
            type === "add" && `z-10`
          } flex-col h-[200px] overflow-y-auto
            gap-[10px]  `}
        >
          {items.map((item, key) => (
            <BookBlockCard key={key} title={item.title} author={item.author} type={type} img={sample} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookBlock;
