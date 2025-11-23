import { useContext } from "react";
import NavigateComponenet from "../components/NavigateComponenet";
import SearchBooksComponent from "../components/SearchBooksComponent";
import SearchPopup from "../components/SearchPopup";
import { Context } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import PageNavigator from "../components/PageNavigator";

const BookSearchPage = () => {
  const { addedBooks, setAddedBooks } = useContext(Context);
  const { searchResult, setSearchResult } = useContext(Context);

  return (
    <div
      className="bg-[url('./assets/cover.png')] gap-1 w-[100vw] h-[100vh] 
       bg-cover bg-no-repeat 
      flex flex-col
    items-center  justify-center  "
    >
      <LogoutButton />
      <NavigateComponenet step={1} />
      <SearchBooksComponent />

      <div className="flex absolute bottom-5">
        {addedBooks && addedBooks.length > 2 && (
          <PageNavigator path={`/category  `} />
        )}
      </div>
    </div>
  );
};

export default BookSearchPage;
