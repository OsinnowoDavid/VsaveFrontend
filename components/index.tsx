import React, { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import useSavingsStore from "../store/useSavingsStore";
import HomeScreenWrapper from "./HomeScreenWrapper";
import PlanCard from "./PlanCard";

export default function ActivePlansScreen() {
    const { activePlans, fetchActivePlans, isLoadingActive } =
        useSavingsStore();

    const onRefresh = useCallback(async () => {
        await fetchActivePlans();
    }, [fetchActivePlans]);

    useEffect(() => {
        // Fetch plans if the store is empty
        if (activePlans.length === 0) {
            fetchActivePlans();
        }
    }, [fetchActivePlans, activePlans.length]);

    const calculateProgress = (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();

        if (now >= end) return 100;
        if (now <= start) return 0;

        const totalDuration = end - start;
        const elapsedDuration = now - start;

        return Math.min(100, (elapsedDuration / totalDuration) * 100);
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
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            >
                {isLoadingActive && activePlans.length === 0 && (
                    <ActivityIndicator
                        size="large"
                        color="#1B8A52"
                        className="mt-16"
                    />
                )}

                {!isLoadingActive && activePlans.length === 0 && (
                    <View className="flex-1 justify-center items-center mt-24">
                        <Text className="text-lg text-gray-500">
                            You have no active savings plans.
                        </Text>
                    </View>
                )}

                {activePlans.map((plan) => (
                    <PlanCard
                        key={plan._id}
                        title={plan.savingsTitle}
                        amount={`₦${plan.maturityAmount.toLocaleString()}`}
                        startDate={new Date(plan.startDate).toLocaleDateString(
                            "en-GB"
                        )}
                        maturityDate={new Date(plan.endDate).toLocaleDateString(
                            "en-GB"
                        )}
                        progress={calculateProgress(
                            plan.startDate,
                            plan.endDate
                        )}
                    />
                ))}
            </ScrollView>
        </HomeScreenWrapper>
    );
}
