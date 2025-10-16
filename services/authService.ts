import useAuthStore from "../store/useAuthStore";
import apiClient from "./apiClient";

export const handleSignup = async (registrationData: any) => {
    try {
        const response = await apiClient.post(
            "/user/register",
            registrationData,
        );

        if (response.data.status === "success") {
            console.log("Signup successful:", response.data.message);
            return { success: true, data: response.data };
        } else {
            // This case might occur if the server returns 2xx but with an error status
            return {
                success: false,
                message: response.data.message || "An unknown error occurred.",
            };
        }
    } catch (error: any) {
        console.error("Signup error:", error.response?.data || error.message);
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during registration. Please try again.";
        return { success: false, message: errorMessage };
    }
};

export const verifyEmail = async (data: { email: string; token: string }) => {
    try {
        const response = await apiClient.post("/user/verify-email", data);
        if (response.data.status === "success") {
            return { success: true, message: response.data.message };
        } else {
            return {
                success: false,
                message: response.data.message || "An unknown error occurred.",
            };
        }
    } catch (error: any) {
        console.error(
            "Email verification error:",
            error.response?.data || error.message,
        );
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during verification. Please try again.";
        return { success: false, message: errorMessage };
    }
};

export const resendVerificationToken = async (data: { email: string }) => {
    try {
        const response = await apiClient.post(
            "/user/resend-verification-token",
            data,
        );

        if (response.data.status === "success") {
            console.log("Resend token successful:", response.data.message);
            return { success: true, message: response.data.message };
        } else {
        }
    } catch (error: any) {
        console.error(
            "Resend token error:",
            error.response?.data || error.message,
        );
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while resending the token.";
        return { success: false, message: errorMessage };
    }
};

export const handleSignin = async (form: {
    email: string;
    password: string;
}): Promise<{ success: boolean; message?: string }> => {
    const login = useAuthStore.getState().login;
    try {
        const response = await apiClient.post("/user/login", form);

        console.log("Signin response:", response.data);

        if (response.data && response.data.status === "success") {
            login(response.data.token); // Save token to Zustand store
            return { success: true };
        } else {
            return {
                success: false,
                message:
                    response.data.message || "Login failed. Please try again.",
            };
        }
    } catch (error: any) {
        console.error("Signin error:", error.response?.data || error.message);
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during login. Please try again.";
        return { success: false, message: errorMessage };
    }
};
