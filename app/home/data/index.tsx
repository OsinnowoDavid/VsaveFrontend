import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../../components/Balance";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import KeyboardAvoidWrapper from "../../../components/KeyboardAvoidWrapper";
import { dataPlans, networks } from "../../../constants/networks";

const Index = () => {
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [phone, setPhone] = useState("");

    const handlePlanChange = (planId: string) => {
        setSelectedPlan(planId);
        if (selectedNetwork) {
            const plan = dataPlans[selectedNetwork].find(
                (p) => p.id === planId
            );
            if (plan) {
                setCustomAmount(String(plan.price));
            }
        }
    };

    const handleProceed = () => {
        if (!selectedNetwork) {
            Alert.alert("Validation Error", "Please select a network.");
            return;
        }
        if (!selectedPlan) {
            Alert.alert("Validation Error", "Please select a data plan.");
            return;
        }
        if (!phone || phone.length < 10) {
            Alert.alert(
                "Validation Error",
                "Please enter a valid phone number."
            );
            return;
        }
        if (
            !customAmount ||
            isNaN(Number(customAmount)) ||
            Number(customAmount) <= 0
        ) {
            Alert.alert("Validation Error", "Please enter a valid amount.");
            return;
        }

        // If all validations pass, navigate to confirmation screen
        const details = [
            {
                label: "Network",
                value:
                    networks.find((n) => n.id === selectedNetwork)?.id || "N/A",
            },
            { label: "Phone Number", value: phone },
            {
                label: "Plan",
                value:
                    dataPlans[selectedNetwork!].find(
                        (p) => p.id === selectedPlan
                    )?.label || "Custom",
            },
        ];

        router.push({
            pathname: "/confirm-transaction",
            params: {
                title: "Confirm Data Purchase",
                amount: customAmount,
                details: JSON.stringify(details),
                showBeneficiary: "true",
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB] w-[95%] mx-auto">
            <KeyboardAvoidWrapper>
                <View className="mt-3 w-full mx-auto bg-transparent flex gap-3">
                    <Balance />
                    <Button
                        input="Topup my number"
                        onPress={() => {}}
                        variant="outline"
                    />
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm mt-8 mb-4">
                    {/* Title */}
                    <Text className="text-base font-medium text-gray-700 mb-2">
                        Choose Network
                    </Text>

                    {/* Network Logos */}
                    <View className="flex-row justify-between mb-6">
                        {networks.map((net) => (
                            <TouchableOpacity
                                key={net.id}
                                onPress={() => {
                                    setSelectedNetwork(net.id);
                                    setSelectedPlan(null);
                                    setCustomAmount("");
                                }}
                                className={`w-14 h-14 rounded-lg border-2 p-1 items-center justify-center ${
                                    selectedNetwork === net.id
                                        ? "border-green-700"
                                        : "border-transparent"
                                }`}
                            >
                                <Image
                                    source={net.Icon}
                                    className="w-full h-full rounded-md"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Data Plans */}
                    {selectedNetwork && (
                        <FormField
                            label="Select Data Plan"
                            type="select"
                            value={selectedPlan || ""}
                            onChangeText={handlePlanChange}
                            options={dataPlans[selectedNetwork].map((plan) => ({
                                label: `${plan.label} — ₦${plan.price}`,
                                value: plan.id,
                            }))}
                        />
                    )}

                    {/* Amount Input */}
                    <View className="mt-4 mb-6">
                        <Text className="text-sm font-medium text-gray-800 mb-1">
                            Amount
                        </Text>
                        <TextInput
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            className="w-full h-11 px-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-800"
                        />
                    </View>

                    {/* Phone Number Input */}
                    <FormField
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                    <View className="mt-10">
                        <Button input="Proceed" onPress={handleProceed} />
                    </View>
                </View>
            </KeyboardAvoidWrapper>
        </SafeAreaView>
    );
};

export default Index;
