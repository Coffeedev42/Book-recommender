import React, { useContext, useEffect, useState } from "react";
import Search from "../assets/search.png";

import axios from "axios";

import { Context } from "../context/ContextProvider";
import SearchPopup from "./SearchPopup";
import { SearchIcon, X } from "lucide-react";
import BookContainer from "./BookContainer";
const SearchBooksComponent = () => {
    // const [books, setBooks] = useState([]);
    const { closeSearchPopup, setCloseSearchPopup } = useContext(Context);
    const { searchResult, setSearchResult } = useContext(Context);
    const { searchError, setSearchError } = useContext(Context);
    const { addedBooks, setAddedBooks } = useContext(Context);
    const { initial, setInitial } = useContext(Context);

    const [searchInputImage, setSeacrchInputImage] = useState(true);
    const [serachTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setInitial(true);
    }, []);

    const fetchBooks = async (term) => {
        setInitial(false);
        try {
            if (term !== "") {
                await axios
                    .get(
                        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                            term
                        )}`
                    )
                    .then((data) => setSearchResult(data.data.items));
            }
        } catch (error) {}
    };

    return (
        <div className="flex flex-col max-w-[550px] mt-10 max-h-full items-center justify-center">
            <div className="flex text-center flex-col items-center justify-center gap-[10px]">
                <h2 className="inter-semibold text-[#B9562D] text-2xl">
                    Add Books You Enjoyed Reading
                </h2>
                <p className="text-[#522614]">
                    Add at least 05 books which you recently enjoyed reading.
                    This will greatly impact the book recommendations. You can
                    also add your favourites!
                </p>
            </div>
            <div className="flex flex-col relative w-full py-[20px]">
                <div
                    className="flex shadow-lg w-full
           px-[20px] bg-white  h-[48px] items-center justify-center
        border border-[#522614] gap-[20px] rounded-[60px]"
                >
                    <input
                        type="text"
                        value={serachTerm}
                        onFocus={() => {
                            if (serachTerm !== "") {
                                setCloseSearchPopup(false);
                            }
                            setSeacrchInputImage(false);
                        }}
                        autoFocus
                        placeholder="search books.."
                        className="outline-0 text-[#522614]  w-full "
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setCloseSearchPopup(true);
                            } else {
                                setCloseSearchPopup(false);
                            }
                            // setSearchTerm(e.target.value);
                            setSearchTerm(e.target.value);

                            try {
                                fetchBooks(e.target.value);
                            } catch (error) {
                                console.log(`no connection!`);
                            }
                        }}
                    />
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            setSearchTerm("");
                        }}
                    >
                        {serachTerm ? (
                            <X size={24} color="#522614" />
                        ) : (
                            <SearchIcon size={24} color="#522614" />
                        )}
                    </button>
                </div>
                <SearchPopup />
            </div>

            <div className="flex flex-col ">
                <BookContainer
                    items={addedBooks}
                    content={"Added Books"}
                    type={"trash"}
                />
            </div>
        </div>
    );
};

export default SearchBooksComponent;
