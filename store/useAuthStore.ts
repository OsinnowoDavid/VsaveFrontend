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
    login: async (token) => {
        set({ token, isAuthLoading: false });
        await AsyncStorage.setItem("authToken", token);
    },
    logout: async () => {
        set({ token: null, isAuthLoading: false });
        await AsyncStorage.removeItem("authToken");
    },
    // Function to load the token from storage on app startup
    hydrate: async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                set({ token, isAuthLoading: false }); // If token is found, we are no longer loading
            } else {
                set({ isAuthLoading: false }); // If no token, we are also no longer loading
            }
        } catch (e) {
            console.error("Failed to load auth token from storage", e);
            set({ isAuthLoading: false }); // On error, stop loading
        }
    },
}));

export default useAuthStore;
