import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add response interceptor for global error handling
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optional: Handle 401 globally if needed, though we handle it in components/context too
        // if (error.response && error.response.status === 401) {
        //     // Redirect to login or clear state
        // }
        return Promise.reject(error);
    }
);

export default client;
