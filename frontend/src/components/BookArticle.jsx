import { useContext, useEffect, useState } from "react";
import Sample from "../assets/sample.png";
import {
    BookMarked,
    BookOpenText,
    EyeClosed,
    EyeIcon,
    SearchCheck,
} from "lucide-react";
import { Context } from "../context/ContextProvider";
import Button from "./Button";

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
    const { activeBook, setActiveBook } = useContext(Context); // {}

    const handleSaveBook = () => {
        setActiveBook({
            img: "",
            title: title,
            author: author,
            year: 2020,
            summary: summary,
            genres: categories,
            similarity_to_liked_books: similarities,
            why_it_matches: reason,
        });
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
                            <CategoryCard key={i} label={c} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-[10px] w-max items-center justify-center">
                <Button
                    type={`primary`}
                    label={`Save to list`}
                    icon={<BookMarked size={24} />}
                    onClick={handleSaveBook}
                />
                <Button
                    type={`secondary`}
                    label={`Check Store availability`}
                    icon={<SearchCheck size={24} />}
                />
                <Button
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

const CategoryCard = ({ label }) => {
    return (
        <div className="w-max  h-[25px] rounded-[40px] flex px-[10px] py-[8px] bg-[var(--primary)]/20 items-center justify-center ">
            <p className="text-[12px] text-[var(--primary)]">{label}</p>
        </div>
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

export default BookArticle;
