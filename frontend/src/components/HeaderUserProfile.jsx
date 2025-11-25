import Credit from "../assets/credit.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import { GetUserProfile } from "../functions";
import { Context } from "../context/ContextProvider";

function HeaderUserProfile({ className }) {
    const { profile, setProfile } = useContext(Context);

    useEffect(() => {
        GetUserProfile(setProfile);
    }, []);

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <img
                src={profile.avatar_url}
                className="h-14 pr-2 border-r-1 border-gray-200"
                alt="avatar"
            />
            <div className="flex flex-col">
                <p>{profile.name || "loading..."}</p>
                <div
                    title="credit balance"
                    className="flex items-center gap-0.5 text-[#E48534]"
                >
                    <img src={Credit} className="h-5 " alt="" />
                    <p className="text-sm">
                        {profile.credit_limit || "loading..."}
                    </p>
                </div>
            </div>
            <LogoutButton />
        </div>
    );
}

export default HeaderUserProfile;
