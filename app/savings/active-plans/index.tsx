import React, { useCallback, useEffect, useMemo } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import PlanCard from "../../../components/PlanCard";
import useSavingsStore from "../../../store/useSavingsStore";

export default function ActivePlansScreen() {
    const {
        activePlans,
        fetchActivePlans,
        isLoadingActive,
        availablePlans,
        fetchAvailablePlans,
    } = useSavingsStore();
    
    console.log("ACTIVE-PLANS", activePlans);

    const onRefresh = useCallback(async () => {
        // Refresh both active and available plans
        await Promise.all([fetchActivePlans(), fetchAvailablePlans()]);
    }, [fetchActivePlans, fetchAvailablePlans]);

    useEffect(() => {
        // Fetch plans if the store is empty
        if (activePlans.length === 0) {
            fetchActivePlans();
        }
        if (availablePlans.length === 0) {
            fetchAvailablePlans();
        }
    }, [
        fetchActivePlans,
        activePlans.length,
        fetchAvailablePlans,
        availablePlans.length,
    ]);

    // Extract only the active plans (second item in each array)
    const extractedActivePlans = useMemo(() => {
        if (!Array.isArray(activePlans)) return [];
        
        return activePlans
            .map(group => {
                // Each group is an array of 2 items: [planDetails, activePlan]
                if (Array.isArray(group) && group.length >= 2) {
                    return group[1]; // Return the active plan (second item)
                }
                return null;
            })
            .filter(Boolean); // Remove nulls
    }, [activePlans]);

    console.log("EXTRACTED-ACTIVE-PLANS", extractedActivePlans);

    // Extract plan details (first item in each array)
    const planDetailsList = useMemo(() => {
        if (!Array.isArray(activePlans)) return [];
        
        return activePlans
            .map(group => {
                if (Array.isArray(group) && group.length >= 1) {
                    return group[0]; // Return the plan details (first item)
                }
                return null;
            })
            .filter(Boolean);
    }, [activePlans]);

    // Create a map for quick lookups of available plan details by their ID.
    const availablePlansMap = useMemo(() => {
        // Combine availablePlans from API with planDetailsList from activePlans
        const allPlans = [...availablePlans, ...planDetailsList];
        return new Map(allPlans.map((plan) => [plan._id, plan]));
    }, [availablePlans, planDetailsList]);

    const calculateProgress = (startDate: string, endDate: string) => {
        try {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();

            if (now >= end) return 100;
            if (now <= start) return 0;

            const totalDuration = end - start;
            const elapsedDuration = now - start;

            return Math.min(100, (elapsedDuration / totalDuration) * 100);
        } catch (error) {
            console.error("Error calculating progress:", error);
            return 0;
        }
    };

    return (
        <HomeScreenWrapper showFooter={false}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingActive}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 80,
                    flexGrow: 1,
                }}
            >
                {isLoadingActive && extractedActivePlans.length === 0 && (
                    <ActivityIndicator
                        size="large"
                        color="#1B8A52"
                        className="mt-16"
                    />
                )}

                {!isLoadingActive && extractedActivePlans.length === 0 && (
                    <View className="flex-1 justify-center items-center mt-24">
                        <Text className="text-lg text-gray-500">
                            You have no active savings plans.
                        </Text>
                    </View>
                )}

                {extractedActivePlans.map((activePlan) => {
                    // Look up the plan details from the available plans map
                    // using savingsCircleId as the key.
                    const planDetails = availablePlansMap.get(
                        activePlan.savingsCircleId
                    );

                    let title = planDetails?.savingsTitle ?? "Active Plan";

                    // Truncate the title if it's longer than 30 characters.
                    if (title.length > 30) {
                        title = title.substring(0, 30) + "...";
                    }

                    return (
                        <PlanCard
                            key={activePlan._id}
                            title={title}
                            amount={`₦${(activePlan.maturityAmount || 0).toLocaleString()}`}
                            startDate={new Date(
                                activePlan.startDate
                            ).toLocaleDateString("en-GB")}
                            maturityDate={new Date(
                                activePlan.endDate
                            ).toLocaleDateString("en-GB")}
                            progress={calculateProgress(
                                activePlan.startDate,
                                activePlan.endDate
                            )}
                        />
                    );
                })}
            </ScrollView>
        </HomeScreenWrapper>
    );
}