import useAuthStore from "../store/useAuthStore";
import apiClient from "./apiClient";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface AvailableSavingsPlan {
    _id: string;
    savingsTitle: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    duration: number;
    savingsAmount: number;
    maturityAmount: number;
    startDate: string;
    endDate: string;
    deductionPeriod: string;
    status: string;
    savingsCircleId?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Fetches the user's available savings data from the API.
 */
export const getAvailableSavings = async (): Promise<
    ApiResponse<AvailableSavingsPlan[]>
> => {
    try {
        const { token } = useAuthStore.getState();
        if (!token) {
            return {
                success: false,
                message: "Authentication token not found.",
            };
        }

        const response = await fetch(`${API_BASE_URL}/user/avaliable-savings`, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, data: result.data };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred.",
        };
    }
};

/**
 * Fetches the user's currently active savings plans.
 */
export const getActiveSavings = async (): Promise<
    ApiResponse<AvailableSavingsPlan[]>
> => {
    try {
        const { token } = useAuthStore.getState();
        if (!token) {
            return {
                success: false,
                message: "Authentication token not found.",
            };
        }

        // This is the new endpoint your backend will need to provide.
        const response = await fetch(`${API_BASE_URL}/user/active-savings`, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, data: result.data };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error: any) {
        return { success: false, message: "Failed to fetch active plans." };
    }
};

/**
 * Joins a savings plan for the user.
 * @param circleId The circle ID of the savings plan to join.
 */
export const joinSavingsPlan = async (
    circleId: string
): Promise<ApiResponse<any>> => {
    try {
        const { token } = useAuthStore.getState();
        if (!token) {
            return {
                success: false,
                message: "Authentication token not found.",
            };
        }

        const response = await fetch(`${API_BASE_URL}/user/join-savings`, {
            method: "POST",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ circleId }),
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, data: result.data };
        } else {
            return {
                success: false,
                message: result.message || "Failed to join plan.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message:
                error.message ||
                "An unexpected error occurred while joining the plan.",
        };
    }
};

export const savingsBalances = async() =>{
    try {
        const response = await apiClient.get("/user/totalSavingsAndLoanBalance")
        return response
    } catch (error) {
        console.log(error)
        
    }
}
