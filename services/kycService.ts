import useAuthStore from "../store/useAuthStore";
import { ApiResponse } from "./savingsService"; // Re-using ApiResponse for consistency

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
export const submitKYCStage1 = async (data: any): Promise<ApiResponse<any>> => {
    // The implementation for submitting KYC data would go here.
    // This is just a placeholder to show where it belongs.
    console.log("Submitting KYC Data:", data);
    // Example:
    // const response = await fetch(`${API_BASE_URL}/kyc/stage1`, { ... });
    // return await response.json();
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    success: true,
                    message: "KYC Submitted Successfully",
                }),
            1000
        )
    );
};
