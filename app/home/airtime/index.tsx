import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../../components/Balance";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import KeyboardAvoidWrapper from "../../../components/KeyboardAvoidWrapper";
import { networks, quickAmounts } from "../../../constants/networks";

const Index = () => {
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");
    const [amount, setAmount] = useState<string>(""); // single source of truth for amount
    const [phone, setPhone] = useState("");

    const handleProceed = () => {
        if (!selectedNetwork) {
            Alert.alert("Validation Error", "Please select a network.");
            return;
        }
        if (!phone || phone.length < 10) {
            Alert.alert(
                "Validation Error",
                "Please enter a valid phone number."
            );
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
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
        ];

        router.push({
            pathname: "/confirm-transaction",
            params: {
                title: "Confirm Airtime Purchase",
                amount: amount,
                details: JSON.stringify(details),
                showBeneficiary: "true",
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5] w-[95%] mx-auto">
            <KeyboardAvoidWrapper>
                <View className="mt-3 w-full mx-auto bg-transparent flex gap-3">
                    <Balance />
                    <Button
                        input="Topup my number"
                        onPress={() => {}}
                        variant="outline"
                    />
                </View>

                <View className="bg-white rounded-xl p-4 w-full mt-8 mb-4">
                    {/* Network Logos */}
                    <View className="flex-row justify-between mb-6">
                        {networks.map((net) => (
                            <TouchableOpacity
                                key={net.id}
                                onPress={() => setSelectedNetwork(net.id)}
                                className={`w-14 h-14 rounded-lg border-2 p-1 ${
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

                    <FormField
                        label="Select Network"
                        type="select"
                        value={selectedNetwork}
                        onChangeText={setSelectedNetwork}
                        options={networks.map((net) => ({
                            label: net.id,
                            value: net.id,
                        }))}
                    />

                    {/* Quick Amount Buttons */}
                    <View className="flex-row flex-wrap justify-between gap-y-3 mb-4">
                        {quickAmounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                onPress={() => setAmount(String(amt))}
                                className={`w-[23%] h-10 rounded-md items-center justify-center ${
                                    amount === String(amt)
                                        ? "bg-green-700"
                                        : "bg-gray-100"
                                }`}
                            >
                                <Text
                                    className={`text-xs font-medium ${
                                        amount === String(amt)
                                            ? "text-white"
                                            : "text-green-800"
                                    }`}
                                >
                                    ₦{amt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <FormField
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                    />

                    <FormField
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                    <View className="mt-6">
                        <Button input="Proceed" onPress={handleProceed} />
                    </View>
                </View>
            </KeyboardAvoidWrapper>
        </SafeAreaView>
    );
};

export default Index;
