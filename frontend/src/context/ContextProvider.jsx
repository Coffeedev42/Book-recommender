import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [closeSearchPopup, setCloseSearchPopup] = useState(true);
  const [searchResult, setSearchResult] = useState([{title: 'vedor', author: 'dd'}]);
  const [searchError, setSearchError] = useState(false);
  const [closePopup, setClosePopup] = useState(true)

  console.log(searchResult);
  

  //-----main variables ---------------

  const [addedBooks, setAddedBooks] = useState([[]])
  const values = {
    closeSearchPopup,
    setCloseSearchPopup,
    searchResult,
    setSearchResult,
    searchError, setSearchError,
    closePopup, setClosePopup,
    addedBooks, setAddedBooks
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export default ContextProvider;
