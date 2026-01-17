import * as Clipboard from "expo-clipboard";
import { Copy, Landmark, Eye, EyeOff, RefreshCw } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { Alert, Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useProfileStore from "../store/useProfileStore";
import { router } from "expo-router";
import { getBalance } from "../services/authService";

// Create a custom hook for balance query
function useBalanceQuery() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const data = await getBalance();
      console.log("Balance data received:", data); // Debug log
      return data;
    },
    staleTime: 0, // Always stale, will refetch immediately
    gcTime: 1000 * 30, // 30 seconds cache time
    retry: 1,
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // Enable debug logging
    onSuccess: (data) => {
      console.log("Balance query success:", data);
    },
    onError: (error) => {
      console.log("Balance query error:", error);
    },
    onSettled: (data, error) => {
      console.log("Balance query settled:", { data, error });
    }
  });
}

export default function Balance({ version = "v1" }: { version?: "v1" | "v2" }) {
  if (version === "v1") {
    return <BalanceV1 />;
  }
  return <BalanceV2 />;
}

function BalanceV1() {
  const { profile } = useProfileStore();
  const [showBalance, setShowBalance] = useState(true);
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Use the React Query hook
  const { 
    data: balanceData, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useBalanceQuery();

  // Update lastUpdate timestamp when data changes
  useEffect(() => {
    if (balanceData && !isFetching) {
      setLastUpdate(new Date());
    }
  }, [balanceData, isFetching]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "0.00";
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const copyToClipboard = async () => {
    if (profile?.profile?.virtualAccountNumber) {
      await Clipboard.setStringAsync(
        profile.profile.virtualAccountNumber
      );
      Alert.alert("Copied!", "Account number copied to clipboard.");
    }
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  // Force refresh balance
  const forceRefreshBalance = async () => {
    console.log("Manual refresh triggered");
    try {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      await refetch();
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  // Determine what balance to display
  const getDisplayBalance = () => {
    if (isLoading && !balanceData) {
      return "Loading...";
    }
    
    if (isError) {
      console.log("Error in balance query:", error);
      // Use the profile balance as fallback
      return formatCurrency(profile?.profile?.availableBalance) || "Error";
    }
    
    // Log what data we're using
    console.log("Using balance data:", {
      reactQueryBalance: balanceData,
      profileBalance: profile?.profile?.availableBalance
    });
    
    // Priority: React Query data -> Profile store -> Loading
    const balanceValue = balanceData?.availableBalance || balanceData?.balance || balanceData?.data?.availableBalance;
    
    if (balanceValue !== undefined) {
      return formatCurrency(balanceValue);
    }
    
    // Fallback to profile store
    return formatCurrency(profile?.profile?.availableBalance);
  };

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return "";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
  };

  return (
    <View
      className="border-[0.01px] mt-5 h-36 rounded-2xl relative overflow-hidden"
      style={{
        backgroundColor: "rgba(27, 138, 82, 0.7)",
      }}
    >
      <View className="w-56 h-56 flex items-center justify-center rounded-full bg-[#f8f8f8] absolute -right-12 -top-6 z-0">
        <Image
          source={require("../assets/images/transparent-logo.png")}
          className="w-24 h-24 opacity-40"
        />
      </View>
      <View
        className="mt-5 w-full h-40 rounded-2xl absolute -top-9 z-10 py-6 px-4 flex flex-col justify-between"
        style={{
          backgroundColor: "rgba(27, 138, 82, 0.7)",
        }}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-base">
            Account number:{" "}
            {profile?.profile?.virtualAccountNumber ?? "account number is not ready"}
          </Text>
          {profile?.profile?.virtualAccountNumber && (
            <TouchableOpacity onPress={copyToClipboard}>
              <Copy size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <View>
          {profile.kyc === null ? (
            <TouchableOpacity onPressOut={() => router.push("/auth/kyc")}>
              <Text className="text-white text-3xl">click to complete kyc</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-[#EFEFEF] text-[16px]">
              Assigned bank : GT Bank
            </Text>
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-white text-4xl tracking-tighter">
              ₦{showBalance ? getDisplayBalance() : "••••••"}
            </Text>
            
            {/* Eye icon for showing/hiding balance */}
            <TouchableOpacity 
              onPress={toggleBalanceVisibility} 
              className="ml-2"
              disabled={isFetching}
            >
              {showBalance ? (
                <EyeOff size={24} color="white" />
              ) : (
                <Eye size={24} color="white" />
              )}
            </TouchableOpacity>
            
            {/* Refresh button - always visible */}
            <TouchableOpacity 
              onPress={forceRefreshBalance} 
              className="ml-2"
              disabled={isFetching}
            >
              <RefreshCw 
                size={20} 
                color="white" 
                style={isFetching ? { transform: [{ rotate: '360deg' }] } : {}}
              />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center">
            {(isLoading || isFetching) ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-xs ml-2">Updating...</Text>
              </>
            ) : balanceData ? (
              <>
                <Text className="text-white text-xs ml-2">✓</Text>
                {lastUpdate && (
                  <Text className="text-white text-xs ml-2 opacity-70">
                    {getTimeSinceUpdate()}
                  </Text>
                )}
              </>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

function BalanceV2() {
  const { profile } = useProfileStore();
  const [showBalance, setShowBalance] = useState(true);
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Use the same React Query hook
  const { 
    data: balanceData, 
    isLoading, 
    isError,
    refetch,
    isFetching 
  } = useBalanceQuery();

  // Update lastUpdate timestamp when data changes
  useEffect(() => {
    if (balanceData && !isFetching) {
      setLastUpdate(new Date());
    }
  }, [balanceData, isFetching]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "0.00";
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  // Force refresh balance
  const forceRefreshBalance = async () => {
    console.log("Manual refresh triggered");
    try {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      await refetch();
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  // Determine what balance to display
  const getDisplayBalance = () => {
    if (isLoading && !balanceData) {
      return "Loading...";
    }
    
    if (isError) {
      return formatCurrency(profile?.profile?.availableBalance) || "Error";
    }
    
    // Priority: React Query data -> Profile store -> Loading
    const balanceValue = balanceData?.availableBalance || balanceData?.balance || balanceData?.data?.availableBalance;
    
    if (balanceValue !== undefined) {
      return formatCurrency(balanceValue);
    }
    
    // Fallback to profile store
    return formatCurrency(profile?.profile?.availableBalance);
  };

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return "";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    }
  };

  return (
    <View className="w-full h-28 mx-auto bg-green-100 flex flex-row gap-3">
      <View className="bg-white rounded-xl h-20 w-[90%] m-auto flex flex-row gap-3 items-center">
        <View className="flex-row justify-center items-center w-12 h-12 ml-4 my-auto bg-green-100 rounded-full">
          <Landmark size={24} color="#1B8A52" strokeWidth={2} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">
                ₦{showBalance ? getDisplayBalance() : "••••••"}
              </Text>
              
              {/* Eye icon for showing/hiding balance */}
              <TouchableOpacity 
                onPress={toggleBalanceVisibility} 
                className="ml-2"
                disabled={isFetching}
              >
                {showBalance ? (
                  <EyeOff size={20} color="#1B8A52" />
                ) : (
                  <Eye size={20} color="#1B8A52" />
                )}
              </TouchableOpacity>
              
              {/* Refresh button - always visible */}
              <TouchableOpacity 
                onPress={forceRefreshBalance} 
                className="ml-2"
                disabled={isFetching}
              >
                <RefreshCw 
                  size={18} 
                  color="#1B8A52" 
                  style={isFetching ? { transform: [{ rotate: '360deg' }] } : {}}
                />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center">
              {(isLoading || isFetching) ? (
                <>
                  <ActivityIndicator size="small" color="#1B8A52" />
                  <Text className="text-gray-500 text-xs ml-2">Updating</Text>
                </>
              ) : balanceData ? (
                <>
                  <Text className="text-green-500 text-xs ml-2">✓</Text>
                  {lastUpdate && (
                    <Text className="text-gray-500 text-xs ml-2">
                      {getTimeSinceUpdate()}
                    </Text>
                  )}
                </>
              ) : null}
            </View>
          </View>
          <Text className="text-sm font-medium text-gray-500">
            Available Balance
          </Text>
        </View>
      </View>
    </View>
  );
}