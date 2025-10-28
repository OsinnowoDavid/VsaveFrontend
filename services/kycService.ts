import useAuthStore from "../store/useAuthStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface KYCStage1Data {
    profession: string;
    accountNumber: string;
    bank: string; // This is the bank code
    country: string;
    state: string;
    bvn: string;
    address: string;
}

export const submitKYCStage1 = async (
    data: KYCStage1Data
): Promise<{ success: boolean; message: string }> => {
    const { token } = useAuthStore.getState();
    const url = `${API_BASE_URL}/user/register-kyc1`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, message: result.message };
        } else {
            return {
                success: false,
                message: result.message || "An unknown error occurred.",
            };
        }
    } catch (error) {
        console.error("KYC submission error:", error);
        return { success: false, message: "Failed to connect to the server." };
    }
};

export const getKYCStatus = async (): Promise<{
    success: boolean;
    status?: "pending" | "failed" | "verified" | null;
    message?: string;
}> => {
    const { token } = useAuthStore.getState();
    // Assuming the endpoint to get KYC status is /user/kyc/stage1
    const url = `${API_BASE_URL}/user/kyc1`;

    try {
        const response = await fetch(url, {
            headers: { authorization: `${token}` },
        });
        const result = await response.json();

        if (result.status.toLowerCase() === "success") {
            return { success: true, status: result.data?.status };
        } else if (
            result.status.toLowerCase() === "failed" &&
            result.message === "No Record Found"
        ) {
            // No KYC record exists, so the user is clear to proceed.
            return { success: true, status: "failed" };
        } else {
            return { success: false, message: result.message, status: null };
        }
    } catch (error) {
        console.error("Get KYC status error:", error);
        return { success: false, message: "Failed to fetch KYC status." };
    }
};
