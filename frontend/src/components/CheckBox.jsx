import { useContext } from "react";
import { Check } from "lucide-react";
import { Context } from "../context/ContextProvider";

const CheckBox = ({ cat, type, handleSelect }) => {
    const { favGenres, constraints, preferredMood, booksLength } =
        useContext(Context);

    const isSelected = (() => {
        switch (type) {
            case "fav":
                return favGenres.includes(cat);
            case "mood":
                return preferredMood === cat;
            case "length":
                return booksLength === cat;
            case "constraints":
                return constraints.includes(cat);
            default:
                return false;
        }
    })();

    return (
        <div
            className="flex items-center cursor-pointer justify-center w-max gap-[8px]"
            onClick={() => handleSelect(cat)}
        >
            <div
                className={`w-[20px] h-[20px] border border-[#522614] rounded-md flex items-center justify-center
                ${isSelected ? "bg-[#B9562D]" : "bg-[#EDCABB]"}`}
            >
                {isSelected && <Check className="text-white" size={18} />}
            </div>
            <p className="text-[#522614] text-nowrap">{cat}</p>
        </div>
    );
};

export default CheckBox;
