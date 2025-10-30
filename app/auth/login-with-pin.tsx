import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ScreenWrapper from "../../components/AuthScreenWrapper";
import Button from "../../components/Button";
import FormWrapper from "../../components/FormWrapper";
import PinInput from "../../components/PinInput";
import { verifyPin } from "../../services/pinService";
import useAuthStore from "../../store/useAuthStore";
import useProfileStore from "../../store/useProfileStore";

export default function LoginWithPinScreen() {
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login, logout } = useAuthStore();
    const { fetchProfile } = useProfileStore();

    const handleLogin = async () => {
        if (pin.length !== 4) {
            Alert.alert("Error", "Please enter your 4-digit PIN.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Verify the PIN against the one stored on the device
            await verifyPin(pin);

            // 2. If PIN is correct, retrieve the token from storage
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error(
                    "Session expired. Please log in with your password."
                );
            }

            // 3. Fetch and cache profile details before proceeding
            const profileResponse = await fetchProfile(token);
            console.log("Profile Response:", profileResponse);

            if (!profileResponse?.success) {
                throw new Error(
                    profileResponse.message ||
                        "Failed to load your profile. Please try again."
                );
            }

            // 4. Complete the login process by setting the token in the auth store
            login(token);

            // 5. Manually redirect to home after successful login.
            router.replace("/home");
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginWithPassword = async () => {
        // This function logs the user out completely, clearing the cached token,
        // and redirects them to the standard password login screen.
        await logout();
        router.replace("/auth/login");
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="Welcome Back!">
                <View>
                    <Text className="text-center text-gray-600 mb-6">
                        Enter your PIN to unlock your account.
                    </Text>

                    <PinInput
                        label="Enter Your PIN"
                        value={pin}
                        onChangeText={setPin}
                        maxLength={4}
                    />

                    <View className="mt-8">
                        <Button
                            onPress={handleLogin}
                            disabled={isLoading || pin.length !== 4}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-center font-semibold text-white">
                                    Unlock
                                </Text>
                            )}
                        </Button>
                    </View>

                    <TouchableOpacity
                        onPress={handleLoginWithPassword}
                        className="mt-6"
                    >
                        <Text className="text-center text-green-700 font-semibold">
                            Login with Password Instead
                        </Text>
                    </TouchableOpacity>
                </View>
            </FormWrapper>
        </ScreenWrapper>
    );
}
