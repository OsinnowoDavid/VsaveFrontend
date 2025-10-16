import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

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
    login: (token: string) => {
        set({ token, isAuthLoading: false });
        AsyncStorage.setItem("authToken", token);
    },
    logout: () => {
        set({ token: null, isAuthLoading: false });
        AsyncStorage.removeItem("authToken");
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
