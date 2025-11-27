import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/auth";

const ProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState("checking");
    // "checking" | "authenticated" | "unauthorized"

    useEffect(() => {
        checkAuth()
            .then(() => setAuthState("authenticated"))
            .catch(() => setAuthState("unauthorized"));
    }, []);

    if (authState === "checking") {
        return (
            <div className="w-screen h-screen flex items-center justify-center text-white text-2xl">
                Loading...
            </div>
        );
    }

    if (authState === "unauthorized") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
