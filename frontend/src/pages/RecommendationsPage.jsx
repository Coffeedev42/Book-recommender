import { useContext, useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import NavigationButton from "../components/NavigationButton";
import { Context } from "../context/ContextProvider";
import { Loader2 } from "lucide-react";

const RecommendationsPage = () => {
    const [hidePopup, setHidePopup] = useState(false);

    const { recommendedBooks, setRecommendedBooks } = useContext(Context);

    return (
        <div
            className={`flex w-screen  h-full overflow-y-scroll py-[140px] gap-10 items-center justify-center flex-col `}
        >
            <AddToListPopup />
            <div className="absolute left-[8rem] top-1">
                <NavigationButton path={`/category`} />
            </div>
            {recommendedBooks.results ? (
                recommendedBooks.results.map((b, i) => (
                    <BookArticle
                        key={i}
                        author={b.author}
                        title={b.title}
                        summary={b.summary}
                        similarities={b.similarity_to_liked_books}
                        reason={b.why_it_matches}
                        ratings={Math.round(b.total_score * 10) + `/10`}
                        categories={b.genre}
                        publishedDate={b.published_year}
                    />
                ))
            ) : (
                <p>loading...</p>
            )}
        </div>
    );
};

export default RecommendationsPage;
