import { router } from "expo-router";
import { Alert } from "react-native";
import useAuthStore from "../store/useAuthStore";
import { SignUpData } from "../types/data";
import apiClient from "./apiClient";
// import { getKYCStatus } from "./kycService";
export const handleSignup = async (registrationData: SignUpData) => {
    // 1. Validate input
    if (!registrationData.email || !registrationData.password) {
        return { 
            success: false, 
            message: "Email and password are required" 
        };
    }

    // 2. Better name parsing (or better: collect separate firstName/lastName)
    const names = registrationData.fullName.trim().split(/\s+/);
    const firstName = names[0] || "";
    const lastName = names.length > 1 ? names.slice(1).join(" ") : "";
    
    const form = {
        firstName: firstName,
        lastName: lastName || firstName, // Fallback for single-name entries
        email: registrationData.email.toLowerCase().trim(),
        phoneNumber: registrationData.phoneNumber?.trim() || "",
        gender: registrationData.gender,
        dateOfBirth: registrationData.dateOfBirth,
        password: registrationData.password,
    };

    // 3. Optional: Password strength validation
    if (form.password.length < 8) {
        return {
            success: false,
            message: "Password must be at least 8 characters long"
        };
    }

    try {
        const response = await apiClient.post("/user/register", form);
        
        // 4. Secure logging - only log non-sensitive data
        console.log("Signup attempt for:", form.email);
        
        if (response.data.status?.toLowerCase?.() === "success") {
            // 5. Don't log entire response in production
            if (process.env.NODE_ENV !== 'production') {
                console.log("Signup successful:", response.data.message);
            }
            return { 
                success: true, 
                data: response.data,
                message: response.data.message 
            };
        } else {
            return {
                success: false,
                message: response.data.message || "Registration failed. Please try again.",
                errorCode: response.data.code // If available
            };
        }
    } catch (error: any) {
        // 6. Better error handling with type safety
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || 
                          `Server error: ${error.response.status}`;
        } else if (error.request) {
            // Request made but no response
            errorMessage = "Network error. Please check your connection.";
        }
        
        // 7. Use console.error for errors
        console.error("Signup error:", errorMessage, error);
        
        return { 
            success: false, 
            message: errorMessage,
            error: error // Only include in development
        };
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

            // Redirect to home immediately without checking verification
            router.replace("/home");
            
            return {
                success: true,
            };
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