import { router } from "expo-router";
import { Alert } from "react-native";
import useAuthStore from "../store/useAuthStore";
import { SignUpData } from "../types/data";
import apiClient from "./apiClient";
import axios from "axios";
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export const handleSignup = async (registrationData: SignUpData) => {
    try {
        // Parse the full name
        const names = registrationData.fullName.trim().split(/\s+/);
        const firstName = names[0] || "";
        const lastName = names.length > 1 ? names.slice(1).join(" ") : firstName;
        
        // Ensure we have a valid Date object
        let dateOfBirth: Date;
        
        try {
            dateOfBirth = registrationData.dateOfBirth instanceof Date 
                ? registrationData.dateOfBirth 
                : new Date(registrationData.dateOfBirth);
            
            if (isNaN(dateOfBirth.getTime())) {
                return {
                    success: false,
                    message: "Invalid date of birth",
                    data: null
                };
            }
        } catch (dateError) {
            return {
                success: false,
                message: "Invalid date format",
                data: null
            };
        }

        // Format date as YYYY-MM-DD (ISO format) to avoid ambiguity
        const year = dateOfBirth.getFullYear();
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
        const day = String(dateOfBirth.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const form: any = {
            firstName: firstName,
            lastName: lastName,
            email: registrationData.email.toLowerCase().trim(),
            password: registrationData.password,
            gender: registrationData.gender,
            dateOfBirth: formattedDate, // YYYY-MM-DD format
            phoneNumber: registrationData.phoneNumber.trim(),
            referralCode: registrationData.referralCode.trim()
        };

        console.log("Final payload:", JSON.stringify(form, null, 2));

        const response = await apiClient.post("/user/register", form);
        console.log("backend", response)
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
        console.error("Signup error:", error.response?.data || error.message);
        
        return { 
            success: false, 
            message: error.response?.data?.message || "An error occurred",
            data: error.response?.data || null
        };
    }
};
export const verifyEmail = async (data: { email: string; code: string }): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post("/user/verify-email", data);
    console.log("Email verification response:", response.data);

    if (response.data?.status?.toLowerCase() === "success") {
      return {
        success: true,
        message: response.data.message || "Email verified successfully",
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Verification failed",
        data: response.data
      };
    }
  } catch (error: any) {
    console.error("Email verification error:", error);
    
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        "An error occurred during verification.";
    
    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};

export const resendVerificationToken = async (data: { email: string }): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post("/user/resend-verification-token", data);
    console.log("Resend token response:", response.data);

    if (response.data?.status === "success") {
      return {
        success: true,
        message: response.data.message || "Verification token resent",
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Failed to resend token",
        data: response.data
      };
    }
  } catch (error: any) {
    console.error("Resend token error:", error);
    
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        "An error occurred while resending the token.";
    
    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};

export const handleSignin = async (form: {
  email: string;
  password: string;
}): Promise<ApiResponse> => {
  try {
    const { login } = useAuthStore.getState();
    const response = await apiClient.post("/user/login", form);
    console.log("Login response:", response.data);

    if (response.data?.status?.toLowerCase() === "success" && response.data.token) {
      // Save token to Zustand store
      await login(response.data.token);
      
      // Optionally save user data if provided
      if (response.data.user) {
        // You might want to store user data in your auth store or profile store
        console.log("User data:", response.data.user);
      }
      
      // Redirect to home
      router.replace("/home");
      
      return {
        success: true,
        message: response.data.message || "Login successful",
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Login failed",
        data: response.data
      };
    }
  } catch (error: any) {
    console.error("Signin error:", error);
    
    let errorMessage = "An unexpected error occurred during login.";
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid email or password";
    } else if (error.response?.status === 403) {
      errorMessage = "Account not verified. Please verify your email first.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};

// Helper function to check if user is logged in
export const checkAuthStatus = async (): Promise<boolean> => {
  const { token, isTokenValid } = useAuthStore.getState();
  
  if (!token || !isTokenValid()) {
    return false;
  }
  
  // Optionally verify token with server
  try {
    const response = await apiClient.get("/user/verify-token");
    return response.data?.valid === true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};