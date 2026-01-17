// hooks/useBalance.ts
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export const useBalance = () => {
  const { token } = useAuthStore();
  
  return useQuery({
    queryKey: ["balance", token], // Include token in query key to auto-refresh when token changes
    queryFn: getBalance,
    enabled: !!token, // Only fetch if user has a token
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Optional: Create a hook to refresh balance
export const useRefreshBalance = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["balance"] });
  };
};