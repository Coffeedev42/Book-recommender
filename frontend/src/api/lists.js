import client from "./client";

export const getLists = async () => {
    const response = await client.get("/lists");
    return response.data;
};

export const createList = async (listName) => {
    const response = await client.post("/lists", { list_name: listName });
    return response.data;
};

export const addBookToList = async (listName, listId, book) => {
    const response = await client.post("/lists/add", {
        list_name: listName,
        list_id: listId,
        book,
    });
    return response.data;
};

export const removeBookFromList = async (listId, book) => {
    const response = await client.post("/lists/remove", {
        list_id: listId,
        book,
    });
    return response.data;
};

export const getBooksFromList = async (listId) => {
    const response = await client.get(`/lists/books?list_id=${listId}`);
    return response.data;
};

export const deleteList = async (listId) => {
    const response = await client.post("/lists/delete", { list_id: listId });
    return response.data;
};
