import { useContext, useEffect, useState } from "react";
import {
    BookMarked,
    BookOpenText,
    EyeClosed,
    EyeIcon,
    ExternalLink,
    Star,
    Loader2,
    Store,
} from "lucide-react";
import { Context } from "../context/ContextProvider";
import Button from "./Button";
import CoverPlaceholder from "../assets/book-placeholder.png";

const BookArticle = ({
    title,
    author,
    publishedDate,
    ratings,
    categories,
    summary,
    similarities,
    reason,
}) => {
    const { hidePopup, setHidePopup } = useContext(Context);
    const { activeBook, setActiveBook } = useContext(Context);

    const [bookCover, setBookCover] = useState(null);
    const [googleData, setGoogleData] = useState({});
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [isLoadingCover, setIsLoadingCover] = useState(true);
    const [fetchDone, setFetchDone] = useState(false);

    // Fetch Google Books metadata
    useEffect(() => {
        const fetchBookData = async () => {
            if (!title) return;
            setIsLoadingCover(true);
            setFetchDone(false);

            try {
                const query = `${title.replace(/\s+/g, "+")}${
                    author ? `+inauthor:${author.replace(/\s+/g, "+")}` : ""
                }`;

                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=${query}`
                );
                const data = await response.json();

                if (data.items?.length > 0) {
                    const info = data.items[0].volumeInfo;

                    const image =
                        info.imageLinks?.extraLarge ||
                        info.imageLinks?.large ||
                        info.imageLinks?.thumbnail;

                    setBookCover(image || null);

                    setGoogleData({
                        avgRating: info.averageRating,
                        ratingsCount: info.ratingsCount,
                        pageCount: info.pageCount,
                        publisher: info.publisher,
                        language: info.language,
                        previewLink: info.previewLink,
                        isbn10:
                            info.industryIdentifiers?.find(
                                (id) => id.type === "ISBN_10"
                            )?.identifier || null,
                        isbn13:
                            info.industryIdentifiers?.find(
                                (id) => id.type === "ISBN_13"
                            )?.identifier || null,
                    });
                }
            } catch (error) {
                console.error("Error fetching Google Books data:", error);
            } finally {
                setFetchDone(true);
            }
        };

        fetchBookData();
    }, [title, author]);

    const handleSaveBook = () => {
        setActiveBook({
            img: bookCover,
            title,
            author,
            publishedDate,
            summary,
            genres: categories,
            similarity_to_liked_books: similarities,
            why_it_matches: reason,
        });
        setHidePopup(false);
    };

    const langMap = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
        ja: "Japanese",
        zh: "Chinese",
    };

    return (
        <div className="flex flex-col border-b py-10 border-[var(--secondary)]/20 w-full max-h-[850px] max-w-[900px] gap-[18px] justify-center">
            <div className="flex gap-[15px] w-max">
                {/* Book Cover with Loader */}
                <div className="relative h-[150px] w-[110px]">
                    {isLoadingCover && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2
                                className="animate-spin text-[var(--primary)]"
                                size={30}
                            />
                        </div>
                    )}

                    <img
                        src={bookCover || (fetchDone ? CoverPlaceholder : null)}
                        alt="book-cover"
                        className={`h-full w-full object-cover p-1 border border-[var(--stroke)] rounded-md ${
                            isLoadingCover ? "hidden" : "block"
                        }`}
                        onLoad={() => setIsLoadingCover(false)}
                        onError={() => setIsLoadingCover(false)}
                    />
                </div>

                <div className="flex flex-col justify-center gap-[10px]">
                    <div className="bg-[#00B330] items-center justify-center flex w-[45px] text-white h-[25px] rounded-sm">
                        <p className="text-[12px]">{ratings}</p>
                    </div>

                    <p className="text-[20px] text-[var(--primary)]">{title}</p>
                    <p className="text-[var(--secondary)]">
                        {author} ({publishedDate})
                    </p>

                    {/* Categories */}
                    <div className="flex items-center justify-center w-max gap-[6px]">
                        {categories?.map((c, i) => (
                            <CategoryCard key={i} label={c} />
                        ))}
                    </div>

                    {/* Google Ratings */}
                    {googleData.avgRating && (
                        <div className="flex items-center gap-[6px] text-[var(--primary)]">
                            <Star size={18} />
                            <p>
                                {googleData.avgRating.toFixed(1)} •{" "}
                                {googleData.ratingsCount?.toLocaleString()}{" "}
                                reviews
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] w-max items-center justify-center">
                <Button
                    type="primary"
                    label="Save to list"
                    icon={<BookMarked size={24} />}
                    onClick={handleSaveBook}
                />
                <Button
                    type="secondary"
                    label="Read Book"
                    icon={<BookOpenText size={24} />}
                />
                <Button
                    type="secondary"
                    label="Available Stores"
                    icon={<Store size={24} />}
                />
                {/* 
                {googleData.previewLink && (
                    <Button
                        type="secondary"
                        label="Preview"
                        icon={<ExternalLink size={22} />}
                        onClick={() =>
                            window.open(googleData.previewLink, "_blank")
                        }
                    />
                )} */}
            </div>

            {/* Summary + similarities + why */}
            <div className="flex flex-col gap-[20px]">
                <Paragraph topic="Summary" text={summary} />
                <Paragraph
                    topic="Similarities to your liked books"
                    text={similarities}
                />
                <Paragraph topic="Why you’ll like it" text={reason} />
            </div>

            {/* Extra Google Metadata */}
            <div className="mt-[10px]">
                <button
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                    className="text-[var(--primary)] underline text-sm cursor-pointer"
                >
                    {showMoreDetails ? "Hide details" : "Show more details"}
                </button>

                {showMoreDetails && (
                    <div className="mt-[12px] flex flex-col gap-[6px] text-[#724A39] text-sm">
                        {googleData.pageCount && (
                            <p>📖 {googleData.pageCount} pages</p>
                        )}
                        {googleData.publisher && (
                            <p>🏢 Publisher: {googleData.publisher}</p>
                        )}
                        {googleData.language && (
                            <p>
                                🌍 Language:{" "}
                                {langMap[googleData.language] ||
                                    googleData.language}
                            </p>
                        )}
                        {googleData.isbn13 && (
                            <p>🔢 ISBN-13: {googleData.isbn13}</p>
                        )}
                        {googleData.isbn10 && (
                            <p>🔢 ISBN-10: {googleData.isbn10}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryCard = ({ label }) => (
    <div className="w-max h-[25px] rounded-[40px] flex px-[10px] py-[8px] bg-[var(--primary)]/20 items-center justify-center">
        <p className="text-[12px] text-[var(--primary)]">{label}</p>
    </div>
);

const Paragraph = ({ topic, text }) => {
    const [hideText, setHideText] = useState(false);

    return (
        <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[5px] h-max justify-center w-max">
                <h2 className="text-[var(--primary)] inter-semibold text-lg">
                    {topic}
                </h2>
                {hideText ? (
                    <EyeIcon
                        onClick={() => setHideText(!hideText)}
                        className="text-[var(--primary)] cursor-pointer"
                        size={20}
                    />
                ) : (
                    <EyeClosed
                        onClick={() => setHideText(!hideText)}
                        className="text-[var(--primary)] cursor-pointer"
                        size={20}
                    />
                )}
            </div>

            {!hideText && (
                <p className="text-[#724A39] text-left w-full max-w-[1200px]">
                    {text}
                </p>
            )}
        </div>
    );
};

export default BookArticle;
