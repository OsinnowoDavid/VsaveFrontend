import { router } from "expo-router";
import { Alert } from "react-native";
import useAuthStore from "../store/useAuthStore";
import { SignUpData } from "../types/data";
import apiClient from "./apiClient";
import { getKYCStatus } from "./kycService";

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
        console.log("Signup response:", response);

        if (response.data.status?.toLowerCase?.() === "success") {
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
        const errorMessage =
            error.response?.data?.message ||
            "An unexpected error occurred. Please try again.";
        console.log(error)
        return { success: false, message: errorMessage };
    }
};

export const verifyEmail = async (data: { email: string; code: string }) => {
    try {
        const response = await apiClient.post("/user/verify-email", data);
        console.log("Email verification response:", response);

        if (response.data.status.toLowerCase() === "success") {
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
}): Promise<{
    success: boolean;
    message?: string;
    isEmailVerified?: boolean;
}> => {
    const login = useAuthStore.getState().login;
    try {
        const response = await apiClient.post("/user/login", form);
        console.log("Login response:", response.data);

        if (
            response.data &&
            response.data.status?.toLowerCase?.() === "success"
        ) {
            await login(response.data.token); // Save token to Zustand store

            // After login, fetch the user's KYC status
            const kycResponse = await getKYCStatus();

            // Check KYC status and redirect accordingly
            if (
                kycResponse.success &&
                (kycResponse.status === "pending" ||
                    kycResponse.status === "failed")
            ) {
                Alert.alert(
                    "KYC Required",
                    "Please complete your KYC verification to continue."
                );
                router.replace("/auth/kyc");
            } else {
                router.replace("/home");
            }

            return {
                success: true,
                isEmailVerified: response.data.isEmailVerified,
            };
        } else {
            return {
                success: false,
                message:
                    response.data.message || "Login failed. Please try again.",
                isEmailVerified: response.data.isEmailVerified,
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
