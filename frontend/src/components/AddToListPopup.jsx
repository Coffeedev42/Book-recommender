import { Plus, Trash } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context/ContextProvider";
import axios from "axios";

const AddToListPopup = () => {
    const popupRef = useRef(null);
    const { hidePopup, setHidePopup } = useContext(Context);
    const { activeBook, setActiveBook } = useContext(Context);

    const [bookLists, setBookLists] = useState([]);
    const [newListName, setNewListName] = useState("");

    const getBookLists = async () => {
        try {
            const URL = "http://localhost:5000/lists";
            const response = await axios.get(URL, {
                withCredentials: true,
            });
            setBookLists(response.data);
        } catch (error) {
            console.error("Fetching failed:", error);
        }
    };

    const createBookList = async () => {
        try {
            const URL = "http://localhost:5000/lists";
            const response = await axios.post(
                URL,
                {
                    list_name: newListName,
                },
                {
                    withCredentials: true,
                }
            );
            getBookLists();
            setNewListName("");
        } catch (error) {
            console.error("Creating failed:", error);
        }
    };

    const addBookToList = async (list_name, list_id) => {
        try {
            const URL = "http://localhost:5000/lists/add";
            const response = await axios.post(
                URL,
                {
                    list_name: list_name,
                    list_id: list_id,
                    book: activeBook,
                },
                {
                    withCredentials: true,
                }
            );
            getBookLists();
        } catch (error) {
            console.error("Adding Book failed:", error);
        }
    };

    useEffect(() => {
        getBookLists();
        const handleClose = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setHidePopup(true);
            }
        };

        document.addEventListener("mousedown", handleClose);

        return () => document.removeEventListener("mousedown", handleClose);
    }, []);
    const List = ({ list_name, book_count, list_id }) => {
        return (
            <div className="flex p-2 items-center justify-center bg-[var(--primary)]/20 rounded-lg">
                <div className=" p-2 text-[var(--primary)]">
                    <h3 className="text-xl inter-medium  font-sans font-medium">
                        {list_name}
                    </h3>
                    <p>
                        {book_count ? `${book_count} books` : "no books added"}
                    </p>
                </div>

                <div className="ml-auto flex gap-2">
                    <Button
                        type="primary"
                        icon={<Plus />}
                        label={"Add to list"}
                        onClick={() => addBookToList(list_name, list_id)}
                    />
                    <Button type="secondary" icon={<Trash />} />
                </div>
            </div>
        );
    };
    return (
        <>
            {!hidePopup && (
                <div className="flex  fixed w-full  items-center justify-center h-full top-0 bg-black/20 border">
                    <div
                        ref={popupRef}
                        className="w-150 h-max p-5 gap-[20px] flex flex-col bg-white border border-gray-200 shadow-xl rounded-md "
                    >
                        <h2 className="text-2xl inter-semibold text-[var(--primary)]">
                            Add To List
                        </h2>

                        <div className="flex flex-col gap-2">
                            {bookLists &&
                                bookLists.map((bookList, i) => (
                                    <>
                                        <List
                                            key={i}
                                            list_name={bookList.list_name}
                                            book_count={bookList.books.length}
                                            list_id={bookList.list_id}
                                        />
                                    </>
                                ))}
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl p-2 inter-medium text-[var(--primary)] inter-semibold">
                                Create List
                            </h2>
                            <div className="flex items-center justify-center gap-[10px] w-full">
                                <Input
                                    value={newListName}
                                    onChange={(e) =>
                                        setNewListName(e.target.value)
                                    }
                                    placeholder={`List name`}
                                />
                                <Button
                                    onClick={createBookList}
                                    type="primary"
                                    icon={<Plus />}
                                    label={"Create New List"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddToListPopup;
