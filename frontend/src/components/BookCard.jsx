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
      className={`flex  
      
    items-center pr-[20px] gap-[15px] pl-[10px] w-full h-[80px] py-[10px]
     rounded-[15px]  ${
       bordered ? `border border-[#B9562D] ` : `border border-[#E9E9E9]`
     } bg-white`}
    >
      <img
        src={img}
        alt="book-img"
        className=" h-[60px] p-1 border border-gray-300 shadow-none  w-[45px] object-cover rounded-[10px]"
      />

      <div className="flex flex-col  ">
        <h3 className="text-[#B9562D] text-[18px] max-w-100 inter-medium">
          {title
            ? title.length > 50
              ? `${title.slice(0, 30)}...`
              : title
            : "a monster call"}
        </h3>
        <p className="text-[#522614] text-[14px] max-w-full">
          {author ? (
            author.length > 3 ? (
              `${author.slice(0, 2)}... `
            ) : (
              author
            )
          ) : (
            <span className="text-black/60">not available</span>
          )}
        </p>
      </div>

      <div className="flex items-center justify-center ml-auto gap-2">
        <Button
          onClick={addRemoveHandler}
          type={"primary"}
          icon={added ? <Trash /> : <Plus />}
        />
      </div>
    </div>
  );
};

export default BookCard;
