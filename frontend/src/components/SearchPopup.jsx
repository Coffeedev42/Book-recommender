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
import { Loader2, Search } from "lucide-react";
const SearchPopup = () => {
  const { closeSearchPopup, setCloseSearchPopup } = useContext(Context);
  const { searchResult, setSearchResult } = useContext(Context);
  const searchRef = useRef(null);

  const { addedBooks, setAddedBooks } = useContext(Context);
  const {loading, setLoading} = useContext(Context)

  useEffect(() => {
    const handleClose = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setCloseSearchPopup(true);
        console.log(`clciked`);
      }
    };

    document.addEventListener("mousedown", handleClose);

    setLoading("start")

    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // console.log(searchResult);

  const handleClick = (book) => {
    setAddedBooks((prev) => [
      ...prev,
      {
        title: book.volumeInfo?.title,
        author: book.volumeInfo?.authors,
      },
    ]);

    console.log(addedBooks);
  };
  return (
    <>
      {!closeSearchPopup && (
        <div
          ref={searchRef}
          className="flex w-full absolute top-[100%]  overflow-y-auto  h-100
           bg-white
        flex-col gap-4 border-2
     border-gray-300/50 shadow-md  rounded-[20px]  z-20 px-5 py-5 "
        >
          {searchResult ? (
            searchResult.map((r, i) => (
              <BookBlockCard
                handleClick={() => handleClick(r)}
                key={i}
                type={"add"}
                title={r.volumeInfo?.title}
                author={r.volumeInfo?.authors}
                img={
                  r.volumeInfo?.imageLinks
                    ? r.volumeInfo?.imageLinks.thumbnail
                    : Placeholder
                }
                border={true}
              />
            ))
          ) : loading === "start" ? <div className="flex gap-4 w-full h-full items-center justify-center">
            <Search className="text-[#B9562D]"/>
            <p className="inter-medium text-xl text-[#B9562D]">Start Searching Books</p>
          </div> : (
            <div className=" w-full h-full items-center justify-center flex">
              <Loader2 className="animate-spin text-[#B9562D]" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchPopup;
