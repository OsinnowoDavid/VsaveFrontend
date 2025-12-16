import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,

    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AvailablePlanCard from "../../components/AvailablePlanCard";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import SavingsCard from "../../components/SavingsCard";
import useProfileStore from "../../store/useProfileStore";
import useSavingsStore from "../../store/useSavingsStore";

export default function Savings() {
    const { profile, isProfileLoading } = useProfileStore();
    const {
        availablePlans,
        fetchAvailablePlans,
        isLoading,
        activePlans,
        fetchActivePlans,
        isLoadingActive,
    } = useSavingsStore();

    const onRefresh = useCallback(async () => {
        // We can fetch both profile and savings plans on refresh
        await Promise.all([
            useProfileStore.getState().fetchProfileAndTransactions(),
            fetchAvailablePlans(),
            fetchActivePlans(),
        ]).catch(() =>
            Alert.alert("Error", "Could not refresh data. Please try again.")
        );
    }, [fetchAvailablePlans, fetchActivePlans]);

    useEffect(() => {
        // Fetch plans only if they haven't been loaded yet
        if (availablePlans.length === 0) {
            fetchAvailablePlans();
        }
        if (activePlans.length === 0) {
            fetchActivePlans();
        }
    }, [
        fetchAvailablePlans,
        availablePlans.length,
        fetchActivePlans,
        activePlans.length,
    ]);

    return (
        <HomeScreenWrapper bgColor="bg-gray-50">
         
// Prevents content from being hidden by the footer
            
                {/* Re-introducing the SavingsCard for summary */}
                <SavingsCard
                    isLoading={isProfileLoading}
                    balance={profile?.profile?.availableBalance}
                    // Assuming 'mySavings' is a value you want to track separately.
                    // For now, we'll leave it as 0 until its source is defined.
                    mySavings={0}
                />

                {/* Active Plan Card */}
                <View className="px-4 mt-6">
                    <View className="flex-row items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <View className="flex-row items-center space-x-3">
                            <View className="w-10 h-10 rounded-full bg-gradient-to-b from-[#5D8A1B52] to-[#18240770] flex items-center justify-center">
                                {/* Placeholder Icon */}
                                <View className="w-6 h-6 rounded-full bg-pink-400" />
                            </View>
                            <View>
                                <Text className="text-base font-semibold text-[#212121]">
                                    Active Plans
                                </Text>
                                <Text className="text-sm text-[#5C5A5A]">
                                    {isLoadingActive
                                        ? "Loading..."
                                        : `${activePlans.length} Ongoing plans`}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center space-x-1"
                            onPress={() => router.push("/savings/active-plans")

                            }
                            disabled={activePlans.length === 0}
                        >
                            <Text
                                className={`text-sm ${
                                    activePlans.length > 0
                                        ? "text-[#1B8A52]"
                                        : "text-gray-400"
                                }`}
                            >
                                View all
                            </Text>
                            <ArrowRight
                                size={16}
                                color={
                                    activePlans.length > 0
                                        ? "#1B8A52"
                                        : "#9CA3AF"
                                }
                                strokeWidth={1.5}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="p-4 mt-4">
                    <Text className="text-xl font-bold text-gray-800 mb-1">
                        Join a Savings Plan
                    </Text>
                    <Text className="text-base text-gray-500 mb-6">
                        Select one of our automated plans to start your savings
                        journey.
                    </Text>

                    {isLoading && availablePlans.length === 0 && (
                        <ActivityIndicator size="large" color="#1B8A52" />
                    )}

                    {!isLoading && availablePlans.length === 0 && (
                        <Text className="text-center text-gray-500 p-8">
                            No available savings plans at the moment.
                        </Text>
                    )}

                    <View>
                        <TouchableOpacity   onPress={() => router.push("/savings/createSavings")}
 >

                        <Text className="text-center underline  border-1 rounded p-6 text-green-600 bg-white">
                        Create my savings plan

                        </Text>
                        </TouchableOpacity>

                    </View>

                    {availablePlans.map((plan) => (
                        <AvailablePlanCard
                            key={plan._id}
                            title={plan.savingsTitle}
                            amount={plan.savingsAmount}
                            frequency={plan.frequency}
                            duration={plan.duration}
                            maturityAmount={plan.maturityAmount}
                            onPress={() =>
                                // Navigate to a details screen where user can confirm and join
                                router.push({
                                    pathname: "/savings/join-plan",
                                    params: { planId: plan._id },
                                })
                            }
                        />
                    ))}
                </View>

        </HomeScreenWrapper>
    );
}
