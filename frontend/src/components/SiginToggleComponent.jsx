import React from "react";

const SiginToggleComponent = ({ setMethod, selected }) => {
    const ToggleButton = ({ method }) => {
        return (
            <h2
                onClick={() => setMethod(method)}
                className={`flex cursor-pointer
      w-max px-20 p-2 inter-medium text-xl text-[#522614] items-center justify-center ${
          method === selected &&
          `relative 
     after:content-[""] after:bg-[#D55414]   after:absolute after:w-[60%] after:p-[3px]
      after:rounded-full after:-bottom-1`
      } `}
            >
                {method}
            </h2>
        );
    };
    return (
        <div className="flex gap-2 border-b-2 items-center justify-center border-b-[#EFEFEF] ">
            <ToggleButton method={`Login`} />
            <ToggleButton method={`Register`} />
        </div>
    );
};

export default SiginToggleComponent;
