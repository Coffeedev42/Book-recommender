import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  
  // element boolians
  
  const [closePopup, setClosePopup] = useState(true)
  const [closeSearchPopup, setCloseSearchPopup] = useState(true);
  
  //-----main variables ---------------
  
  const [searchResult, setSearchResult] = useState();
  const [addedBooks, setAddedBooks] = useState([])
  const [favGenres, setFavGenres] = useState([])
  const [prefernces, setPreferences] = useState([])
  


  const values = {
    closeSearchPopup,
    setCloseSearchPopup,
    searchResult,
    setSearchResult,
    closePopup, setClosePopup,
    addedBooks, setAddedBooks,
    favGenres, setFavGenres,
    prefernces, setPreferences
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export default ContextProvider;
