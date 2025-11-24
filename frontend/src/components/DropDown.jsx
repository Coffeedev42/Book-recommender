import { ChevronDown } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const DropDown = ({ options, selectedOption, onSelect, placeholder }) => {
    const [showMenu, setShowMenu] = useState(false);
    const dropDownRef = useRef(null);

    const handleSelect = (option) => {
        onSelect(option);
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={dropDownRef} className="relative w-full">
            <div
                onClick={() => setShowMenu((s) => !s)}
                className="w-full bg-white flex items-center border border-[#522614] rounded-[60px] py-[10px] px-[20px] text-[#522614] cursor-pointer"
            >
                <p>{selectedOption || placeholder}</p>
                <ChevronDown className="ml-auto" />
            </div>

            {showMenu && (
                <div className="absolute top-full z-20 w-full bg-white border border-gray-200 rounded-md mt-1">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropDown;
