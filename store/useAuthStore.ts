import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (userToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  // Action to set the token on login
  login: async (userToken: string) => {
    set({ token: userToken, isAuthenticated: true });
    await SecureStore.setItemAsync("userToken", userToken);
  },

  // Action to clear the token and log out
  logout: async () => {
    set({ token: null, isAuthenticated: false });
    await SecureStore.deleteItemAsync("userToken");
  },

  // Action to initialize the state from secure storage
  initialize: async () => {
    const userToken = await SecureStore.getItemAsync("userToken");
    if (userToken) {
      set({ token: userToken, isAuthenticated: true });
    }
  },
}));

export default useAuthStore;
