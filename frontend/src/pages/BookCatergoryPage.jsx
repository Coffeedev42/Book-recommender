import { Link } from "react-router-dom";
import FavGenreCatogories from "../components/FavGenreCatogories";
import FavGenreComponent from "../components/favGenreComponent";
import NavigateComponenet from "../components/NavigateComponenet";
import PreferencesComponent from "../components/PreferencesComponent";
import SelectCatergoryComponent from "../components/SelectCatergoryComponent";

const BookCatergoryPage = () => {
  return (
    <div
      className="flex bg-[url('./assets/cover.png')] w-[100vw] bg-cover bg-no-repeat
     items-center justify-center flex-col gap- h-[100vh] "
    >
      <NavigateComponenet step={2} />
      <div className="flex flex-col justify-center gap-[24px]  max-w-[700px]">
        <FavGenreComponent />
        <SelectCatergoryComponent
          cats={["Motivation", "Peaceful", "Tense", "Sympathetic"]}
          label={`Preferrd Mood`}
        />
        <SelectCatergoryComponent
          cats={["Short (Under 200 pages)", "Medium (Under 400)", 'Long (400+ pages)']}
          label={`Books Length`}
        />
        <PreferencesComponent cats={["No Violence", "No Woke", "No LGBTQ+"]} />
      </div>

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

export default BookCatergoryPage;
