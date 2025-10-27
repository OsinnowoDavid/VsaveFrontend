import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import PinInput from "../../../components/PinInput";
import { confirmPasswordSchema, passwordSchema } from "../../../schema/form";
import { validateFormField } from "../../../utils";

const VerifyStep = ({
    pin,
    setPin,
    onVerify,
}: {
    pin: string;
    setPin: (pin: string) => void;
    onVerify: () => void;
}) => (
    <>
        <View>
            <Text className="text-3xl font-bold text-gray-800 mb-4">
                Forgot your password?
            </Text>
            <Text className="text-base text-gray-600 mb-8">
                Please enter the code sent to da****2@gmail.com
            </Text>

            <PinInput label="" value={pin} onChangeText={setPin} />

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
        <Button input="Verify & Continue" onPress={onVerify} />
    </>
);

const ResetStep = ({
    passwords,
    setPasswords,
    onReset,
}: {
    passwords: { newPassword: string; confirmPassword: string };
    setPasswords: (passwords: any) => void;
    onReset: () => void;
}) => (
    <>
        <View>
            <Text className="text-3xl font-bold text-gray-800 mb-4">
                Create a secure password
            </Text>
            <Text className="text-base text-gray-600 mb-8">
                Your new password must be different from previously used
                passwords.
            </Text>
            <FormField
                label=""
                placeholder="New Password"
                value={passwords.newPassword}
                onChangeText={(text) =>
                    setPasswords((prev: any) => ({
                        ...prev,
                        newPassword: text,
                    }))
                }
                secureTextEntry
                validate
                schema={passwordSchema}
                field={passwords.newPassword}
            />
            <FormField
                label=""
                placeholder="Confirm Password"
                value={passwords.confirmPassword}
                onChangeText={(text) =>
                    setPasswords((prev: any) => ({
                        ...prev,
                        confirmPassword: text,
                    }))
                }
                secureTextEntry
                validate
                schema={confirmPasswordSchema}
                field={{
                    password: passwords.newPassword,
                    confirmPassword: passwords.confirmPassword,
                }}
            />
        </View>
        <Button input="Reset Password" onPress={onReset} />
    </>
);

export default function ResetPasswordScreen() {
    const [step, setStep] = useState<"verify" | "reset">("verify");
    const [pin, setPin] = useState("");
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleVerify = () => {
        // TODO: Add logic to verify PIN
        console.log("Verifying PIN:", pin);
        setStep("reset");
    };

    const handleResetPassword = () => {
        const { isValid } = validateFormField(confirmPasswordSchema, {
            password: passwords.newPassword,
            confirmPassword: passwords.confirmPassword,
        });

        if (!isValid) {
            Alert.alert(
                "Invalid Password",
                "Please check your passwords and try again. Ensure they match and meet the security requirements."
            );
            return;
        }

        // TODO: Add logic to save the new password
        Alert.alert("Success", "Password has been reset successfully!", [
            { text: "OK", onPress: () => router.push("/menu") },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
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
                    {step === "verify" && (
                        <VerifyStep
                            pin={pin}
                            setPin={setPin}
                            onVerify={handleVerify}
                        />
                    )}
                    {step === "reset" && (
                        <ResetStep
                            passwords={passwords}
                            setPasswords={setPasswords}
                            onReset={handleResetPassword}
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
