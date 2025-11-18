import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
const BookSearchComponent = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [error, setError] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [infoBook, setInfoBook] = useState({});

  const [showSearch, setShowSearch] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const searchDivRef = useRef(null);
  const infoDivRef = useRef(null);

  useEffect(() => {
    const handleClickOut = (e) => {
      if (searchDivRef.current && !searchDivRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOut);

    return () => document.removeEventListener("mousedown", handleClickOut);
  }, []);
  useEffect(() => {
    const handleClickOut = (e) => {
      if (infoDivRef.current && !infoDivRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOut);

    return () => document.removeEventListener("mousedown", handleClickOut);
  }, []);

  try {
    useEffect(() => {
      const fetchBooks = async () => {
        if (searchTerm !== "") {
          await axios
            .get(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                searchTerm
              )}`
            )
            .then((data) => setBooks(data.data.items));
        }
      };
      fetchBooks();
    }, [searchTerm]);
  } catch (error) {
    setError(true);
  }

  console.log(books);

  return;
};

export default BookSearchComponent;
