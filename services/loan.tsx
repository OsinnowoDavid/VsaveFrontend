import apiClient from "./apiClient";

export const checkEligibility = async () => {
  try {
    const eligibility = await apiClient.get("/loan/check-elegibility");
    console.log("ELIGIBILITY", eligibility);
    return eligibility;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error so the caller can catch it
  }
};


