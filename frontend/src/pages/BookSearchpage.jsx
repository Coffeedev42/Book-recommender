import { useEffect, useState, useContext, useRef } from "react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { Context } from "../context/ContextProvider";
import BookCard from "../components/BookCard";
import NavigateComponent from "../components/NavigateComponent";
import { Loader2, SearchIcon, X } from "lucide-react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/book-placeholder.png";
import BookIcon from "../assets/book-icon.png";
import Logo from "../assets/logo.png";
import Header from "../components/Header";
import { getProfile } from "../api/auth";

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
        setProfile,
    } = useContext(Context);

    const navigate = useNavigate();
    const searchFocusRef = useRef(null);
    const searchRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchInputImage, setSearchInputImage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [clearBtnHovered, setClearBtnHovered] = useState(false);
    const [hide, setHide] = useState(false);

    const [debouncedSearchTerm] = useDebounce(searchTerm, 800);

    useEffect(() => {
        setInitial(true);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data.profile);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();

        if (debouncedSearchTerm) {
            fetchBooks(debouncedSearchTerm);
            setCloseSearchPopup(false);
        } else {
            setSearchResult([]);
            setCloseSearchPopup(true);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const handleClose = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setCloseSearchPopup(true);
            }
        };

        document.addEventListener("mousedown", handleClose);

        return () => document.removeEventListener("mousedown", handleClose);
    }, []);

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

    const handleAddBook = (book) => {
        setAddedBooks((prev) => [
            ...prev,
            {
                title: book.volumeInfo?.title,
                author: book.volumeInfo?.authors,
            },
        ]);
        setSearchTerm("");
        searchFocusRef.current?.focus();
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

    const count = addedBooks.length;

    return (
        <div className="h-screen">
            <Header
                step={1}
                path="/add-books"
                steps={[
                    "Add liked books",
                    "Enter your preferences",
                    "Get Recommendations",
                ]}
            />

            <div className="w-full h-screen grid grid-cols-2 bg-white over">
                {/* Search Section */}
                <div className="flex p-[50px] pt-30 flex-col gap-[20px] w-full h-full max-h-full border-r-1 border-gray-200">
                    <div className="flex flex-col gap-[15px]">
                        <div>
                            <img src={Logo} className="h-20" alt="" />
                        </div>
                        <h2 className="font-medium text-[#C24000] text-2xl">
                            Think of Fred as your personal librarian.
                        </h2>
                        <p className="text-[#522614] max-w-[80%]">
                            Add at least five books you've recently enjoyed.
                            Fred will use them to tailor your recommendations.
                            You can also include your all-time favourites.
                        </p>
                    </div>

                    <div className="flex flex-col relative w-full gap-[15px]">
                        <div className="flex w-[500px] shadow-md px-[15px] bg-white h-[48px] items-center border border-[#522614] gap-[20px] rounded-md">
                            <input
                                ref={searchFocusRef}
                                type="text"
                                value={searchTerm}
                                onFocus={() => setSearchInputImage(false)}
                                placeholder="search books.."
                                className="outline-0 text-[#522614] w-full text-md"
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
                                    <div className="w-full h-full flex">
                                        <Loader2
                                            className="animate-spin"
                                            color="#D55414"
                                        />
                                    </div>
                                ) : clearBtnHovered ? (
                                    <X size={24} color="#D55414" />
                                ) : (
                                    <SearchIcon size={24} color="#D55414" />
                                )}
                            </button>
                        </div>
                        <Button
                            type={
                                addedBooks.length >= 3 ? "primary" : "disabled"
                            }
                            onClick={() => {
                                navigate("/category");
                            }}
                            label="Next"
                            className="w-[120px]"
                        />
                        {searchError && (
                            <p className="text-red-600 mt-2">
                                Error fetching books!
                            </p>
                        )}

                        {/* SearchPopup merged inline */}
                        {!closeSearchPopup && (
                            <div
                                ref={searchRef}
                                className="flex w-[500px] flex-1 overflow-hidden max-h-[500px] flex-col gap-2"
                            >
                                {searchResult ? (
                                    searchResult.map(
                                        (r, i) =>
                                            isValidBook(r) && (
                                                <BookCard
                                                    handleClick={() => {
                                                        handleAddBook(r);
                                                    }}
                                                    key={i}
                                                    title={r.volumeInfo?.title}
                                                    author={
                                                        r.volumeInfo?.authors
                                                    }
                                                    img={
                                                        r.volumeInfo?.imageLinks
                                                            ? r.volumeInfo
                                                                ?.imageLinks
                                                                .thumbnail
                                                            : Placeholder
                                                    }
                                                    bordered={false}
                                                />
                                            )
                                    )
                                ) : (
                                    <div className="w-full h-full items-center justify-center flex">
                                        <Loader2 className="animate-spin text-[#C24000]" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* BookContainer merged inline */}
                <div className="w-full h-full p-[50px] pt-30">
                    <div className="flex flex-col relative gap-2 w-full">
                        {addedBooks.length > 0 && (
                            <div className="flex w-full">
                                <h3 className="text-xl text-[#C24000] font-medium">
                                    Added Books ({count})
                                </h3>
                            </div>
                        )}
                        <div
                            className={`grid grid-cols-2 flex-1 overflow-hidden gap-[10px] ${hide && "opacity-0"
                                }`}
                        >
                            {addedBooks.length > 0 ? (
                                addedBooks.map((item, key) => (
                                    <BookCard
                                        key={key}
                                        img={item.src}
                                        title={item.title}
                                        author={item.author}
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 flex gap-2 items-center justify-center bg-white p-5 rounded-xl">
                                    <img
                                        className="w-8 opacity-50"
                                        src={BookIcon}
                                        alt=""
                                    />
                                    <p className="font-medium opacity-50 text-center text-md text-[#C24000]">
                                        Your Added Books Will Appear Here!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSearchPage;
