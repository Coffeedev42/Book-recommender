import { useContext } from "react";
import { Context } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut } from "lucide-react";

function LogoutButton() {
    const navigate = useNavigate();
    const { resetContext } = useContext(Context); // ✅ get reset function

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/logout",
                {},
                { withCredentials: true }
            );

            resetContext(); // ✅ reset all context state
            navigate("/login", { replace: true }); // ✅ prevent back navigation
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div
            title="Logout"
            onClick={handleLogout}
            className="bg-red-200 w-8 h-8 rounded-md p-2 flex items-center 
      justify-center text-white cursor-pointer ml-3"
        >
            <LogOut className="text-red-700" />
        </div>
    );
}

export default LogoutButton;
