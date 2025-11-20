import { ChevronDown } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context/ContextProvider";
const CatergoryInput = ({ cats }) => {
  const [selected, setSelected] = useState(cats[0]);
  const [showMenu, setShowMenu] = useState(false);
  const dropDoenRef = useRef(null);

  const { prefferdMood, setPrefferdMood } = useContext(Context);
  const { booksLength, setBooksLength } = useContext(Context);

  const {booksLengthList, setBooksLengthList} = useContext(Context)
  const {prefferdMoodList, setPrefferdMoodList} = useContext(Context)

  

  const DropDown = ({ option, index }) => {
    return (
      <div className="flex  flex-col w-full border-b border-gray-200">
        <div
          onClick={() => {
            setSelected(option)
            
            if(prefferdMoodList.includes(option)){
              setPrefferdMood(option)
            }
            
            if(booksLengthList.includes(option)){
              setBooksLength(option)
            }
          
            
          }}
          className={`flex w-full hover:bg-gray-100/80 p-2 bg-white ${
            index === 0 && `rounded-t-md`
          } ${option === cats[cats.length - 1] && `rounded-b-md `} `}
        >
          <p>{option}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropDoenRef.current && !dropDoenRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      onClick={() => setShowMenu((s) => !s)}
      className="flex relative  w-100 flex-col gap-2  cursor-pointer"
    >
      <div className="w-full bg-white  flex items-center  border border-[#522614] rounded-[60px] py-[15px] px-[26px] text-[#522614]">
        <p>{selected}</p>
        <ChevronDown className="ml-auto" />
      </div>
      {showMenu && (
        <>
        
        <div
          ref={dropDoenRef}
          className="flex absolute top-full z-20 w-full flex-col  bg-white border border-gray-200 rounded-md border-b-0 "
        >
          {cats.map((c, i) => (
            <DropDown key={i} option={c} index={i} />
          ))}
        </div>


        </>
      )}
    </div>
  );
};

export default CatergoryInput;
