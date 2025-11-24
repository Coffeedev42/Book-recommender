import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NavigateComponent = ({ step, path }) => {
    const steps = [1, 2, 3];

    const NavigateBeads = ({ passed }) => (
        <div
            className={`flex z-5 items-center justify-center w-4 h-4 rounded-full ${
                passed ? "bg-white" : "bg-[#E19F84]"
            }`}
        >
            {!passed && (
                <div className="flex w-2.5 h-2.5 rounded-full bg-[#B9562D]"></div>
            )}
        </div>
    );

    const NavigationButton = ({ path }) => (
        <Link className="absolute top-1 flex mr-40" to={path}>
            <button
                className="border hover:bg-gray-100/50 cursor-pointer active:bg-gray-100 
                   border-[#B9562D] rounded-full p-[5px]"
            >
                <ArrowLeft size={18} color="#B9562D" />
            </button>
        </Link>
    );

    return (
        <>
            {step > 1 && <NavigationButton path={path} />}
            <div
                className="bg-[#B9562D] px-5 pt-3 pb-4 absolute top-0 rounded-b-3xl 
                   flex items-center justify-center text-white"
            >
                <div className="flex items-center justify-center gap-[12px] relative">
                    {steps.map((s, i) => (
                        <NavigateBeads key={i} passed={step === s && true} />
                    ))}
                    <div className="flex w-full h-0.5 bg-[#E19F84] absolute"></div>
                </div>
            </div>
        </>
    );
};

export default NavigateComponent;
