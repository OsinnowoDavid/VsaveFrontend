import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../../components/Balance";
import Button from "../../../components/Button";
import ConfirmTransactionModal from "../../../components/ConfirmTransactionModal";
import FormField from "../../../components/FormField";
import KeyboardAvoidWrapper from "../../../components/KeyboardAvoidWrapper";
import { networks, quickAmounts } from "../../../constants/networks";
import { verifyPin } from "../../../services/pinService"; // Corrected import
import { buyAirtime } from "../../../services/vending";
import useAuthStore from "../../../store/useAuthStore";
import useProfileStore from "../../../store/useProfileStore";

const Index = () => {
    const { profile } = useProfileStore(); // Get profile from store
    const { token } = useAuthStore();
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");
    const [amount, setAmount] = useState<string>(""); // single source of truth for amount
    const [phone, setPhone] = useState(profile?.profile?.phoneNumber ?? "");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pin, setPin] = useState("");

    const handleProceed = () => {
        if (!selectedNetwork) {
            Alert.alert("Validation Error", "Please select a network.");
            return;
        }
        if (!phone || phone.length < 10) {
            // All validations passed, show the confirmation modal

            Alert.alert(
                "Validation Error", // All validations passed, show the confirmation modal

                "Please enter a valid phone number."
            ); // All validations passed, show the confirmation modal

            return;
        } // All validations passed, show the confirmation modal

        // All validations passed, show the confirmation modal
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Validation Error", "Please enter a valid amount.");
            return;
        } // All validations passed, show the confirmation modal

        // All validations passed, show the confirmation modal
        setIsModalVisible(true);
    };

    const handleConfirmPurchase = async () => {
        if (!token) {
            Alert.alert("Authentication Error", "Please log in and try again.");
            return;
        }
        if (pin.length !== 4) {
            Alert.alert("Error", "Please enter your 4-digit transaction PIN.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Verify PIN first
            await verifyPin(pin);

            // 2. If PIN is correct, proceed with airtime purchasre
            const numericAmount = Number(amount);
            const result = await buyAirtime(phone, numericAmount, `${token}`);

            if (result.status.toLowerCase() === "success") {
                Alert.alert(
                    "Success",
                    result.message || "Airtime purchase successful!"
                );
                router.replace("/home");
            } else {
                // This case handles non-error responses that are not 'success'
                throw new Error(result.message || "Airtime purchase failed.");
            }
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message || "An unexpected error occurred."
            );
        } finally {
            setIsLoading(false);
            setIsModalVisible(false);
            setPin(""); // Clear PIN after attempt
        }
    };

    const handleTopupMyNumber = () => {
        if (profile?.profile?.phoneNumber) {
            setPhone(profile.profile.phoneNumber);
            Alert.alert(
                "Phone Number Pre-filled",
                "Your number has been added."
            );
        } else {
            Alert.alert(
                "Error",
                "Your phone number is not available in your profile."
            );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5] w-[95%] mx-auto">
            <KeyboardAvoidWrapper>
                <View className="mt-3 w-full mx-auto bg-transparent flex gap-3">
                    <Balance />
                    <Button
                        input="Topup my number"
                        onPress={handleTopupMyNumber} // Use the new handler
                        variant="outline"
                    />
                </View>

                <View className="bg-white rounded-xl p-4 w-full mt-8 mb-4">
                    {/* Network Logos */}
                    <View className="flex-row justify-between mb-6">
                        {networks.map((net) => (
                            <Pressable
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
                            </Pressable>
                        ))}
                    </View>

                    <FormField
                        label="Select Network"
                        type="select"
                        value={selectedNetwork}
                        onChangeText={setSelectedNetwork}
                        options={networks.map((net) => ({
                            label: net.id, // Display network ID as label for selection
                            value: net.id,
                        }))}
                    />

                    {/* Quick Amount Buttons */}
                    <View className="flex-row flex-wrap justify-between gap-y-3 mb-4">
                        {quickAmounts.map((amt) => (
                            <Pressable
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
                            </Pressable>
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

            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmPurchase}
                title="Confirm Airtime Purchase"
                amount={amount}
                isLoading={isLoading}
                pin={pin}
                onPinChange={setPin}
                details={[
                    {
                        label: "Network",
                        value:
                            networks.find((n) => n.id === selectedNetwork)
                                ?.id || "N/A",
                    },
                    { label: "Phone Number", value: phone },
                ]}
            />
        </SafeAreaView>
    );
};

export default Index;
