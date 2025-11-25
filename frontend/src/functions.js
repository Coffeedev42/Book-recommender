import axios from "axios";

const GetUserProfile = async (setter) => {
    try {
        const URL = "http://localhost:5000/auth/profile";
        const res = await axios.post(
            URL,
            {},
            {
                withCredentials: true,
            }
        );
        return setter(res.data.profile);
    } catch (error) {
        console.error("Fetching Profile Failed: ", error);
    }
};

export { GetUserProfile };
