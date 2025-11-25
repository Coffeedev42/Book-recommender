import React, { useState } from "react";
import SiginToggleComponent from "../components/SiginToggleComponent";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { EyeIcon } from "lucide-react";
import toast from "react-hot-toast";

const SigninPage = () => {
    const [signinMethod, setSiginMethod] = useState("Login");
    const navigate = useNavigate();

    const avatars = [
        {
            url: "https://api.dicebear.com/9.x/lorelei/png?seed=Avery",
        },
        {
            url: "https://api.dicebear.com/9.x/lorelei/png?seed=George",
        },
        {
            url: "https://api.dicebear.com/9.x/lorelei/svg?seed=Brian",
        },
        {
            url: "https://api.dicebear.com/9.x/lorelei/svg?seed=Jameson",
        },
        {
            url: "https://api.dicebear.com/9.x/lorelei/svg?seed=Nolan",
        },
    ];

    const [registerValues, setRegisterValues] = useState({
        name: "",
        email: "",
        password: "",
        comfirm_password: "",
        avatar_url: avatars[0].url, // ✅ new field
    });

    const [loginValues, setLoginValues] = useState({
        email: "",
        password: "",
    });

    const handleRegister = async () => {
        if (registerValues.password !== registerValues.comfirm_password) {
            toast.error("Passwords don't match!");
            return;
        }

        try {
            const URL = "http://localhost:5000/register";
            const response = await axios.post(URL, registerValues);

            if (response.status === 200) {
                setRegisterValues({
                    name: "",
                    email: "",
                    password: "",
                    comfirm_password: "",
                    avatar_url: "",
                });
                toast.success("Registered successfully! Please login.");
                setSiginMethod("Login");
            }
        } catch (error) {
            // Handle backend errors
            const message =
                error.response?.data?.message ||
                "Registration failed. Try again.";
            toast.error(message);
        }
    };

    const handleLogin = async () => {
        try {
            const URL = "http://localhost:5000/login";
            await axios.post(URL, loginValues, { withCredentials: true });
            toast.success("Login successful!");
            navigate("/", { replace: true }); // replace prevents back navigation
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Login failed. Check your credentials.";
            toast.error(message);
        }
    };

    return (
        <div className="flex bg-gray-100 w-[100vw] items-center justify-center flex-col h-[100vh]">
            <div className="flex flex-col h-[400px] w-[440px] max-w-[440px] gap-[30px]">
                <SiginToggleComponent
                    setMethod={setSiginMethod}
                    selected={signinMethod}
                />

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-[15px] w-full bg-white p-5 border border-gray-200 rounded-2xl"
                >
                    {signinMethod === "Login" ? (
                        <>
                            <Input
                                autofocus={true}
                                value={loginValues.email}
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) =>
                                    setLoginValues({
                                        ...loginValues,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <Input
                                value={loginValues.password}
                                placeholder="Enter your password"
                                secure
                                onChange={(e) =>
                                    setLoginValues({
                                        ...loginValues,
                                        password: e.target.value,
                                    })
                                }
                                icon={<EyeIcon />}
                            />
                            <Button label="Login" onClick={handleLogin} />
                        </>
                    ) : (
                        <>
                            <div className="flex gap-3 justify-center mt-2">
                                {avatars.map(({ url }, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={"avatar"}
                                        onClick={() => {
                                            setRegisterValues({
                                                ...registerValues,
                                                avatar_url: url,
                                            });
                                        }}
                                        className={`w-16 h-16 rounded-full cursor-pointer transition ease-in 
                                        ${
                                            registerValues.avatar_url === url
                                                ? "bg-[#ff915b] p-0"
                                                : "bg-transparent p-2"
                                        }`}
                                    />
                                ))}
                            </div>

                            <Input
                                autofocus={true}
                                value={registerValues.name}
                                type="text"
                                placeholder="Enter your full name"
                                onChange={(e) =>
                                    setRegisterValues({
                                        ...registerValues,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <Input
                                value={registerValues.email}
                                type="text"
                                placeholder="Enter your email"
                                onChange={(e) =>
                                    setRegisterValues({
                                        ...registerValues,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <Input
                                value={registerValues.password}
                                placeholder="Create a password"
                                secure
                                onChange={(e) =>
                                    setRegisterValues({
                                        ...registerValues,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Confirm password"
                                secure
                                onChange={(e) =>
                                    setRegisterValues({
                                        ...registerValues,
                                        comfirm_password: e.target.value,
                                    })
                                }
                            />
                            <Button onClick={handleRegister} label="Register" />
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SigninPage;
