import { ChevronDown, Check } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";

const DropDown = ({
    options,
    selectedOption,
    onSelect,
    placeholder,
    searchable = false,
    showLimit = 5,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [searchText, setSearchText] = useState("");
    const dropDownRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const handleSelect = (option) => {
        onSelect(option);
        setShowMenu(false);
        setSearchText("");
    };

    const handleSearchChange = (e) => setSearchText(e.target.value);

    // Close dropdown when clicking outside
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

    // Calculate position for portal
    useEffect(() => {
        if (showMenu && dropDownRef.current) {
            const rect = dropDownRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [showMenu]);

    const filteredOptions = searchable
        ? options.filter((o) =>
              o.toLowerCase().includes(searchText.toLowerCase())
          )
        : options;

    const optionHeight = 40;
    const maxHeight = showLimit * optionHeight;

    return (
        <div ref={dropDownRef} className="relative w-full">
            <div
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-full bg-white flex items-center border border-[#522614] rounded-[60px] py-[10px] px-[20px] text-[#522614] cursor-pointer"
            >
                <p>{selectedOption || placeholder}</p>
                <ChevronDown className="ml-auto" />
            </div>

            {showMenu &&
                ReactDOM.createPortal(
                    <div
                        className="absolute z-50 bg-white border border-gray-200 rounded-md overflow-y-auto shadow-lg"
                        style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                            width: menuPosition.width,
                            maxHeight,
                        }}
                        // Prevent clicks inside the portal from closing immediately
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {searchable && (
                            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    placeholder="Search..."
                                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none"
                                />
                            </div>
                        )}

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className={`flex items-center justify-between gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                                        option === selectedOption
                                            ? "bg-gray-200 font-medium text-[#B9562D]"
                                            : ""
                                    }`}
                                >
                                    {option === selectedOption && (
                                        <Check className="w-5 h-5 text-[#B9562D]" />
                                    )}
                                    <span className="flex-1">{option}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-400">
                                No results found
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default DropDown;
