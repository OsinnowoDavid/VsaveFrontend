import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import PinInput from "../../../components/PinInput";

export default function ResetPasswordScreen() {
    const [step, setStep] = useState<"verify" | "reset">("verify");
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleVerify = () => {
        // Add logic to verify PIN and reset password
        console.log("Verifying PIN...");
        // On success, move to the next step
        setStep("reset");
    };

    const handleResetPassword = () => {
        // Add logic to save the new password
        console.log("Resetting password...");
        // On success, navigate back to the menu or login
        alert("Password has been reset successfully!");
        router.push("/menu");
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View className="flex-row items-center p-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View className="p-6 flex-1 justify-between">
                    {step === "verify" ? (
                        <>
                            <View>
                                <Text className="text-3xl font-bold text-gray-800 mb-4">
                                    Forgot your password?
                                </Text>
                                <Text className="text-base text-gray-600 mb-8">
                                    Please enter the code sent to
                                    da****2@gmail.com
                                </Text>

                                <PinInput label="" />

                                <View className="flex-row gap-1 justify-center items-center mt-4">
                                    <Text className="font-medium text-gray-600">
                                        Didn’t receive a code?
                                    </Text>
                                    <Pressable>
                                        <Text className="text-green-700 font-medium text-base">
                                            Resend Code
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <Button
                                input="Verify & Continue"
                                onPress={handleVerify}
                            />
                        </>
                    ) : (
                        <>
                            <View>
                                <Text className="text-3xl font-bold text-gray-800 mb-4">
                                    Create a secure password
                                </Text>
                                <Text className="text-base text-gray-600 mb-8">
                                    Your new password must be different from
                                    previously used passwords.
                                </Text>
                                <FormField
                                    label=""
                                    placeholder="New Password"
                                    value={passwords.newPassword}
                                    onChangeText={(text) =>
                                        setPasswords((prev) => ({
                                            ...prev,
                                            newPassword: text,
                                        }))
                                    }
                                    secureTextEntry
                                />
                                <FormField
                                    label=""
                                    placeholder="Confirm Password"
                                    value={passwords.confirmPassword}
                                    onChangeText={(text) =>
                                        setPasswords((prev) => ({
                                            ...prev,
                                            confirmPassword: text,
                                        }))
                                    }
                                    secureTextEntry
                                />
                            </View>
                            <Button
                                input="Reset Password"
                                onPress={handleResetPassword}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
