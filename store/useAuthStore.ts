import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import useProfileStore from "./useProfileStore";

interface AuthState {
    token: string | null;
    isAuthLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    hydrate: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isAuthLoading: true, // Start in a loading state
    login: async (token: string) => {
        set({ token, isAuthLoading: false });
        await AsyncStorage.setItem("authToken", token);
        // After logging in, immediately fetch the user's profile
        useProfileStore.getState().fetchProfile();
    },
    logout: async () => {
        set({ token: null, isAuthLoading: false });
        await AsyncStorage.removeItem("authToken");
        // When logging out, clear the user's profile data
        useProfileStore.getState().clearProfile();
    },
    // Function to load the token from storage on app startup
    hydrate: async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                set({ token });
            }
        } catch (e) {
            console.error("Failed to load auth token from storage", e);
        } finally {
            set({ isAuthLoading: false }); // Hydration is complete
        }
    },
}));

// Immediately attempt to hydrate the store when the app loads
useAuthStore.getState().hydrate();

export default useAuthStore;
