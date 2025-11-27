import client from "./client";

export const getRecommendations = async (profile, count) => {
    const response = await client.post("/recommend", {
        profile,
        rec_count: count,
    });
    return response.data;
};

export const dummyRecommend = async (profile, count) => {
    const response = await client.post("/dummy-recommend", {
        profile,
        rec_count: count,
    });
    return response.data;
};
