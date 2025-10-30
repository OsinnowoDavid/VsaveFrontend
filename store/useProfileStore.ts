import { create } from "zustand";
import {
    clearProfileCache,
    fetchUserProfile,
} from "../services/profileService";

interface KycDetails {
    accountNumber: number;
    address: string;
    bank: string;
    bvn: string;
    country: string;
    state: string;
    profession: string;
}

interface ProfileDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    virtualAccountNumber: string;
    availableBalance: number;
    pendingBalance: number;
    profilePicture?: string;
    gender: string;
    dateOfBirth: string;
    isEmailVerified: boolean;
}

interface Profile {
    profile: ProfileDetails | null;
    kyc: KycDetails | null;
}

interface ProfileState {
    profile: Profile | null;
    hasCompletedKYC: boolean;
    isProfileLoading: boolean;
    fetchProfile: (token: string) => Promise<any>; // Return the response
    updateProfile: (data: Partial<ProfileDetails>) => void;
    clearProfile: () => void;
}

const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isProfileLoading: false, // Start with false, set to true during fetch
    hasCompletedKYC: false,
    fetchProfile: async (token) => {
        set({ isProfileLoading: true });
        const response = await fetchUserProfile(token);
        if (response?.success) {
            set({
                profile: response.data,
                isProfileLoading: false,
                hasCompletedKYC: !!response.data.kyc,
            });
        } else {
            set({ isProfileLoading: false });
        }
        return response; // Return the response to the caller
    },
    updateProfile: (data: Partial<ProfileDetails>) => {
        set((state) =>
            state.profile && state.profile.profile
                ? {
                      profile: {
                          ...state.profile,
                          profile: { ...state.profile.profile, ...data },
                      },
                  }
                : state
        );
    },
    clearProfile: () => {
        clearProfileCache(); // Clear the service-level cache
        set({ profile: null, isProfileLoading: false, hasCompletedKYC: false });
    },
}));

export default useProfileStore;
