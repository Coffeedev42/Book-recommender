import { useContext, useEffect, useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import { Context } from "../context/ContextProvider";
import Loader from "../assets/loader.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { GetUserProfile } from "../functions";

const RecommendationsPage = () => {
    const [hidePopup, setHidePopup] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const filteredTitles = addedBooks.map(
        (b) => `${b.title} by ${b.author[0]}`
    );

    const GetRecommendations = async () => {
        if (addedBooks.length === 0) return;

        const payload = {
            profile: {
                likedBooks: filteredTitles,
                favoriteGenres: favGenres,
                preferredMood,
                booksLength,
                constraints,
            },
            rec_count: recCount.count,
        };

        setLoading(true);

        try {
            const URL = "http://localhost:5000/recommend";
            const res = await axios.post(URL, payload, {
                withCredentials: true,
            });

            if (res.data && res.data.results && res.data.results.length > 0) {
                setRecommendedBooks(res.data);
                toast.success("Recommendations ready!");
                GetUserProfile(setProfile);
            } else {
                toast.error(
                    "No recommendations found. Try adjusting your preferences."
                );
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to generate recommendations.";
            toast.error(message);
            console.error("Generation error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (addedBooks.length === 0) {
            toast.error("No liked books found. Please add some first.");
            navigate("/", { replace: true });
        } else {
            GetRecommendations();
        }
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

            {loading ? (
                <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
                    <img className="w-20" src={Loader} alt="loading spinner" />
                    <p className="text-[#B9562D]">
                        Preparing your personalized picks…
                    </p>
                </div>
            ) : recommendedBooks.results &&
              recommendedBooks.results.length > 0 ? (
                recommendedBooks.results.map((b, i) => (
                    <BookArticle
                        key={i}
                        author={b.author}
                        title={b.title}
                        summary={b.summary}
                        similarities={b.similarity_to_liked_books}
                        reason={b.why_it_matches}
                        ratings={`${Math.trunc(b.total_score * 10)}/10`}
                        categories={b.genre}
                        publishedDate={b.published_year}
                    />
                ))
            ) : (
                <p className="text-red-600 mt-10">
                    No recommendations available. Try changing your preferences.
                </p>
            )}
        </div>
    );
};

export default RecommendationsPage;
