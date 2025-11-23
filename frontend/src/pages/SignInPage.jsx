import React, { useState } from "react";
import SiginToggleComponent from "../components/SiginToggleComponent";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { EyeIcon } from "lucide-react";

const SigninPage = () => {
  const [signinMethod, setSiginMethod] = useState("Login");
  const navigate = useNavigate();

  const [registerValues, setRegisterValues] = useState({
    name: "",
    email: "",
    password: "",
    comfirm_password: "",
  });

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    const URL = "http://localhost:5000/register";

    const response = await axios.post(URL, registerValues);

    if (registerValues.password !== registerValues.comfirm_password) {
      alert("Passwords don't match!");
      return false;
    }

    if (response.status == 200) {
      setRegisterValues({
        name: "",
        email: "",
        password: "",
        comfirm_password: "",
      });
      setSiginMethod("Login");
    }
  };

  const handleLogin = async () => {
    try {
      const URL = "http://localhost:5000/login";
      const response = await axios.post(URL, loginValues, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="flex bg-[url('./assets/cover.png')] w-[100vw] bg-cover bg-no-repeat
    items-center justify-center flex-col gap- h-[100vh] "
    >
      <div className="flex flex-col h-[400px]  w-[440px] max-w-[440px] gap-[30px]">
        <SiginToggleComponent
          setMethod={setSiginMethod}
          selected={signinMethod}
        />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-[15px] w-full bg-white 
          p-5 border border-[#F0F0F0] rounded-2xl"
        >
          {signinMethod === "Login" ? (
            <>
              <Input
                value={loginValues.email}
                type={`email`}
                placeholder={`Enter your email`}
                onChange={(e) => {
                  setLoginValues({
                    ...loginValues,
                    email: e.target.value,
                  });
                }}
              />
              <Input
                value={loginValues.password}
                placeholder={`Enter your password`}
                secure={true}
                onChange={(e) => {
                  setLoginValues({
                    ...loginValues,
                    password: e.target.value,
                  });
                }}
                icon={<EyeIcon />}
              />

              <Button label={`Login`} onClick={handleLogin} />
            </>
          ) : (
            <>
              <Input
                value={registerValues.name}
                type={`text`}
                placeholder={`Enter your full name`}
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    name: e.target.value,
                  });
                }}
              />
              <Input
                value={registerValues.email}
                type={`text`}
                placeholder={`Enter your email`}
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    email: e.target.value,
                  });
                }}
              />
              <Input
                value={registerValues.password}
                placeholder={`Create a password`}
                secure={true}
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    password: e.target.value,
                  });
                }}
              />
              <Input
                placeholder={`Confirm password`}
                secure={true}
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    comfirm_password: e.target.value,
                  });
                }}
              />

              <Button onClick={handleRegister} label={"Register"} />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
