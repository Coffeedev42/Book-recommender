import React from "react";
import { LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/logout",
                {},
                { withCredentials: true }
            );

            navigate("/login"); // ✅ redirect after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div
            onClick={handleLogout}
            className="bg-red-200 w-12 h-12 absolute top-14 rounded-full p-2 flex items-center 
            justify-center text-white cursor-pointer"
        >
            <LogOut className="text-red-700" />
        </div>
    );
}

export default LogoutButton;
