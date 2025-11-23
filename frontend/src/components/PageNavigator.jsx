import React from "react";
import { Link } from "react-router-dom";

const PageNavigator = ({ path }) => {
  return (
    <Link to={path}>
      <div
        className="flex cursor-pointer   hover:scale-110 transition-all  text-white
       w-[80px] h-[80px] items-center justify-center p-5 bg-[#B9562D] rounded-full"
      >
        <p className="text-lg">Next</p>
      </div>
    </Link>
  );
};

export default PageNavigator;
