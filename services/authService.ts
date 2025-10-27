import useAuthStore from "../store/useAuthStore";
import { SignUpData } from "../types/data";
import apiClient from "./apiClient";

export const handleSignup = async (registrationData: SignUpData) => {
    const names = registrationData.fullName.split(" ");
    const form = {
        firstName: names[0],
        lastName: names[names.length - 1],
        email: registrationData.email,
        phoneNumber: registrationData.phoneNumber,
        gender: registrationData.gender,
        dateOfBirth: registrationData.dateOfBirth,
        password: registrationData.password,
    };
    try {
        const response = await apiClient.post("/user/register", form);

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
            error.response?.data || error.message
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
            data
        );

        if (response.data.status === "success") {
            console.log("Resend token successful:", response.data.message);
            return { success: true, message: response.data.message };
        } else {
        }
    } catch (error: any) {
        console.error(
            "Resend token error:",
            error.response?.data || error.message
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
