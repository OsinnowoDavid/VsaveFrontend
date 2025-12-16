const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
import apiClient from "./apiClient";
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
    pin: string,
    amount: number,
    token: string
): Promise<BuyAirtimeResponse> => {
    try {
        console.log("AIRTIME", pin, phoneNumber);
        const response = await fetch(`${BASE_URL}/user/buy-airtime`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify({ phoneNumber, amount, pin }),
        });

        const data: BuyAirtimeResponse = await response.json();
        console.log("API Response:", data);

        // FIX: Compare with lowercase "success" instead of "Success"
        if (!response.ok || data.status?.toLowerCase() !== "success") {
            throw new Error(data.message || "Airtime purchase failed.");
        }

        return data;
    } catch (error: any) {
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
// Define the response interface



export const getDataPlans = async (
  selectedNetwork: string,
  token: string
): Promise<any> => {
  try {
    console.log("Fetching data plans for:", selectedNetwork);
    
    // Add await and extract response.data
    const response = await apiClient.get(`user/get-data-plan/${selectedNetwork}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   ;
    
    // Return only the data part
    return response.data;

  } catch (error) {
    console.error("Error fetching data plans:", error);
    throw error;
  }
};

export const buyData = async (
  pin: string,
  phoneNumber: string,
  amount: number,
  planCode: string,
  network: string,
  // token: string // Remove if apiClient handles auth
): Promise<BuyDataResponse> => {
  try {
    console.log("Buying data plan:", {
      network,
      planCode,
      amount,
      phoneNumber,
      pinLength: pin.length
    });

    const response = await apiClient.post("user/buy-data", {
      pin,
      phoneNumber,
      amount,
      planCode,
      network
    });

    console.log("Purchase response:", response.data);

    // Check if successful
    if (response.data.status?.toLowerCase() === "success") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Data purchase failed");
    }

  } catch (error: any) {
    console.error("Buy data error:", error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 402) {
      throw new Error("Insufficient balance. Please top up your account.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Invalid request. Please check your inputs.");
    }
    
    throw new Error(error.message || "Failed to purchase data. Please try again.");
  }
};