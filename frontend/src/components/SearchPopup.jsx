import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import BookBlockCard from "./BookBlockCard";
import { Context } from "../context/ContextProvider";
import Placeholder from "../assets/book-placeholder.png";
const SearchPopup = () => {
  const { closeSearchPopup, setCloseSearchPopup } = useContext(Context);
  const { searchResult, setSearchResult } = useContext(Context);
  const { searchError, setSearchError } = useContext(Context);
  const searchRef = useRef(null);

  const {addedBooks, setAddedBooks} = useContext(Context)

  useEffect(() => {
    const handleClose = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setCloseSearchPopup(true);
        console.log(`clciked`);
        
      }
    };

    document.addEventListener("mousedown", handleClose);

    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // console.log(searchResult);
  
  const handleClick = (book) => {
    setAddedBooks(prev => [...prev, {
      title: book.volumeInfo?.title,
      author: book.volumeInfo?.authors
    }])

    console.log(addedBooks);

    console.log(`click`);
    
    
  }
  return (
    <>
      { !closeSearchPopup && (
        <div
          ref={searchRef}
          className="flex w-150   top-[40%] overflow-y-auto h-100 bg-white
        flex-col gap-4 border-2
     border-gray-300/50 shadow-md  rounded-[20px] absolute z-20 px-5 py-5 "
        >
          {
            !searchError && 
            searchResult ?  searchResult.map((r, i) => (
              <BookBlockCard handleClick={() => handleClick(r)}  key={i} type={'add'} title={r.volumeInfo?.title} author={r.volumeInfo?.authors} 
              img={r.volumeInfo?.imageLinks ? r.volumeInfo?.imageLinks.thumbnail : Placeholder }/>
            ) ) : 'Not found'
          }
        </div>
      )}
    </>
  );
};

export default SearchPopup;
