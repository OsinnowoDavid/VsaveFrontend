import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
    Alert,
    Pressable,
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing
} from "react-native";
import { Mail, ShieldCheck, Clock, ArrowLeft } from "lucide-react-native";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";
import {
    resendVerificationToken,
    verifyEmail,
} from "../../../services/authService";

export default function VerifyEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string }>();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
    
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;

    // Pulse animation for email icon
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    // Extract and set email from params
    useEffect(() => {
        if (params.email) {
            const emailValue = Array.isArray(params.email) ? params.email[0] : params.email;
            setEmail(emailValue);
        }
    }, [params.email]);

    // Countdown timer for resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    const maskEmail = (email: string) => {
        if (!email) return "your email";
        const [user, domain] = email.split("@");
        if (!user || !domain) return email;
        if (user.length <= 3) return email;
        const maskedUser = user.substring(0, 3) + "*".repeat(Math.min(user.length - 3, 4));
        return `${maskedUser}@${domain}`;
    };

    const handleVerify = async () => {
        if (!email || !code || code.length !== 6) {
            Alert.alert(
                "Invalid Code",
                "Please enter the 6-digit verification code."
            );
            return;
        }

        setIsLoading(true);
        setVerificationStatus("idle");

        try {
            const response = await verifyEmail({ email, code });
            
            if (response.success) {
                setVerificationStatus("success");
                // Animate checkmark
                Animated.timing(checkmarkAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }).start();
                
                // Success animation and navigation
                setTimeout(() => {
                    Alert.alert(
                        "Email Verified Successfully!",
                        "Your email has been verified. You can now access your account.",
                        [
                            {
                                text: "Continue to Login",
                                onPress: () => router.replace("/auth/login"),
                            },
                        ]
                    );
                }, 1500);
            } else {
                setVerificationStatus("error");
                Alert.alert("Verification Failed", response.message || "Invalid verification code. Please try again.");
            }
        } catch (error: any) {
            setVerificationStatus("error");
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            Alert.alert("Error", "No email address found.");
            return;
        }
        
        if (countdown > 0) {
            Alert.alert("Please Wait", `You can resend the code in ${countdown} seconds.`);
            return;
        }

        setIsResending(true);
        try {
            const response = await resendVerificationToken({ email });
            
            if (response.success) {
                setCountdown(60); // Start 60-second countdown
                Alert.alert(
                    "Code Sent!",
                    `A new verification code has been sent to ${maskEmail(email)}.`,
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert("Error", response.message || "Failed to resend verification code.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to resend verification code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-6">
                    {/* Header with Back Button */}
                    <View className="pt-4 pb-2">
                        <Pressable
                            onPress={() => router.push("/auth/signup")}
                            className="flex-row items-center w-24 p-2 rounded-lg active:bg-gray-100"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <ArrowLeft size={20} color="#374151" />
                            <Text className="ml-2 text-gray-700 font-medium">Back</Text>
                        </Pressable>
                    </View>

                    <View className="flex-1 justify-center">
                        {/* Verification Animation/Status */}
                        <View className="items-center mb-8">
                            {verificationStatus === "success" ? (
                                <View className="relative">
                                    <Animated.View
                                        style={{
                                            transform: [
                                                { scale: checkmarkAnim },
                                                {
                                                    translateY: checkmarkAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [20, 0],
                                                    }),
                                                },
                                            ],
                                            opacity: checkmarkAnim,
                                        }}
                                    >
                                        <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center">
                                            <ShieldCheck size={48} color="#059669" />
                                        </View>
                                    </Animated.View>
                                    <View className="absolute -top-2 -right-2">
                                        <View className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center">
                                            <Text className="text-white font-bold">✓</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <Animated.View
                                    style={{
                                        transform: [{ scale: pulseAnim }],
                                    }}
                                >
                                    <View className="w-24 h-24 rounded-full bg-emerald-50 items-center justify-center border-4 border-emerald-100">
                                        <Mail size={48} color="#059669" />
                                    </View>
                                </Animated.View>
                            )}
                        </View>

                        {/* Main Content */}
                        <View className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-50 border border-gray-100">
                            <View className="mb-8">
                                <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                                    Verify Your Email
                                </Text>
                                <Text className="text-gray-600 text-center">
                                    We've sent a 6-digit verification code to
                                </Text>
                                <Text className="text-lg font-semibold text-emerald-700 text-center mt-1">
                                    {maskEmail(email)}
                                </Text>
                            </View>

                            {/* Instructions */}
                            {/* <View className="mb-8">
                                <View className="flex-row items-start mb-4 p-4 bg-emerald-50 rounded-xl">
                                    <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                        <Text className="text-emerald-700 font-bold">1</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800 mb-1">
                                            Check Your Email
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            Look for an email from VSave with the subject "Verify Your Email Address"
                                        </Text>
                                    </View>
                                </View>
                                
                                <View className="flex-row items-start mb-4 p-4 bg-emerald-50 rounded-xl">
                                    <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                        <Text className="text-emerald-700 font-bold">2</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800 mb-1">
                                            Enter the Code
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            Enter the 6-digit code below. The code expires in 15 minutes.
                                        </Text>
                                    </View>
                                </View>
                            </View> */}

                            {/* Pin Input */}
                            <View className="mb-8">
                                <Text className="text-gray-700 font-medium mb-4 text-center">
                                    Enter Verification Code
                                </Text>
                                <PinInput
                                    label=""
                                    value={code}
                                    onChangeText={setCode}
                                    autoFocus={true}
                                    length={6}
                                    containerStyle="justify-center"
                                    cellStyle="w-14 h-14 mx-1 border-2 border-gray-300 rounded-lg"
                                    activeCellStyle="border-emerald-500 bg-emerald-50"
                                    textStyle="text-2xl font-bold text-gray-800"
                                />
                            </View>

                            {/* Verification Status Indicator */}
                            {code.length === 6 && !isLoading && (
                                <View className="mb-6">
                                    <View className="flex-row items-center justify-center p-3 bg-gray-50 rounded-lg">
                                        <Text className="text-gray-600 font-medium">
                                            Code entered:{" "}
                                            <Text className="font-bold text-emerald-700">
                                                {code}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View className="space-y-4">
                                <Button
                                    input={isLoading ? "Verifying..." : "Verify Email"}
                                    onPress={handleVerify}
                                    color="text-white"
                                    bg={code.length === 6 && !isLoading ? "bg-emerald-600" : "bg-emerald-400"}
                                    disabled={code.length !== 6 || isLoading}
                                    isLoading={isLoading}
                                    icon={isLoading ? undefined : "shield-check"}
                                    size="lg"
                                    style={`shadow-lg ${code.length === 6 && !isLoading ? "shadow-emerald-200" : ""}`}
                                />

                                {/* Resend Code Section */}
                                <View className="pt-6 border-t border-gray-200">
                                    <View className="flex-row items-center justify-center">
                                        <Text className="text-gray-600 mr-2">
                                            Didn't receive the code?
                                        </Text>
                                        <Pressable
                                            onPress={handleResend}
                                            disabled={isResending || countdown > 0}
                                            className={`flex-row items-center px-4 py-2 rounded-lg ${
                                                countdown > 0 || isResending
                                                    ? "bg-gray-100"
                                                    : "bg-emerald-50 active:bg-emerald-100"
                                            }`}
                                        >
                                            {isResending ? (
                                                <>
                                                    <Clock size={16} color="#9CA3AF" className="mr-2" />
                                                    <Text className="text-gray-500 font-medium">
                                                        Sending...
                                                    </Text>
                                                </>
                                            ) : countdown > 0 ? (
                                                <>
                                                    <Clock size={16} color="#059669" className="mr-2" />
                                                    <Text className="text-emerald-700 font-medium">
                                                        Resend in {formatCountdown(countdown)}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text className="text-emerald-700 font-medium">
                                                        Resend Code
                                                    </Text>
                                                </>
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            {/* Help Text */}
                            <View className="mt-8 p-4 bg-gray-50 rounded-xl">
                                <View className="flex-row">
                                    <ShieldCheck size={18} color="#059669" className="mr-3 mt-0.5" />
                                    <View className="flex-1">
                                        <Text className="text-sm text-gray-600">
                                            <Text className="font-semibold text-gray-700">Important:</Text>{" "}
                                            The verification code expires in 15 minutes. If you don't see the email, please check your spam folder.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Footer Links */}
                        {/* <View className="mt-8 pt-6 border-t border-gray-200">
                            <Text className="text-center text-gray-500 text-sm mb-2">
                                Having trouble verifying your email?
                            </Text>
                            <View className="flex-row justify-center space-x-6">
                                <Pressable
                                    onPress={() => router.push("/auth/support")}
                                    className="py-2 px-4"
                                >
                                    <Text className="text-emerald-700 font-medium">
                                        Contact Support
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => router.push("/auth/login")}
                                    className="py-2 px-4"
                                >
                                    <Text className="text-emerald-700 font-medium">
                                        Back to Login
                                    </Text>
                                </Pressable>
                            </View>
                        </View> */}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}