import React from "react";
import CatergoryInput from "./CatergoryInput";

const SelectCatergoryComponent = ({ label, cats }) => {
  return (
    <div className="flex flex-col w-full pb-[24px] border-b border-b-[#522614]/20  ">
      <div className="flex  items-center ">
        <h2 className="text-[#B9562D] w-100 inter-medium text-2xl">{label}:</h2>
        <CatergoryInput cats={cats} />
      </div>
    </div>
  );
};

export default SelectCatergoryComponent;
