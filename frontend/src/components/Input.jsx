import { EyeClosed, EyeIcon } from "lucide-react";
import React, { useState } from "react";

const Input = ({ value, onChange, placeholder, secure, type, autofocus }) => {
    const [hide, setHide] = useState(true);
    return (
        <div className="flex items-center w-full px-[26px] max-h-[56px] py-[18px] border border-[#522614] rounded-xl">
            <input
                autoFocus={autofocus}
                value={value}
                onChange={onChange}
                type={secure && hide ? `password` : type}
                placeholder={placeholder}
                className="outline-0 h-full w-full text-[#522614] "
            />

            {secure &&
                (hide ? (
                    <EyeIcon
                        onClick={() => setHide((h) => !h)}
                        className="text-[#522614] ml-auto cursor-pointer"
                        size={24}
                    />
                ) : (
                    <EyeClosed
                        onClick={() => setHide((h) => !h)}
                        className="text-[#522614] ml-auto cursor-pointer"
                        size={24}
                    />
                ))}
        </div>
    );
};

export default Input;
