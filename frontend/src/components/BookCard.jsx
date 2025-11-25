import { useContext, useState, useEffect } from "react";
import Button from "./Button";
import { Context } from "../context/ContextProvider";
import { Plus, Trash } from "lucide-react";

const BookCard = ({ img, title, author, btnType, bordered }) => {
    const { addedBooks, setAddedBooks } = useContext(Context);

    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!addedBooks) return;
        const exists = addedBooks.some(
            (book) => book.src === img && book.title === title
        );
        setAdded(exists);
    }, [addedBooks, img, title]);

    const addRemoveHandler = () => {
        if (!added) {
            // add book
            setAddedBooks((prev = []) => [
                ...prev,
                {
                    title: title,
                    author: author,
                    src: img,
                },
            ]);
            setAdded(true);
        } else {
            // remove book
            setAddedBooks((prev = []) =>
                prev.filter((book) => book.src !== img || book.title !== title)
            );
            setAdded(false);
        }
    };

    return (
        <div
            className={`flex items-center p-2 pr-3 gap-[15px] w-full rounded-md  ${
                bordered
                    ? `border border-[#C24000] `
                    : `border border-[#E9E9E9]`
            } ${added ? "bg-gray-100/70" : "bg-white"}`}
        >
            <img
                src={img}
                alt="book-img"
                className=" h-[90px] w-[63px] border border-gray-300 shadow-none object-cover rounded-md "
            />

            <div className="flex flex-col  ">
                <h3 className="text-[#C24000] text-md max-w-100 inter-medium">
                    {title
                        ? title.length > 50
                            ? `${title.slice(0, 30)}...`
                            : title
                        : "a monster call"}
                </h3>
                <p className="text-[#522614] text-sm max-w-full">
                    {author ? (
                        author
                    ) : (
                        <span className="text-black/60">not available</span>
                    )}
                </p>
            </div>

            <div className="flex items-center justify-center ml-auto gap-2">
                <Button
                    className="p-3"
                    onClick={addRemoveHandler}
                    type={"iconed"}
                    icon={added ? <Trash /> : <Plus />}
                />
            </div>
        </div>
    );
};

export default BookCard;
