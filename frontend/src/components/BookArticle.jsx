import { useContext, useState } from "react";
import Sample from "../assets/sample.png";
import {
  BookMarked,
  BookOpenText,
  EyeClosed,
  EyeIcon,
  SearchCheck,
} from "lucide-react";
import { Context } from "../context/ContextProvider";

const CategoryCard = ({ label }) => {
  return (
    <div className="w-max  h-[25px] rounded-[40px] flex px-[10px] py-[8px] bg-[var(--primary)]/20 items-center justify-center ">
      <p className="text-[12px] text-[var(--primary)]">{label}</p>
    </div>
  );
};

const ActionButton = ({ icon, label, onclick, type }) => {
  const styles = {
    primary: `bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-all active:bg-[var(--primary)]/95 `,
    secondary: `bg-white border border-[var(--primary)] hover:bg-gray-200/50 transition-all active:bg-gray-200/80 text-[var(--primary)] `,
  };

  return (
    <button
      onClick={onclick}
      className={`flex cursor-pointer  gap-[10px] items-center justify-center 
    w-max px-5 text-[16px] py-[10px] rounded-[12px] ${styles[type]}`}
    >
      {icon}

      <p className="">{label}</p>
    </button>
  );
};

const Paragraph = ({ topic, text }) => {
  const [hideText, setHideText] = useState(false);

  return (
    <div className="flex flex-col gap-[8px]  ">
      <div className="flex items-center gap-[5px] h-max justify-center w-max">
        <h2 className="text-[var(--primary)] inter-semibold  text-lg">
          {topic}
        </h2>
        {hideText ? (
          <EyeIcon
            onClick={() => setHideText(!hideText)}
            className="text-[var(--primary)] cursor-pointer"
            size={20}
          />
        ) : (
          <EyeClosed
            onClick={() => setHideText(!hideText)}
            className="text-[var(--primary)] cursor-pointer"
            size={20}
          />
        )}
      </div>

      {!hideText && (
        <p className="text-[#724A39] text-left w-full max-w-[1200px ]">
          {text}
        </p>
      )}
    </div>
  );
};

const BookArticle = ({
  img,
  title,
  author,
  publishedDate,
  ratings,
  categories,
  summary,
  similarities,
  reason,
}) => {
  const { hidePopup, setHidePopup } = useContext(Context);

  const handleSaveBook = () => {
    setHidePopup(false);
  };
  return (
    <div className="flex flex-col border-b pb-30 border-[var(--secondary)]/20 w-full max-h-[550px]  max-w-[900px] gap-[18px] justify-center ">
      <div className="flex  gap-[15px]  w-max ">
        <img
          src={Sample}
          alt="book-cover"
          className="h-full w-[110px] object-cover p-0.5 border border-[var(--stroke)] rounded-md"
        />
        <div className="flex flex-col justify-center gap-[16px] ">
          <div className="bg-[#00B330] items-center justify-center flex w-[45px] text-white h-[25px] rounded-sm">
            <p className="text-[12px] ">{ratings}</p>
          </div>

          <p className="text-[20px] text-[var(--primary)]">{title}</p>
          <p className="text-[var(--secondary)]">{author} (1987)</p>
          <div className="flex items-center justify-center w-max gap-[6px]">
            {categories.map((c, i) => (
              <CategoryCard label={c} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-[10px] w-max items-center justify-center">
        <ActionButton
          type={`primary`}
          label={`Save to list`}
          icon={<BookMarked size={24} />}
          onclick={handleSaveBook}
        />
        <ActionButton
          type={`secondary`}
          label={`Check Store availability`}
          icon={<SearchCheck size={24} />}
        />
        <ActionButton
          type={`secondary`}
          label={`Read Books`}
          icon={<BookOpenText size={24} />}
        />
      </div>

      <div className="flex flex-col gap-[20px] ">
        <Paragraph topic={"Summary"} text={summary} />
        <Paragraph
          topic={"Similarities to your liked books"}
          text={similarities}
        />
        <Paragraph topic={"Why you’ll like it"} text={reason} />
      </div>
    </div>
  );
};

export default BookArticle;
