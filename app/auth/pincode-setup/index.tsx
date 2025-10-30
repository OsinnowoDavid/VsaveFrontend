import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";
import { createPin } from "../../../services/pinService";

export default function PinCodeSetupScreen() {
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (pin.length !== 4 || confirmPin.length !== 4) {
            Alert.alert("Error", "Please enter a 4-digit PIN.");
            return;
        }
        if (pin !== confirmPin) {
            Alert.alert("Error", "The PINs you entered do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await createPin(pin);
            Alert.alert(
                "PIN Created",
                "Your transaction PIN has been set up successfully. Please log in to continue.",
                [
                    {
                        text: "OK",
                        // Redirect to login-with-pin, as this is the expected next step
                        onPress: () => router.replace("/auth/login-with-pin"),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert("PIN Setup Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="Create Transaction PIN">
                <View>
                    <Text className="text-center text-gray-600 mb-6">
                        Create a 4-digit PIN to secure your transactions.
                    </Text>
                    <PinInput
                        label="Enter 4-Digit PIN"
                        value={pin}
                        onChangeText={setPin}
                        maxLength={4}
                    />
                    <PinInput
                        label="Confirm 4-Digit PIN"
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                        maxLength={4}
                    />
                    <View className="mt-8">
                        <Button
                            input="Create PIN"
                            onPress={handleSubmit}
                            isLoading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </FormWrapper>
        </ScreenWrapper>
    );
}
