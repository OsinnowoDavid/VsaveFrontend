import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// The Base URL should be stored in an environment variable
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
});

console.log("API Client configured with Base URL:", BASE_URL);

// Request Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        console.error("API Request Error Details:", JSON.stringify({
            message: error.message,
            code: error.code,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                timeout: error.config?.timeout
            },
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : "No Response"
        }, null, 2));
        return Promise.reject(error);
    }
);

export default apiClient;
