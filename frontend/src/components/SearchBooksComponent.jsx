import React, { useContext, useEffect, useState } from "react";
import Search from "../assets/search.png";
import BookBlock from "./BookBlock";
import axios from "axios";
import { Context } from "../context/ContextProvider";
const SearchBooksComponent = () => {
  // const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const { closeSearchPopup, setCloseSearchPopup } = useContext(Context);
  const { searchResult, setSearchResult } = useContext(Context);
  const { searchError, setSearchError } = useContext(Context);
  const {addedBooks, setAddedBooks} = useContext(Context)

  try {
    
    useEffect(() => {
      if (searchTerm === "") {
        setCloseSearchPopup(true);
      } else {
        setCloseSearchPopup(false);
      }
  
      // console.log(`jmjj`);
  
      const fetchBooks = async () => {
        if (searchTerm) {
          await axios
            .get(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                searchTerm
              )}`
            )
            .then((data) => setSearchResult(data.data.items))
            
        }
      };
      fetchBooks();
    }, [searchTerm]);
  } catch (error) {
    setSearchError(true)
  }

  

  return (
    <div className="flex flex-col max-w-[550px] mt-10 max-h-full items-center justify-center">
      <div className="flex text-center flex-col items-center justify-center gap-[10px]">
        <h2 className="inter-semibold text-[#B9562D] text-2xl">
          Add Books You Enjoyed Reading
        </h2>
        <p className="text-[#522614]">
          Add at least 05 books which you recently enjoyed reading. This will
          greatly impact the book recommendations. You can also add your
          favourites.
        </p>
      </div>
      <div className="flex flex-col  w-[500px] py-[20px]">
        <div className="flex shadow-lg w-full px-[20px] bg-white  h-[48px] items-center border border-[#522614] rounded-[60px]">
          <input
            type="text"
            autoFocus
            placeholder="search books.."
            className="outline-0 text-[#522614] w-full "
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <img src={Search} className="h-[18px] ml-auto" alt="" />
        </div>
      </div>
      <div className="flex flex-col ">
        <BookBlock items={[1, 2]} content={"Popular"} type={"add"} />
        <BookBlock items={addedBooks} content={"Added Books"} type={'trash'} />
      </div>
    </div>
  );
};

export default SearchBooksComponent;
