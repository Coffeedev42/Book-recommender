import { useState } from "react";
import AddToListPopup from "../components/AddToListPopup";
import BookArticle from "../components/BookArticle";
import NavigationButton from "../components/NavigationButton";

const RecommendationsPage = () => {
  const [hidePopup, setHidePopup] = useState(false);
  return (
    <div
      className={`flex w-screen  h-full overflow-y-scroll py-[140px] gap-[120px]   items-center justify-center   flex-col `}
    >
      <AddToListPopup />
      <div className="absolute left-[8rem] top-1">
        <NavigationButton path={`/category`} />
      </div>
      <BookArticle />
      <BookArticle />
      <BookArticle />
      <BookArticle />
    </div>
  );
};

export default RecommendationsPage;
