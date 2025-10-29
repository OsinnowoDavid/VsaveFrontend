import { Bank } from "../types/data"; // Assuming a shared type definition
import apiClient from "./apiClient";

// In-memory cache for the bank list
let cachedBankList: Bank[] | null = null;

export const getBankList = async (): Promise<{
    success: boolean;
    data?: Bank[];
    message?: string;
}> => {
    // 1. Return cached data if available
    if (cachedBankList) {
        return { success: true, data: cachedBankList };
    }

    try {
        // 2. Fetch from API if not cached
        const response = await apiClient.get("/user/get-bank-code");

        // Note: The API returns status "Success" with a capital 'S'
        if (response.data && response.data.status === "Success") {
            // 3. Map the API response to the format expected by the UI
            const formattedData = response.data.data.map((bank: any) => ({
                id: bank._id, // Use _id as the unique identifier
                name: bank.bank,
                code: bank.bankCode,
            }));

            // Sort the bank list alphabetically by name
            formattedData.sort((a, b) => a.name.localeCompare(b.name));

            // 4. Store the formatted data in the cache
            cachedBankList = formattedData;

            return { success: true, data: formattedData };
        } else {
            return {
                success: false,
                message: response.data.message || "Failed to fetch banks.",
            };
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while fetching the bank list.";
        return { success: false, message: errorMessage };
    }
};

export const resolveBankAccount = async (details: {
    accountNumber: string;
    bankCode: string;
}): Promise<{
    success: boolean;
    data?: { account_name: string };
    message?: string;
}> => {
    try {
        const response = await apiClient.post("/account-lookup", details);

        if (response.data && response.data.status === "success") {
            return { success: true, data: response.data.data };
        } else {
            return {
                success: false,
                message: response.data.message || "Failed to resolve account.",
            };
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while resolving the bank account, please try again.";
        return { success: false, message: errorMessage };
    }
};

export const sendToBank = async (
    details: {
        bankCode: string;
        accountNumber: string;
        accountName: string;
        amount: number;
    },
    token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
        const response = await apiClient.post("/payout", details, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status === "success") {
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } else {
            throw new Error(response.data.message || "Bank transfer failed.");
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during the bank transfer.";
        throw new Error(errorMessage);
    }
};
