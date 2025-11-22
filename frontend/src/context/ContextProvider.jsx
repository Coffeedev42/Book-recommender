import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  // element boolians

  const [closePopup, setClosePopup] = useState(true);
  const [closeSearchPopup, setCloseSearchPopup] = useState(true);
  const [hidePopup, setHidePopup] = useState(true);

  //-----main variables ---------------

  const [searchResult, setSearchResult] = useState();
  const [addedBooks, setAddedBooks] = useState([]);
  const [favGenres, setFavGenres] = useState([]);
  const [prefernces, setPreferences] = useState([]);
  const [prefferdMood, setPrefferdMood] = useState("");
  const [booksLength, setBooksLength] = useState("");
  const [initial, setInitial] = useState(false);

  //assets variales

  const [booksLengthList, setBooksLengthList] = useState([
    "Short (Under 200 pages)",
    "Medium (Under 400)",
    "Long (400+ pages)",
  ]);
  const [prefferdMoodList, setPrefferdMoodList] = useState([
    "Motivation",
    "Peaceful",
    "Tense",
    "Sympathetic",
  ]);

  const values = {
    closeSearchPopup,
    setCloseSearchPopup,
    searchResult,
    setSearchResult,
    closePopup,
    setClosePopup,
    addedBooks,
    setAddedBooks,
    favGenres,
    setFavGenres,
    prefernces,
    setPreferences,
    prefferdMood,
    setPrefferdMood,
    booksLength,
    setBooksLength,
    booksLengthList,
    setBooksLengthList,
    prefferdMoodList,
    setPrefferdMoodList,
    initial,
    setInitial,
    hidePopup,
    setHidePopup,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export default ContextProvider;
