// NotFoundPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NotFoundImage from "../assets/404.png";
import Button from "../components/Button";

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-screen flex flex-col items-center gap-4 justify-center">
            <img className="h-[300px]" src={NotFoundImage} alt="" />
            <p>The page you are looking for does not exist</p>
            <Button
                type="secondary"
                label={"Go To Homepage"}
                onClick={(e) => {
                    navigate("/");
                }}
            />
        </div>
    );
};

export default NotFoundPage;
