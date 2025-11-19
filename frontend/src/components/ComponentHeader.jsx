import React from "react";

const ComponentHeader = ({ topic, subtopic }) => {
  return (
    <div className="flex flex-col gap-[5px]">
      <h2 className="text-[#B9562D] inter-medium text-2xl">{topic}</h2>
      <p className="text-[#522614]  ">{subtopic}</p>
    </div>
  );
};

export default ComponentHeader;
