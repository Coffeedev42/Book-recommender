import { Plus, Trash } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context/ContextProvider";
import axios from "axios";
import NoDataImage from "../assets/list.png";

const AddToListPopup = () => {
    const popupRef = useRef(null);
    const { hidePopup, setHidePopup } = useContext(Context);
    const { activeBook } = useContext(Context);

    const [bookLists, setBookLists] = useState([]);
    const [newListName, setNewListName] = useState("");
    const [error, setError] = useState(null);

    const getBookLists = async () => {
        try {
            const URL = "http://localhost:5000/lists";
            const response = await axios.get(URL, { withCredentials: true });
            setBookLists(response.data);
            setError(null);
        } catch (err) {
            console.error("Fetching failed:", err);
            setError("Failed to fetch lists. Please try again.");
        }
    };

    const createBookList = async () => {
        if (!newListName.trim()) {
            setError("List name cannot be empty.");
            return;
        }
        try {
            const URL = "http://localhost:5000/lists";
            await axios.post(
                URL,
                { list_name: newListName },
                { withCredentials: true }
            );
            getBookLists();
            setNewListName("");
            setError(null);
        } catch (err) {
            console.error("Creating failed:", err);
            setError("Failed to create list. Please try again.");
        }
    };

    const addBookToList = async (list_name, list_id) => {
        try {
            const URL = "http://localhost:5000/lists/add";
            await axios.post(
                URL,
                { list_name, list_id, book: activeBook },
                { withCredentials: true }
            );
            getBookLists();
        } catch (err) {
            console.error("Adding Book failed:", err);
            setError("Failed to add book. Please try again.");
        }
    };

    const removeBookFromList = async (list_id) => {
        try {
            const URL = "http://localhost:5000/lists/remove";
            await axios.post(
                URL,
                { list_id, book: activeBook },
                { withCredentials: true }
            );
            getBookLists();
        } catch (err) {
            console.error("Removing Book failed:", err);
            setError("Failed to remove book. Please try again.");
        }
    };

    const deleteList = async (list_id) => {
        try {
            const URL = "http://localhost:5000/lists/delete";
            await axios.post(URL, { list_id }, { withCredentials: true });
            getBookLists();
        } catch (err) {
            console.error("Deleting list failed:", err);
            setError("Failed to delete list. Please try again.");
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

    const List = ({ list_name, book_count, list_id, books }) => {
        const alreadyAdded = books?.some((book) => book.id === activeBook.id);

        return (
            <div className="flex items-center p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl shadow-sm transition hover:bg-[var(--primary)]/20">
                <div className="flex flex-col text-[var(--primary)]">
                    <h3 className="text-lg inter-semibold">{list_name}</h3>
                    <p className="text-sm opacity-70">
                        {book_count ? `${book_count} books` : "No books added"}
                    </p>
                </div>

                <div className="ml-auto flex gap-2">
                    {!alreadyAdded ? (
                        <Button
                            type="primary"
                            icon={<Plus />}
                            label="Add"
                            onClick={() => addBookToList(list_name, list_id)}
                        />
                    ) : (
                        <Button
                            type="secondary"
                            label="Remove"
                            onClick={() => removeBookFromList(list_id)}
                        />
                    )}
                    <Button
                        type="iconed"
                        className="p-3"
                        icon={<Trash />}
                        onClick={() => deleteList(list_id)}
                    />
                </div>
            </div>
        );
    };

    return (
        !hidePopup && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <div
                    ref={popupRef}
                    className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-6 animate-fadeIn"
                >
                    <h2 className="text-2xl inter-semibold text-[var(--primary)] text-center">
                        Add To List
                    </h2>

                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}

                    {bookLists && bookLists.length > 0 ? (
                        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {bookLists.map((list, i) => (
                                <List
                                    key={i}
                                    list_name={list.list_name}
                                    book_count={list.books.length}
                                    list_id={list.list_id}
                                    books={list.books}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 mt-6">
                            <img
                                src={NoDataImage}
                                alt="No lists"
                                className="w-24 h-24 opacity-70"
                            />
                            <p className="text-gray-500 text-sm text-center">
                                No lists created yet. Create a new list to start
                                adding books.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-4">
                        <h3 className="text-xl inter-semibold text-[var(--primary)]">
                            Create New List
                        </h3>
                        <div className="flex gap-3 items-center">
                            <Input
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="List name"
                            />
                            <Button
                                onClick={createBookList}
                                type="primary"
                                icon={<Plus />}
                                label="Create"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddToListPopup;
