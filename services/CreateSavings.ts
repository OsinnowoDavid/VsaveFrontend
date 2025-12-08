// savingsApi.ts
import apiClient from "./apiClient";

export interface CreateSavingsRequest {
  savingsTitle: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  duration: number;
  deductionPeriod: string;
  savingsAmount: number;
  startDate: string;
  autoRestartEnabled: boolean;
}

export interface CreateSavingsResponse {
  id: string;
  savingsTitle: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  duration: number;
  deductionPeriod: string;
  savingsAmount: number;
  startDate: string;
  autoRestartEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
}

// Export as a named function
export const CreateSavings = async (savingsData: CreateSavingsRequest): Promise<CreateSavingsResponse> => {
  try {
    console.log('Creating savings goal:', savingsData);

    const response = await apiClient.post<CreateSavingsResponse>('/user/create-personal-savings', savingsData);

    console.log('Savings goal created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating savings goal:', error);

    const apiError = {
      message: error.response?.data?.message || error.message || 'Failed to create savings goal',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };

    throw apiError;
  }
};

// Don't export as a default object if you want to call CreateSavings directly
// Remove this if it exists:
// export default { CreateSavings, ... };