import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AuthState {
    hasCachedToken: boolean;
    token: string | null;
    isAuthLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    hydrate: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    hasCachedToken: false,
    token: null,
    isAuthLoading: true, // Start in a loading state
    login: async (token) => {
        set({ token, hasCachedToken: true, isAuthLoading: false });
        await AsyncStorage.setItem("authToken", token);
    },
    logout: async () => {
        set({ token: null, hasCachedToken: false, isAuthLoading: false });
        await AsyncStorage.removeItem("authToken");
    },
    // Function to load the token from storage on app startup
    hydrate: async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            // We only check if a token exists, we don't log the user in yet.
            set({ hasCachedToken: !!token, isAuthLoading: false });
        } catch (e) {
            console.error("Failed to load auth token from storage", e);
            set({ isAuthLoading: false }); // On error, stop loading
        }
    },
}));

// Immediately attempt to hydrate the store when the app loads
useAuthStore.getState().hydrate();

export default useAuthStore;