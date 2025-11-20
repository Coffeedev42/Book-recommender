import React, { useContext } from "react";
import Sample from "../assets/whatever.jpg";
import Plus from "../assets/plus.png";


import Button from "./Button";
import { Context } from "../context/ContextProvider";
const BookBlockCard = ({ img, title, author, type, border }) => {

  const { addedBooks, setAddedBooks } = useContext(Context)

  const handleAdd = () => {
    setAddedBooks(prev => [...prev, {
      title: title,
      author: author,
      src: img
    }])


  }

  const handleDelete = () => {
    setAddedBooks(addedBooks.filter(book =>  book.src !== img || book.title !== title ))
  }

  
  return (
    <div

      className={`flex ${type === "add" && `z-20`} 
      
    items-center pr-[20px] gap-[15px] pl-[10px] w-full h-[80px] py-[10px]
     rounded-[15px]  ${border ? `border border-[#B9562D] ` : `border border-[#E9E9E9]`} bg-white`}
    >
      <img
        src={img}
        alt="book-img"
        className=" h-[60px]  border border-gray-100 shadow-none  w-[45px] object-cover rounded-[10px]"
      />

      <div className="flex flex-col  ">
        <h3 className="text-[#B9562D] text-[18px] max-w-100 inter-medium">
          {title ? (title.length > 50 ? `${title.slice(0, 30)}...` : title) : "a monster call"}
        </h3>
        <p className="text-[#522614] text-[14px] max-w-full">{author ? (author.length > 3 ? `${author.slice(0, 2)}... ` : author) : <span className="text-black/60">not available</span>}</p>
      </div>

      <div className="flex items-center justify-center ml-auto gap-2">

        <Button type={type}
         isAdded={addedBooks.some(book => book.title === title && book.src === img ? true : false)}
          handleAdd={handleAdd} handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default BookBlockCard;
