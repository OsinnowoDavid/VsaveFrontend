import { create } from "zustand";
import { IUser } from "../types/profile";
import useAuthStore from "./useAuthStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// We can omit fields that shouldn't be stored on the client, like password.
// We can also simplify Mongoose-specific types.
export type UserProfile = Omit<IUser, "password" | "_id" | "KYC"> & {
    _id: string;
    KYC: string | null;
};

interface ProfileState {
    profile: UserProfile | null;
    isProfileLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => void;
    clearProfile: () => void;
}

const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isProfileLoading: false,
    fetchProfile: async () => {
        const { token } = useAuthStore.getState();
        const url = `${API_BASE_URL}/user/profile`;
        if (!token) {
            return; // No token, no user to fetch
        }
        set({ isProfileLoading: true });
        try {
            // Replace with your actual API endpoint
            const response = await fetch(url, {
                headers: {
                    authorization: `${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const result = await response.json();
            if (result.Status.toLowerCase() === "success" && result.data) {
                set({ profile: result.data, isProfileLoading: false });
            } else {
                throw new Error(
                    result.message || "Failed to parse profile data"
                );
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            set({ isProfileLoading: false });
        }
    },
    updateProfile: (data) => {
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...data } : null,
        }));
    },
    clearProfile: () => set({ profile: null, isProfileLoading: false }),
}));

export default useProfileStore;
