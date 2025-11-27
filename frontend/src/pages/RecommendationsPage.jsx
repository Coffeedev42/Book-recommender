import { useContext, useEffect, useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import { Context } from "../context/ContextProvider";
import Loader from "../assets/loader.gif";
import Error from "../assets/sad-face.png";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { getProfile } from "../api/auth";
import { getRecommendations } from "../api/books";

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

    const fetchRecommendations = async () => {
        setLoading(true);

        try {
            const profileData = await getProfile();
            setProfile(profileData.profile);
            const userProfile = profileData.profile;

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

            const response = await getRecommendations(bookProfile, count);

            if (response && response.results && response.results.length > 0) {
                setRecommendedBooks(response.results);
                setError(false);
                toast.success("Recommendations are ready!");

                // Refresh profile to show updated credits
                const updatedProfile = await getProfile();
                setProfile(updatedProfile.profile);
            } else {
                setError(true);
                setErrorMessage("Generating Failed. Please Try Again!");
                toast.error("Failed to generate recommendations.");
            }

        } catch (err) {
            console.error(err);
            setError(true);
            setErrorMessage(err.response?.data?.message || "Failed to generate recommendations.");
            toast.error(err.response?.data?.message || "Failed to generate recommendations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
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
