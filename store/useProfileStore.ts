import { create } from "zustand";
import {
    clearProfileCache,
    fetchUserProfile,
} from "../services/profileService";
import { getTransactions } from "../services/transactionService";
import useAuthStore from "./useAuthStore";

// Define interfaces for your data structures
interface ProfileDetails {
    // Add your profile properties here
    // e.g., name: string, email: string, etc.
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    availableBalance: number;
    pendingBalance: number;
    virtualAccountNumber: string;
    profilePicture?: string;
}

interface KycDetails {
    // Add your KYC properties here
}

interface Transaction {
    // Add your transaction properties here
    _id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
}

interface ProfileState {
    profile: { profile: ProfileDetails | null; kyc: KycDetails | null };
    transactions: Transaction[];
    isProfileLoading: boolean;
    hasCompletedKYC: boolean;
    clearProfile: () => void;
    fetchProfile: (token: string) => Promise<any>;
    fetchProfileAndTransactions: () => Promise<void>;
    updateProfile: (updates: Partial<ProfileDetails>) => void;
    setProfile: (data: {
        profile: ProfileDetails | null;
        kyc: KycDetails | null;
    }) => void;
}

const useProfileStore = create<ProfileState>((set, get) => ({
    profile: { profile: null, kyc: null },
    transactions: [],
    isProfileLoading: true, // Start with loading true
    hasCompletedKYC: false,

    setProfile: (data) => set({ profile: data }),

    clearProfile: () => {
        clearProfileCache(); // Clear the in-memory cache from the service
        set({
            profile: { profile: null, kyc: null },
            transactions: [],
            hasCompletedKYC: false,
            isProfileLoading: false,
        });
    },

    updateProfile: (updates) =>
        set((state) => {
            if (state.profile.profile) {
                return {
                    profile: {
                        ...state.profile,
                        profile: { ...state.profile.profile, ...updates },
                    },
                };
            }
            return state;
        }),

    fetchProfile: async (token: string) => {
        set({ isProfileLoading: true });
        try {
            const response = await fetchUserProfile(token);
            if (response.success && response.data) {
                set({
                    profile: response.data,
                    // Assuming KYC is complete if the `kyc` object exists and is not null
                    hasCompletedKYC: !!response.data.kyc,
                });
            }
            return response;
        } finally {
            set({ isProfileLoading: false });
        }
    },

    fetchProfileAndTransactions: async () => {
        const { token } = useAuthStore.getState();

        // Fetch profile and transactions in parallel for better performance
        const [profileResponse, transactionsResponse] = await Promise.all([
            get().fetchProfile(token), // Use the store's own fetchProfile
            getTransactions(), // Assuming you have this service
        ]);

        if (transactionsResponse.success && transactionsResponse.data) {
            set({ transactions: transactionsResponse.data });
        }
    },
}));

export default useProfileStore;

// NOTE: You will need to create `getTransactions` in a `transactionService.ts` file.
// It would be similar to your `savingsService.ts`.
