import React, { useContext } from "react";
import CatergoryCard from "./CatergoryCard";
import { Context } from "../context/ContextProvider";

const FavGenreCatogories = () => {
  const { favGenres, setFavGenres } = useContext(Context);
  const catergories = [
    "Philosophy",
    "Horror",
    "Feel Good",
    "Fictional",
    "Biography",
    "Series",
    "Dramas",
    "fdfd",
    "dfd",
    "sffdgf",
  ];

  const handleAddCat = (cat) => {
    setFavGenres(prev => [...prev, cat])

    const repeated = favGenres.filter((a) => a === cat);
    

    if (repeated.includes(cat)) {
      setFavGenres(favGenres.filter(a => a !== cat))
    }
    

    
  };
  return (
    <div className="flex flex-col pb-[24px] border-b  border-b-[#522614]/20  ">
      <div
        className="grid grid-cols-5 gap-y-[18px]
    gap-[30px] justify-center items-center w-max"
      >
        {catergories.map((c, i) => (
          <CatergoryCard key={i} cat={c} handleAddCat={handleAddCat} />
        ))}
      </div>
    </div>
  );
};

export default FavGenreCatogories;
