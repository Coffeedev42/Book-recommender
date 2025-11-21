import React, { useState } from "react";
import SiginToggleComponent from "../components/SiginToggleComponent";
import Input from "../components/Input";
import Button from "../components/Button";

const SigninPage = () => {
  const [signinMethod, setSiginMethod] = useState("Login");
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

        <div className="flex flex-col gap-[15px] w-full bg-white p-5 border border-[#F0F0F0] rounded-2xl">
          {signinMethod === "Login" ? (
            <>
              <Input type={`email`} placeholder={`Enter your email`} />
              <Input placeholder={`Enter your password`} secure={true} />
              <button className="w-full hover:bg-[#B9562D]/90 transition-all active:bg-[#B9562D]/95 cursor-pointer py-[15px] bg-[#B9562D] rounded-xl text-white">
                Register
              </button>
            </>
          ) : (
            <>
              <Input type={`text`} placeholder={`Enter your full name`} />
              <Input type={`email`} placeholder={`Enter your email`} />
              <Input placeholder={`Create a password`} secure={true} />
              <Input placeholder={`Confirm password`} secure={true} />
              <button className="w-full hover:bg-[#B9562D]/90 transition-all active:bg-[#B9562D]/95 cursor-pointer py-[15px] bg-[#B9562D] rounded-xl text-white">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
