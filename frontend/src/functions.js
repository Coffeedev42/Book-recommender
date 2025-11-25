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
        setter(res.data.profile);
        return res.data.profile;
    } catch (error) {
        return { success: false, message: "Fetching Profile Failed" };
    }
};

const GetBookRecommendations = async (profile, count) => {
    const payload = {
        profile: profile,
        rec_count: count,
    };

    let recommendedBooks = [];

    try {
        const URL = "http://localhost:5000/recommend";
        const res = await axios.post(URL, payload, {
            withCredentials: true,
        });

        if (res.data && res.data.results && res.data.results.length > 0) {
            recommendedBooks = res.data.results;
            return {
                success: true,
                books: recommendedBooks,
                message: "Recommendations are ready!",
            };
        } else {
            return {
                success: false,
                message: "Failed Getting Recommendations!",
            };
        }
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to generate recommendations.",
        };
    }
};

export { GetUserProfile, GetBookRecommendations };
