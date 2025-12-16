import useAuthStore from "../store/useAuthStore";
import { ApiResponse } from "./savingsService"; // Re-using ApiResponse for consistency
import apiClient from "./apiClient";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface SubRegion {
    _id: string;
    subRegionName: string;
    shortCode?: string;
    // Add other properties if they exist in the API response
}

/**
 * Fetches the list of available sub-regions from the backend.
 */
export const getSubRegions = async (): Promise<ApiResponse<SubRegion[]>> => {
    try {
        const { token } = useAuthStore.getState();
        if (!token) {
            return {
                success: false,
                message: "Authentication token not found.",
            };
        }

        const response = await fetch(`${API_BASE_URL}/user/subregions`, {
            method: "GET",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, data: result.data };
        } else {
            return {
                success: false,
                message: result.message || "Failed to fetch sub-regions.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred.",
        };
    }
};

/**
 * NOTE: I am moving the existing `submitKYCStage1` function here
 * to keep all KYC-related services in one file.
 * You will need to update the import in your KYCScreen.
 */
// Option 1: Define an interface for better reusability
interface KYCStage1Data {
  profession: string;
  accountNumber: string;
  bankCode: string;
  country: string;
  state: string;
  address: string;
  bvn: string;
  subRegion: string;
  transactionPin: string;
}

// Option 2: Add response type for better type safety
interface KYCStage1Response {
  success: boolean;
  message?: string;
  // Add other response fields as needed
}

export const submitKYCStage1 = async (data: KYCStage1Data): Promise<KYCStage1Response> => {
  try {
    const response = await apiClient.post<KYCStage1Response>("/user/register-kyc1", data);
    return response.data;
  } catch (error: any) {
    // More specific error handling
    if (error.response) {
      // Server responded with error status
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "KYC submission failed");
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Other errors
      console.error("Error:", error.message);
      throw error;
    }
  }
};
// export const submitKYCStage1 = async (data: any): Promise<ApiResponse<any>> => {
//     try {
//         console.log("Submitting KYC Data:", data);
        
//         const response = await fetch(`${API_BASE_URL}/user/register-kyc1`, {
//             method: 'POST',  // Add HTTP method
//             headers: {
//                 'Content-Type': 'application/json',
//                 // Add any auth headers if needed, e.g.:
//                 // 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(data)  // Stringify the data
//         });

//         // Handle HTTP errors
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             return {
//                 success: false,
//                 message: errorData.message || `HTTP error! status: ${response.status}`,
//                 data: errorData
//             };
//         }

//         const responseData = await response.json();
//         return {
//             success: true,
//             message: "KYC Submitted Successfully",
//             data: responseData
//         };
        
//     } catch (error) {
//         console.error("Error submitting KYC:", error);
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : "Network error occurred",
//             data: null
//         };
//     }
// };
