import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    // UI flags
    const [closePopup, setClosePopup] = useState(true);
    const [closeSearchPopup, setCloseSearchPopup] = useState(true);
    const [hidePopup, setHidePopup] = useState(true);
    const [initial, setInitial] = useState(false);

    // Main user selections
    const [searchResult, setSearchResult] = useState();
    const [searchError, setSearchError] = useState();
    const [addedBooks, setAddedBooks] = useState([]);
    const [favGenres, setFavGenres] = useState([]);
    const [constraints, setConstraints] = useState([]);
    const [preferredMood, setPreferredMood] = useState("");
    const [booksLength, setBooksLength] = useState("");
    const [activeBook, setActiveBook] = useState({});
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    // Option lists
    const [favGenresList] = useState([
        "Philosophy",
        "Horror",
        "Feel Good",
        "Fictional",
        "Biography",
        "Science Fiction",
        "Mystery",
        "Thriller",
        "Romance",
        "Historical Fiction",
        "Poetry",
        "Non-Fiction",
        "Adventure",
        "Young Adult",
        "Classics",
        "Science & Technology",
        "Politics",
        "Religion & Spirituality",
        "True Crime",
    ]);

    const [booksLengthList] = useState([
        "Any length",
        "Short (Under 200 pages)",
        "Medium (Under 400)",
        "Long (400+ pages)",
    ]);

    const [preferredMoodList] = useState([
        "No Preference",
        "Motivation",
        "Peaceful",
        "Inspirational",
        "Heartwarming",
        "Exciting",
        "Romantic",
        "Adventurous",
        "Mysterious",
    ]);

    const [constraintsList] = useState([
        "No Gore",
        "No Violence",
        "Child Friendly",
        "No Woke",
        "No LGBTQ+",
        "No Cuss Words",
    ]);

    const recCountList = [
        { label: "5 Books (25 Credits)", count: 5, credits: 25 },
        { label: "8 Books (60 Credits)", count: 8, credits: 55 },
        { label: "10 Books (100 Credits)", count: 10, credits: 80 },
    ];
    const [recCount, setRecCount] = useState(recCountList[0]);

    const values = {
        closeSearchPopup,
        setCloseSearchPopup,
        searchResult,
        setSearchResult,
        searchError,
        setSearchError,
        closePopup,
        setClosePopup,
        addedBooks,
        setAddedBooks,
        favGenres,
        setFavGenres,
        constraints,
        setConstraints,
        preferredMood,
        setPreferredMood,
        booksLength,
        setBooksLength,
        booksLengthList,
        preferredMoodList,
        constraintsList,
        favGenresList,
        recCountList,
        recCount,
        setRecCount,
        initial,
        setInitial,
        hidePopup,
        setHidePopup,
        recommendedBooks,
        setRecommendedBooks,
        activeBook,
        setActiveBook,
    };

    return <Context.Provider value={values}>{children}</Context.Provider>;
};

export default ContextProvider;
