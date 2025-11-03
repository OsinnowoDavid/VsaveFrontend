import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import ConfirmTransactionModal from "../components/ConfirmTransactionModal";
import HomeScreenWrapper from "../components/HomeScreenWrapper";
import useProfileStore from "../store/useProfileStore";
import useSavingsStore from "../store/useSavingsStore";
import { joinSavingsPlan } from "./savingsService";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
        <Text className="text-base text-gray-500">{label}</Text>
        <Text className="text-base font-semibold text-gray-800 text-right w-1/2">
            {value}
        </Text>
    </View>
);

export default function JoinPlanScreen() {
    const router = useRouter();
    const { planId } = useLocalSearchParams<{ planId: string }>();
    const { availablePlans } = useSavingsStore();
    const { fetchProfileAndTransactions } = useProfileStore();

    const [isModalVisible, setModalVisible] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [pin, setPin] = useState("");

    const plan = useMemo(
        () => availablePlans.find((p) => p._id === planId),
        [availablePlans, planId]
    );

    const handleConfirmJoin = async () => {
        if (!plan) return;
        if (pin.length !== 4) {
            Alert.alert(
                "Invalid PIN",
                "Please enter your 4-digit transaction PIN."
            );
            return;
        }

        setIsJoining(true);
        const response = await joinSavingsPlan(plan._id);
        setIsJoining(false);
        setModalVisible(false);
        setPin("");

        if (response.success) {
            Alert.alert(
                "Success!",
                "You have successfully joined the savings plan.",
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            // Refresh user data and navigate back
                            await fetchProfileAndTransactions();
                            router.back();
                        },
                    },
                ]
            );
        } else {
            Alert.alert(
                "Error",
                response.message || "Failed to join the plan."
            );
        }
    };

    if (!plan) {
        return (
            <HomeScreenWrapper>
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-lg text-gray-600 text-center mb-4">
                        Plan details could not be found. It might no longer be
                        available.
                    </Text>
                    <Button
                        input="Go Back"
                        onPress={() => router.back()}
                        variant="outline"
                    />
                </View>
            </HomeScreenWrapper>
        );
    }

    const formattedStartDate = new Date(plan.startDate).toLocaleDateString(
        "en-GB"
    );
    const formattedEndDate = new Date(plan.endDate).toLocaleDateString("en-GB");

    return (
        <HomeScreenWrapper showFooter={false}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="p-4">
                    <Text className="text-2xl font-bold text-gray-800">
                        {plan.savingsTitle}
                    </Text>
                    <Text className="text-base text-gray-500 mt-1">
                        Review the details below and confirm to join this plan.
                    </Text>
                </View>

                <View className="p-4">
                    <DetailRow
                        label="Savings Amount"
                        value={`₦${plan.savingsAmount.toLocaleString()}`}
                    />
                    <DetailRow
                        label="Frequency"
                        value={
                            plan.frequency.charAt(0) +
                            plan.frequency.slice(1).toLowerCase()
                        }
                    />
                    <DetailRow
                        label="Duration"
                        value={`${plan.duration} days`}
                    />
                    <DetailRow label="Start Date" value={formattedStartDate} />
                    <DetailRow label="Maturity Date" value={formattedEndDate} />
                    <DetailRow
                        label="Maturity Amount"
                        value={`₦${plan.maturityAmount.toLocaleString()}`}
                    />
                </View>
            </ScrollView>

            <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-100">
                <Button
                    input="Join This Plan"
                    onPress={() => setModalVisible(true)}
                />
            </View>

            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirmJoin}
                title="Confirm Savings Plan"
                amount={plan.savingsAmount.toLocaleString()}
                isLoading={isJoining}
                pin={pin}
                onPinChange={setPin}
                details={[
                    { label: "Plan Name", value: plan.savingsTitle },
                    { label: "Frequency", value: plan.frequency },
                ]}
            />
        </HomeScreenWrapper>
    );
}
