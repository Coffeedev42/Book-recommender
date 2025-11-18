import React, { useContext } from "react";
import Sample from "../assets/whatever.jpg";
import Plus from "../assets/plus.png";


import Button from "./Button";
import { Context } from "../context/ContextProvider";
const BookBlockCard = ({ img, title, author, type, handleClick  }) => {

  const {addedBooks, setAddedBooks} = useContext(Context)
  const handleDelete = () => {
    setAddedBooks(addedBooks.map(book => {
      book.title !== title 
    }))

    console.log(`deleted`);
    
  }
  return (
    <div
    
      className={`flex ${type === "add" && `z-20`} 
      
    items-center pr-[20px] gap-[15px] pl-[10px] w-full h-[80px] py-[10px]
     rounded-[15px]  border border-[#B9562D] bg-white`}
    >
      <img
        src={img}
        alt="book-img"
        className=" h-[60px] shadow-md w-[45px] object-cover rounded-[10px]"
      />

      <div className="flex flex-col  ">
        <h3 className="text-[#B9562D] text-[18px] max-w-80 inter-medium">
          {title ? (title.length > 50 ? `${title.slice(0, 30)}...` : title) : "a monster call"}
        </h3>
        <p className="text-[#522614] text-[14px] max-w-full">{author ? (author.length > 0 ? author.join() : author) : "Patrick Ness"}</p>
      </div>

      <div className="flex items-center justify-center ml-auto gap-2">

      <Button type={type} handleOnclick={handleClick}
       />
      </div>
    </div>
  );
};

export default BookBlockCard;
