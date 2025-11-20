import React from "react";

const NavigateComponenet = ({ step }) => {

  const steps = [1, 2, 3]
  const NavigateBeads = ({ passed }) => {
    return (
      <div
        className={`flex z-5 items-center justify-center w-4 h-4 rounded-full ${
          passed ? `bg-white` : `bg-[#E19F84]`
        }`}
      >
        {!passed && (
          <div className="flex w-2.5 h-2.5 rounded-full bg-[#B9562D]"></div>
        )}
      </div>
    );
  };


  return (
    <div className="flex w-full fixed top-0 h-max  items-center justify-center ">
      <div className="bg-[#B9562D] px-5 pt-3 pb-4  rounded-b-3xl  flex items-center justify-center text-white">
        <div className="flex items-center justify-center gap-[12px] relative">
          {
            steps.map((s, i) => (
              <NavigateBeads key={i} passed={step === s && true }/>
            ))
          }
          <div className="flex w-full h-0.5 bg-[#E19F84] absolute "></div>
        </div>
      </div>
    </div>
  );
};

export default NavigateComponenet;
