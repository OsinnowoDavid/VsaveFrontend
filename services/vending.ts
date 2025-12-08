const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface BuyAirtimeResponse {
    status: "success" | "error";
    message: string;
    data?: {
        transaction_reference: string;
    };
}

/**
 * Makes an API call to purchase airtime.
 * @param phoneNumber The phone number to top up.
 * @param amount The amount of airtime to purchase.
 * @param token The JWT authentication token.
 * @returns A promise resolving to the API response.
 */
export const buyAirtime = async (
    phoneNumber: string,
    amount: number,
    token: string // Assuming JWT token is required for authentication
): Promise<BuyAirtimeResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/user/buy-airtime`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`, // Include the authentication token
            },
            body: JSON.stringify({ phoneNumber, amount }),
        });

        const data: BuyAirtimeResponse = await response.json();
        console.log("API Response:", data);

        if (!response.ok || data.status?.toLowerCase() !== "Success") {
            throw new Error(data.message || "Airtime purchase failed.");
        }

        return data;
    } catch (error: any) {
        // Re-throw the error to be handled by the calling component
        throw new Error(
            error.message ||
                "An unexpected error occurred during airtime purchase."
        );
    }
};

interface BuyDataResponse {
    status: "success" | "error";
    message: string;
    data?: {
        transaction_reference: string;
    };
}

/**
 * Makes an API call to purchase a data plan.
 * @param phoneNumber The phone number to top up.
 * @param amount The amount/price of the data plan.
 * @param planCode The code for the selected data plan.
 * @param token The JWT authentication token.
 * @returns A promise resolving to the API response.
 */
export const buyData = async (
    phoneNumber: string,
    amount: number,
    planCode: string,
    token: string // Assuming JWT token is required for authentication
): Promise<BuyDataResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/user/buy-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ phoneNumber, amount, planCode }),
        });

        const data: BuyDataResponse = await response.json();

        if (!response.ok || data.status === "error") {
            throw new Error(data.message || "Data purchase failed.");
        }

        return data;
    } catch (error: any) {
        // Re-throw the error to be handled by the calling component
        throw new Error(
            error.message ||
                "An unexpected error occurred during data purchase."
        );
    }
};
