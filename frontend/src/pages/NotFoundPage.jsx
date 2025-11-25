// NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../assets/404.png";

const NotFoundPage = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center gap-4 justify-center">
            <img className="h-[250px]" src={NotFoundImage} alt="" />
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;
