import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";
import {
    resendVerificationToken,
    verifyEmail,
} from "../../../services/authService";

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const maskEmail = (email?: string) => {
        if (!email) return "";
        const [user, domain] = email.split("@");
        if (user.length <= 3) return email;
        return `${user.substring(0, 3)}****@${domain}`;
    };

    const handleVerify = async () => {
        if (!email || !token || token.length !== 6) {
            Alert.alert(
                "Invalid Token",
                "Please enter the 6-digit code from your email."
            );
            return;
        }
        setIsLoading(true);
        const response = await verifyEmail({ email, token });
        setIsLoading(false);

        if (response.success) {
            Alert.alert(
                "Verification Successful",
                "Your email has been verified. You can now log in.",
                [{ text: "OK", onPress: () => router.replace("/auth/login") }]
            );
        } else {
            Alert.alert("Verification Failed", response.message);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setIsResending(true);
        const response = await resendVerificationToken({ email });
        setIsResending(false);

        if (response.success) {
            Alert.alert("Code Sent", response.message);
        } else {
            Alert.alert("Error", response.message);
        }
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="Verify Your Email">
                <View className="flex-1 justify-between">
                    <View>
                        <Text className="text-base text-gray-600 mb-8 text-center">
                            Please enter the 6-digit code sent to{"\n"}
                            <Text className="font-bold text-gray-700">
                                {maskEmail(email)}
                            </Text>
                        </Text>

                        <PinInput
                            label=""
                            value={token}
                            onChangeText={setToken}
                        />

                        <View className="flex-row gap-1 justify-center items-center mt-4">
                            <Text className="font-medium text-gray-600">
                                Didn’t receive a code?
                            </Text>
                            <Pressable
                                onPress={handleResend}
                                disabled={isResending}
                            >
                                <Text className="text-green-700 font-medium text-base">
                                    {isResending ? "Sending..." : "Resend Code"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <Button
                        input="Verify & Continue"
                        onPress={handleVerify}
                        disabled={isLoading}
                    />
                </View>
            </FormWrapper>
        </ScreenWrapper>
    );
}
