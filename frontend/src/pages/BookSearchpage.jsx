import { useEffect, useState, useContext, useRef } from "react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { Context } from "../context/ContextProvider";
import SearchPopup from "../components/SearchPopup";
import BookContainer from "../components/BookContainer";
import NavigateComponent from "../components/NavigateComponent";
import LogoutButton from "../components/LogoutButton";
import { Loader2, SearchIcon, X } from "lucide-react";
import Button from "../components/Button";
import { redirect, useNavigate } from "react-router-dom";

const BookSearchPage = () => {
    const {
        closeSearchPopup,
        setCloseSearchPopup,
        searchResult,
        setSearchResult,
        searchError,
        setSearchError,
        addedBooks,
        setAddedBooks,
        initial,
        setInitial,
    } = useContext(Context);

    const navigate = useNavigate();
    const searchFocusRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchInputImage, setSearchInputImage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [clearBtnHovered, setClearBtnHovered] = useState(false);

    const [debouncedSearchTerm] = useDebounce(searchTerm, 800);

    useEffect(() => {
        setInitial(true);
    }, []);

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchBooks(debouncedSearchTerm);
            setCloseSearchPopup(false);
        } else {
            setSearchResult([]);
            setCloseSearchPopup(true);
        }
    }, [debouncedSearchTerm]);

    const fetchBooks = async (term) => {
        setInitial(false);
        setLoading(true);
        try {
            const res = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
                    term
                )}&maxResults=20&printType=books`
            );
            setSearchResult(res.data.items || []);
            setSearchError(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setSearchError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-[url('./assets/cover.png')] w-[100vw] h-[100vh] 
                 bg-cover bg-no-repeat flex flex-col items-center justify-center gap-1"
        >
            <LogoutButton />
            <NavigateComponent step={1} />

            {/* Search Section */}
            <div className="flex flex-col max-w-[550px] mt-10 max-h-full items-center justify-center">
                <div className="flex text-center flex-col items-center justify-center gap-[10px]">
                    <h2 className="inter-semibold text-[#B9562D] text-2xl">
                        Add Books You Enjoyed Reading
                    </h2>
                    <p className="text-[#522614]">
                        Add at least 05 books which you recently enjoyed
                        reading. This will greatly impact the book
                        recommendations. You can also add your favourites!
                    </p>
                </div>

                <div className="flex flex-col relative w-full py-[20px]">
                    <div className="flex w-full px-[20px] bg-white h-[48px] items-center justify-center border border-[#522614] gap-[20px] rounded-[60px]">
                        <input
                            ref={searchFocusRef}
                            type="text"
                            value={searchTerm}
                            onFocus={() => setSearchInputImage(false)}
                            placeholder="search books.."
                            className="outline-0 text-[#522614] w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                setSearchTerm("");
                                searchFocusRef.current?.focus();
                            }}
                            onMouseEnter={() => setClearBtnHovered(true)}
                            onMouseLeave={() => setClearBtnHovered(false)}
                        >
                            {loading ? (
                                <div className=" w-full h-full items-center justify-center flex">
                                    <Loader2 className="animate-spin text-[#B9562D]" />
                                </div>
                            ) : clearBtnHovered ? (
                                <X size={24} color="#522614" />
                            ) : (
                                <SearchIcon size={24} color="#522614" />
                            )}
                        </button>
                    </div>
                    {searchError && (
                        <p className="text-red-600 mt-2">
                            Error fetching books!
                        </p>
                    )}

                    <SearchPopup />
                </div>

                <div className="flex flex-col">
                    <BookContainer
                        items={addedBooks}
                        content={"Added Books"}
                        type={"trash"}
                    />
                </div>
            </div>

            <div className="flex absolute bottom-5">
                {addedBooks && addedBooks.length > 2 && (
                    <Button
                        label={"Next"}
                        onClick={() => {
                            navigate("/category");
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default BookSearchPage;
