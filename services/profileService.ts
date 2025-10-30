const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// In-memory cache for the user profile
let cachedProfile: any = null;

// Function to clear the cache on logout
export const clearProfileCache = () => {
    cachedProfile = null;
};

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export const fetchUserProfile = async (
    token: string
): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/user/profile`;

    // 1. Check for cached data first
    if (cachedProfile) {
        return { success: true, data: cachedProfile };
    }

    if (!token) {
        return { success: false, message: "Authentication token not found." };
    }

    try {
        const response = await fetch(url, {
            headers: {
                authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        // Note: Corrected `result?.Status` to `result?.status` to match API spec
        if (response.ok && result?.Status === "success") {
            // 2. Store the fetched data in the cache
            cachedProfile = result.data;
            return { success: true, data: result.data };
        } else {
            return {
                success: false,
                message: result.message || "Failed to fetch profile.",
            };
        }
    } catch (error) {
        console.error("fetchUserProfile error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
};
