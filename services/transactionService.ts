import { TransactionCardProps } from "../components/TransactionCard";
import useAuthStore from "../store/useAuthStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getTransactions = async (): Promise<{
    success: boolean;
    data?: TransactionCardProps[];
    message?: string;
}> => {
    const { token } = useAuthStore.getState();
    // Assuming the endpoint is /user/transactions based on your request
    const url = `${API_BASE_URL}/user/transactions`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `${token}` },
        });

        const result = await response.json();

        if (response.ok && result.status.toLowerCase() === "success") {
            return { success: true, data: result.data || [] };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error("Get transactions error:", error);
        return { success: false, message: "Failed to fetch transactions." };
    }
};
