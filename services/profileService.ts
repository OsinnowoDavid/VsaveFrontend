const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export const fetchUserProfile = async (
    token: string
): Promise<ApiResponse<any>> => {
    const url = `${API_BASE_URL}/user/profile`;

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

        if (response.ok && result?.Status === "success") {
            return { success: true, data: result.data };
        } else {
        }
    } catch (error) {
        console.error("fetchUserProfile error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
};
