import { useContext, useEffect, useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import { Context } from "../context/ContextProvider";
import Loader from "../assets/loader.gif";
import Error from "../assets/sad-face.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { GetUserProfile } from "../functions";
import { GetBookRecommendations } from "../functions";
import { Link } from "lucide-react";
import Button from "../components/Button";

const RecommendationsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // credits, generation

    const {
        addedBooks,
        favGenres,
        constraints,
        preferredMood,
        booksLength,
        recommendedBooks,
        setRecommendedBooks,
        recCount,
        setProfile,
    } = useContext(Context);

    const navigate = useNavigate();

    const GetRecommendations = async () => {
        setLoading(true);
        await GetUserProfile(setProfile);
        const userProfile = await GetUserProfile(setProfile);

        if (addedBooks.length === 0) {
            setLoading(false);
            toast.error("No liked books found. Please add some first.");
            navigate("/", { replace: true });
            return;
        }

        if (userProfile.credit_limit < recCount.credits) {
            setLoading(false);
            toast.error("Not enough credits. Add credits first.");
            setError(true);
            setErrorMessage("Insufficient Credits. Please Add Credits");
            return;
        }

        const addedBookTitles = addedBooks.map(
            (b) => `${b.title} by ${b.author[0]}`
        );

        const bookProfile = {
            likedBooks: addedBookTitles,
            favoriteGenres: favGenres,
            preferredMood,
            booksLength,
            constraints,
        };
        const count = recCount.count;

        const response = await GetBookRecommendations(bookProfile, count);

        if (response?.success) {
            setRecommendedBooks(response.books);
            setError(false);
            toast.success(response.message);
            console.log(response.books);
            await GetUserProfile(setProfile);
        } else {
            setError(true);
            setErrorMessage("Generating Failed. Please Try Again!");
            toast.error(response.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        GetRecommendations();
    }, []);

    return (
        <div className="flex w-screen h-full overflow-y-scroll items-center justify-center flex-col">
            <Header
                step={3}
                path="/"
                steps={[
                    "Add liked books",
                    "Enter your preferences",
                    "Get Recommendations",
                ]}
            />
            <AddToListPopup />
            {loading && (
                <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
                    <img className="w-20" src={Loader} alt="loading spinner" />
                    <p className="text-[#D55414] text-md">
                        Preparing your personalized picks…
                    </p>
                </div>
            )}
            {error && (
                <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
                    <img className="h-12" src={Error} alt="error image" />
                    <p className="text-[#D55414] text-md">{errorMessage}</p>
                    <Button
                        label={"Add Credits"}
                        type="secondary"
                        onClick={() => {
                            navigate("/credits", { replace: true });
                        }}
                    />
                </div>
            )}
            {!loading && !error && recommendedBooks.length > 0 && (
                <div className="w-full h-full flex flex-col gap-2 items-center p-[50px] pt-20">
                    {recommendedBooks.map((book, index) => (
                        <BookArticle
                            key={index}
                            author={book.author}
                            title={book.title}
                            summary={book.summary}
                            similarities={book.similarity_to_liked_books}
                            reason={book.why_it_matches}
                            ratings={`${(book.total_score * 10).toFixed(2)}/10`}
                            categories={book.genre}
                            publishedDate={book.published_year}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && recommendedBooks.length === 0 && (
                <div className="w-full h-screen flex flex-col gap-2 items-center p-[50px]">
                    <p className="text-red-500">
                        No recommendations available.{" "}
                        <Link to="/category">
                            Try changing your preferences.
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecommendationsPage;
