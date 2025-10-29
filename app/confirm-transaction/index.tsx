import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../components/Balance";
import Button from "../../components/Button";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidWrapper";
import PinInput from "../../components/PinInput";

interface Detail {
    label: string;
    value: string;
}

export default function ConfirmTransactionScreen() {
    const params = useLocalSearchParams<{
        title: string;
        amount: string;
        details: string; // JSON string
        showBeneficiary?: "true" | "false";
    }>();

    const [saveBeneficiary, setSaveBeneficiary] = useState(false);
    const [pin, setPin] = useState("");

    const transactionDetails: Detail[] = params.details
        ? JSON.parse(params.details)
        : [];
    if (params.amount) {
        transactionDetails.push({
            label: "Amount",
            value: `₦${params.amount}`,
        });
    }

    const handleConfirm = () => {
        if (pin.length < 4) {
            // Assuming 4-digit pin for now
            Alert.alert("Error", "Please enter your transaction PIN.");
            return;
        }
        // Simulate API call
        console.log("PIN:", pin);
        console.log("Save Beneficiary:", saveBeneficiary);
        Alert.alert("Success", "Transaction successful!");
        router.replace("/home");
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingWrapper>
                <View className="w-[95%] mx-auto">
                    {/* Header */}
                    <View className="flex-row items-center py-2">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2"
                        >
                            <ArrowLeft size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xl font-bold text-gray-800 text-center mt-2 mb-4">
                        {params.title || "Confirm Transaction"}
                    </Text>

                    <Balance version="v2" />

                    <View className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-4">
                        {/* Details */}
                        <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                            {transactionDetails.map((item, index) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between items-center py-2"
                                >
                                    <Text className="text-sm text-gray-500">
                                        {item.label}
                                    </Text>
                                    <Text className="text-sm font-semibold text-gray-800 text-right">
                                        {item.value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* Pin Input */}
                        <PinInput
                            label="Enter Transaction Pin"
                            value={pin}
                            onChangeText={setPin}
                        />
                        {/* Save Beneficiary Switch */}
                        {params.showBeneficiary === "true" && (
                            <View className="flex-row justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                                <Text className="font-medium text-gray-700">
                                    Save as beneficiary
                                </Text>
                                <Switch
                                    trackColor={{
                                        false: "#767577",
                                        true: "#1B8A52",
                                    }}
                                    thumbColor={"#f4f3f4"}
                                    onValueChange={setSaveBeneficiary}
                                    value={saveBeneficiary}
                                />
                            </View>
                        )}

                        <View className="mt-6">
                            <Button input="Confirm" onPress={handleConfirm} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingWrapper>
        </SafeAreaView>
    );
}
