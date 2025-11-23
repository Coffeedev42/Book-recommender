import { useContext, useEffect, useRef } from "react";
import BookCard from "./BookCard";
import { Context } from "../context/ContextProvider";
import Placeholder from "../assets/book-placeholder.png";
import { Loader2 } from "lucide-react";
const SearchPopup = () => {
  const { closeSearchPopup, setCloseSearchPopup } = useContext(Context);
  const { searchResult, setSearchResult } = useContext(Context);
  const searchRef = useRef(null);

  const { addedBooks, setAddedBooks } = useContext(Context);

  useEffect(() => {
    const handleClose = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setCloseSearchPopup(true);
      }
    };

    document.addEventListener("mousedown", handleClose);

    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  const handleClick = (book) => {
    setAddedBooks((prev) => [
      ...prev,
      {
        title: book.volumeInfo?.title,
        author: book.volumeInfo?.authors,
      },
    ]);
  };

  const isValidBook = (book) => {
    const validPrintType = book.volumeInfo.printType === "BOOK";
    const hasAuthors = book.volumeInfo.authors;
    const hasISBN =
      book.volumeInfo.industryIdentifiers &&
      book.volumeInfo.industryIdentifiers[0].type
        .toLowerCase()
        .includes("isbn");

    return validPrintType && hasAuthors && hasISBN;
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
            searchResult.map(
              (r, i) =>
                isValidBook(r) && (
                  <BookCard
                    handleClick={() => handleClick(r)}
                    key={i}
                    title={r.volumeInfo?.title}
                    author={r.volumeInfo?.authors}
                    img={
                      r.volumeInfo?.imageLinks
                        ? r.volumeInfo?.imageLinks.thumbnail
                        : Placeholder
                    }
                    bordered={true}
                  />
                )
            )
          ) : (
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
