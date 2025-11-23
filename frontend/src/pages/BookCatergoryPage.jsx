import { Link } from "react-router-dom";
import FavGenreCatogories from "../components/FavGenreCatogories";
import FavGenreComponent from "../components/FavGenreComponent";
import NavigateComponenet from "../components/NavigateComponenet";
import PreferencesComponent from "../components/PreferencesComponent";
import SelectCatergoryComponent from "../components/SelectCatergoryComponent";
import { Context } from "../context/ContextProvider";
import { useContext, useEffect, useState } from "react";
import NavigationButton from "../components/NavigationButton";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";

const BookCatergoryPage = () => {
    const { booksLengthList, setBooksLengthList } = useContext(Context);
    const { prefferdMoodList, setPrefferdMoodList } = useContext(Context);
    const { addedBooks, setAddedBooks } = useContext(Context);
    const { favGenres, setFavGenres } = useContext(Context);
    const { prefernces, setPreferences } = useContext(Context);
    const { prefferdMood, setPrefferdMood } = useContext(Context);
    const { booksLength, setBooksLength } = useContext(Context);

    const { recommendedBooks, setRecommendedBooks } = useContext(Context);

    const filteredTitles = addedBooks.map(
        (b) => `${b.title} by ${b.author[0]}`
    );

    const [recommendationValues, setrecommandationValue] = useState({
        profile: {
            likedBooks: filteredTitles,
            favoriteGenres: favGenres,
            preferences: prefernces,
            prefferdMood: prefferdMood,
            booksLength: booksLength,
        },
        rec_count: 5,
    });

    const GetRecommendations = async () => {
        try {
            // const URL = "http://localhost:5000/dummy-recommend";
            const URL = "http://localhost:5000/recommend";
            const response = await axios.post(URL, recommendationValues, {
                withCredentials: true,
            });

            setRecommendedBooks(response.data);
        } catch (error) {
            console.error("generation failed:", error);
        }
    };

    return (
        <div
            className="flex bg-[url('./assets/cover.png')] w-[100vw] 
      bg-cover bg-no-repeat
     items-center justify-center flex-col gap- h-[100vh] "
        >
            <NavigateComponenet step={2} path={`/`} />
            <LogoutButton />
            <div className="flex flex-col justify-center gap-[24px]  max-w-[700px]">
                <FavGenreComponent />
                <SelectCatergoryComponent
                    cats={prefferdMoodList}
                    label={`Preferred Mood`}
                />
                <SelectCatergoryComponent
                    cats={booksLengthList}
                    label={`Books Length`}
                />
                <PreferencesComponent
                    cats={["No Violence", "No Woke", "No LGBTQ+"]}
                />
            </div>

            <div className="flex absolute bottom-5">
                <Link onClick={GetRecommendations} to={`/recommendations`}>
                    <div
                        className="flex cursor-pointer   hover:scale-110 transition-all  text-white
       w-[80px] h-[80px] items-center justify-center p-5 bg-[#B9562D] rounded-full"
                    >
                        <p className="text-lg">Next</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default BookCatergoryPage;
