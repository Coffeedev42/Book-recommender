import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const verify = async () => {
            try {
                const data = await verifyEmail(token);
                setStatus("success");
                setMessage(data.message);
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.error || "Verification failed.");
            }
        };
        verify();
    }, [token]);

    // Auto-redirect countdown for success
    useEffect(() => {
        if (status === "success") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate("/login");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, navigate]);

    return (
        <div className="flex bg-gray-100 w-full items-center justify-center flex-col h-screen">
            <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full text-center">
                {status === "verifying" && (
                    <>
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                        <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h1 className="text-2xl font-bold mb-2 text-green-600">Email Successfully Verified!</h1>
                        <p className="text-gray-700 mb-4">{message}</p>
                        <p className="text-sm text-gray-500 mb-6">
                            Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#D55414] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#B9562D] transition"
                        >
                            Login Now
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h1 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h1>
                        <p className="text-gray-700 mb-6">{message}</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#D55414] text-white px-6 py-2 rounded-lg hover:bg-[#B9562D] transition"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
