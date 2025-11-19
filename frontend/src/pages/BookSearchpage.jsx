import { useContext } from "react";
import NavigateComponenet from "../components/NavigateComponenet";
import SearchBooksComponent from "../components/SearchBooksComponent";
import SearchPopup from "../components/SearchPopup";
import { Context } from "../context/ContextProvider";
import { Link } from "react-router-dom";

const BookSearchpage = () => {
  const { addedBooks, setAddedBooks } = useContext(Context)


  return (
    <div
      className="bg-[url('./assets/cover.png')] gap-1 w-full h-[100vh]  bg-cover bg-no-repeat 
      flex flex-col
    items-center  justify-center  "
    >
      <NavigateComponenet step={1} />
      <SearchPopup />
      <SearchBooksComponent />

    <div className="flex absolute bottom-5">
      
      <Link to={`/catergory`}>
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

export default BookSearchpage;
