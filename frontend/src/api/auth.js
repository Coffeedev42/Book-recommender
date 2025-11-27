import client from "./client";

export const login = async (email, password) => {
    const response = await client.post("/login", { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await client.post("/register", userData);
    return response.data;
};

export const logout = async () => {
    const response = await client.post("/logout");
    return response.data;
};

export const getProfile = async () => {
    const response = await client.post("/auth/profile");
    return response.data;
};

export const checkAuth = async () => {
    const response = await client.post("/auth/check");
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await client.get(`/verify-email/${token}`);
    return response.data;
};
