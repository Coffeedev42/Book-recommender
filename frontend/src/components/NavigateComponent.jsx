import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NavigateComponent = ({ step, path, steps }) => {
    return (
        <div className="flex items-center justify-center relative py-3">
            {/* Steps dynamically rendered */}
            <div className="flex items-center gap-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const active = step === stepNumber;

                    return (
                        <React.Fragment key={index}>
                            <div className="flex items-center gap-2">
                                {/* Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                    ${
                                        active
                                            ? "bg-[#E48534] text-white"
                                            : "bg-gray-100 text-gray-300 border border-gray-200"
                                    }`}
                                >
                                    {String(stepNumber).padStart(2, "0")}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-md ${
                                        active
                                            ? "text-[#E48534]"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Arrow (only between steps) */}
                            {index < steps.length - 1 && (
                                <ArrowRight
                                    className="text-gray-400"
                                    size={18}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default NavigateComponent;
