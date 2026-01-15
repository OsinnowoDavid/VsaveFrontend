import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

// Types for decoded JWT payload
interface DecodedToken {
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

interface AuthState {
  hasCachedToken: boolean;
  token: string | null;
  decodedToken: DecodedToken | null;
  isAuthLoading: boolean;
  isTokenExpired: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshToken: () => Promise<void>; // Returns Promise<void>
  clearAuth: () => void;
  decodeToken: (token: string) => DecodedToken | null;
  isTokenValid: () => boolean;
}

// Helper function to check if token is expired
const isTokenExpired = (decodedToken: DecodedToken | null): boolean => {
  if (!decodedToken || !decodedToken.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

// Helper function to decode JWT token
const decodeJWT = (token: string): DecodedToken | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided for decoding');
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

const useAuthStore = create<AuthState>((set, get) => ({
  hasCachedToken: false,
  token: null,
  decodedToken: null,
  isAuthLoading: true,
  isTokenExpired: true,

  // Decode token helper method
  decodeToken: (token: string) => {
    return decodeJWT(token);
  },

  // Check if current token is valid
  isTokenValid: () => {
    const { token, decodedToken } = get();
    
    if (!token) return false;
    
    const currentDecodedToken = decodedToken || decodeJWT(token);
    if (!currentDecodedToken) return false;
    
    return !isTokenExpired(currentDecodedToken);
  },

  // Login with token
  login: async (token: string) => {
    try {
      const decodedToken = decodeJWT(token);
      
      if (!decodedToken) {
        throw new Error('Invalid token: Unable to decode');
      }

      const expired = isTokenExpired(decodedToken);
      
      if (expired) {
        console.warn('Login attempted with expired token');
      }

      set({ 
        token, 
        decodedToken, 
        hasCachedToken: true, 
        isAuthLoading: false,
        isTokenExpired: expired
      });
      
      await AsyncStorage.setItem("authToken", token);
      
      if (decodedToken) {
        await AsyncStorage.setItem(
          "userInfo", 
          JSON.stringify({
            userId: decodedToken.userId,
            email: decodedToken.email,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName
          })
        );
      }
      
    } catch (error) {
      console.error('Login error:', error);
      get().clearAuth();
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["authToken", "userInfo"]);
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    } finally {
      set({ 
        token: null, 
        decodedToken: null, 
        hasCachedToken: false, 
        isAuthLoading: false,
        isTokenExpired: true
      });
    }
  },

  // Clear auth without async operations
  clearAuth: () => {
    set({ 
      token: null, 
      decodedToken: null, 
      hasCachedToken: false, 
      isAuthLoading: false,
      isTokenExpired: true
    });
  },

  // Refresh token - returns Promise<void> (fixed)
  refreshToken: async (): Promise<void> => {
    const { token } = get();
    
    if (!token) {
      throw new Error('No token to refresh');
    }

    try {
      // If you have an actual API endpoint to refresh tokens:
      // const response = await apiClient.post('/auth/refresh', { token });
      // const newToken = response.data.token;
      // await get().login(newToken);
      
      // For now, just re-decode existing token to update state
      const decodedToken = decodeJWT(token);
      const expired = isTokenExpired(decodedToken);
      
      set({ 
        decodedToken,
        isTokenExpired: expired
      });
      
      // Don't return anything - that's what Promise<void> means
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().clearAuth();
      throw error; // Re-throw for caller to handle
    }
  },

  // Hydrate auth state from storage
  hydrate: async () => {
    try {
      const [token, userInfoString] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("userInfo")
      ]);

      if (token) {
        const decodedToken = decodeJWT(token);
        const expired = isTokenExpired(decodedToken);
        
        let mergedDecodedToken = decodedToken;
        if (userInfoString) {
          try {
            const storedUserInfo = JSON.parse(userInfoString);
            mergedDecodedToken = {
              ...decodedToken,
              ...storedUserInfo
            };
          } catch (parseError) {
            console.warn('Failed to parse stored user info:', parseError);
          }
        }

        set({
          token,
          decodedToken: mergedDecodedToken,
          hasCachedToken: true,
          isAuthLoading: false,
          isTokenExpired: expired
        });
      } else {
        set({ 
          hasCachedToken: false, 
          isAuthLoading: false 
        });
      }
    } catch (error) {
      console.error("Failed to hydrate auth state:", error);
      set({ 
        isAuthLoading: false,
        hasCachedToken: false 
      });
    }
  },
}));

// Immediately attempt to hydrate the store when the app loads
useAuthStore.getState().hydrate();

export default useAuthStore;
export { decodeJWT, isTokenExpired };
export type { DecodedToken };