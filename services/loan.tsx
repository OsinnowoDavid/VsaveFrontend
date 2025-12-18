import apiClient from "./apiClient";

export const checkEligibility = async () => {
  try {
    // Properly await the promise[citation:7]
    const response = await apiClient.get("/loan/check-elegibility");
    // Return the data property, not the full Axios response object
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error("Error checking eligibility:", error);
    // Re-throw the error so the component can handle it (e.g., show an alert)[citation:5]
    throw error;
  }
};

export const getAllLoanRecord = async () => {
  try {
    // Properly await the promise[citation:7]
    const response = await apiClient.get("/loan/loan/all-loan-record");
    // Return the data property, not the full Axios response object
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error("no record found:", error);
    // Re-throw the error so the component can handle it (e.g., show an alert)[citation:5]
    throw error;
  }
};

export const loanApplication = async (loanAmount: number, loanTitle: string, loanElegibility:any) => {
  try {
    // 1. Await the promise[citation:7]
    // 2. Pass data as a single object in the second argument[citation:5]
    const response = await apiClient.post("/loan/loan-payout", {
      amount: loanAmount,
      loanTitle: loanTitle,
      loanElegibility:loanElegibility
      // Add other required fields like duration, purpose, etc.
    });
    // 3. Return the relevant data from the response
    return response.data;
  } catch (error) {
    // 4. NEVER use an empty catch block. Handle the error properly.
    console.error("Loan application error:", error);
    // Re-throw a user-friendly error or the API error message
    throw new Error(
      error.response?.data?.message ||
      "Failed to submit loan application. Please try again."
    );
  }
};