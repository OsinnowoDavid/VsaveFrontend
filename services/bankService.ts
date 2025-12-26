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
        console.log("Resolving bank account with details:", details);
        
        const response = await apiClient.post("user/account-lookup", details);
        console.log("Bank account resolution response:", response.data);

        // Check multiple possible success indicators
        if (response.data && (response.data.status === "Success" || response.data.success === true)) {
            // Handle different possible response structures
            const accountData = response.data.data || response.data;
            return { 
                success: true, 
                data: { 
                    account_name: accountData.account_name || accountData.accountName || accountData.name 
                } 
            };
        } else {
            return {
                success: false,
                message: response.data.message || "Failed to resolve account.",
            };
        }
    } catch (error: any) {
        console.error("Bank account resolution error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An error occurred while resolving the bank account, please try again.";
        return { success: false, message: errorMessage };
    }
};
// In bankService.ts
export const sendToBank = async (
    details: {
        bankCode: string;
        accountNumber: string;
        accountName: string;
        amount: number;
        pin: string;
    },
    token: string
): Promise<{ 
    success: boolean; 
    data?: any; 
    message?: string;
    status?: string; // Keep original status too
}> => {
    try {
        console.log("Sending to bank with details:", details);
        
        const response = await apiClient.post("/user/payout", details, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        const responseData = response.data || response;
        
        // Determine if transaction was successful
        const status = responseData.status?.toString().toLowerCase();
        const isSuccess = status === "success" || 
                         status === "completed" ||
                         responseData.success === true;
        
        return {
            success: isSuccess,
            data: responseData.data || responseData,
            message: responseData.message,
            status: responseData.status
        };
        
    } catch (error: any) {
        console.log("Bank transfer error:", error);
        
        let errorMessage = "An error occurred during the bank transfer.";
        
        if (error.response) {
            errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Error ${error.response.status}`;
        } else if (error.request) {
            errorMessage = "Network error. Please check your connection.";
        } else {
            errorMessage = error.message;
        }
        
        return {
            success: false,
            message: errorMessage
        };
    }
};
