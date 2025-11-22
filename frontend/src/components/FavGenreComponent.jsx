import React from "react";
import FavGenreCatogories from "./FavGenreCatogories";
import ComponentHeader from "./ComponentHeader";

const FavGenreComponent = () => {
  return (
    
      <div className="flex justify-center flex-col  gap-[35px] p-b-2xl ">
        <ComponentHeader topic={`Favourite Genres`} subtopic={`Select your favourite genres`}/>
        <FavGenreCatogories/>
      </div>
    
  );
};

export default FavGenreComponent;
