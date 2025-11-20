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
                "Accept": "application/json", // Explicitly ask for JSON
            },
        });

        // FIRST, check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // It's not JSON - get the text to see what we actually received
            const text = await response.text();
            console.error('❌ Server returned non-JSON response:', {
                status: response.status,
                url: response.url, // This shows final URL after redirects
                contentType,
                bodyPreview: text.substring(0, 500),
            });
            
            return {
                success: false,
                message: `Server error (${response.status}). Please try again later.`
            };
        }

        // Now safely parse as JSON
        const result = await response.json();

        // Note: Your API might use 'status' instead of 'Status' - check the actual response
        const status = result?.Status || result?.status;
        if (response.ok && status?.toLowerCase?.() === "success") {
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
        return { success: false, message: "Network error. Please check your connection." };
    }
};
