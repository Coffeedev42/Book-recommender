import { useContext, useEffect, useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import { Context } from "../context/ContextProvider";
import Loader from "../assets/loader.gif";
import axios from "axios";

const RecommendationsPage = () => {
    const [hidePopup, setHidePopup] = useState(false);

    const {
        addedBooks,
        setAddedBooks,
        favGenres,
        constraints,
        preferredMood,
        booksLength,
        recommendedBooks,
        setRecommendedBooks,
        recCount,
    } = useContext(Context);

    const filteredTitles = addedBooks.map(
        (b) => `${b.title} by ${b.author[0]}`
    );

    const GetRecommendations = async () => {
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

        console.log(payload);

        try {
            const URL = "http://localhost:5000/recommend";
            const res = await axios.post(URL, payload, {
                withCredentials: true,
            });
            setRecommendedBooks(res.data);
            setAddedBooks([]);
        } catch (error) {
            console.error("generation failed:", error);
        }
    };

    useEffect(() => {
        setRecommendedBooks([]);
        GetRecommendations();
    }, []);

    return (
        <div
            className={`flex w-screen  h-full overflow-y-scroll  items-center justify-center flex-col `}
        >
            <AddToListPopup />
            {recommendedBooks.results ? (
                recommendedBooks.results.map((b, i) => (
                    <BookArticle
                        key={i}
                        author={b.author}
                        title={b.title}
                        summary={b.summary}
                        similarities={b.similarity_to_liked_books}
                        reason={b.why_it_matches}
                        ratings={Math.trunc(b.total_score * 10, 2) + `/10`}
                        categories={b.genre}
                        publishedDate={b.published_year}
                    />
                ))
            ) : (
                <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
                    <img className="w-20" src={Loader} alt="loading spinner" />
                    <p className="text-[#B9562D]">
                        Preparing your personalized picks…
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecommendationsPage;
