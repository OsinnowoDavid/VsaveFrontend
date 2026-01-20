import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Easing
} from "react-native";
import { ArrowLeft, Lock, Shield, Fingerprint, Eye, EyeOff } from "lucide-react-native";
import Button from "../../components/Button";
import FormWrapper from "../../components/FormWrapper";
import PinInput from "../../components/PinInput";
import { welcomeBack } from "../../services/pinService";
import useAuthStore from "../../store/useAuthStore";
import useProfileStore from "../../store/useProfileStore";

export default function LoginWithPinScreen() {
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTime, setLockTime] = useState(0);
    
    const { login, logout } = useAuthStore();
    const { fetchProfile } = useProfileStore();
    
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fade in animation on mount
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, []);

    // Shake animation for wrong PIN
    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Countdown timer for lock
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLocked && lockTime > 0) {
            timer = setTimeout(() => setLockTime(lockTime - 1), 1000);
        } else if (isLocked && lockTime === 0) {
            setIsLocked(false);
            setAttempts(0);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLocked, lockTime]);

    const handleLogin = async () => {
        if (pin.length !== 4) {
            Alert.alert("Invalid PIN", "Please enter your 4-digit security PIN.");
            return;
        }

        if (isLocked) {
            Alert.alert("Account Locked", `Too many attempts. Try again in ${lockTime} seconds.`);
            return;
        }

        setIsLoading(true);
        try {
            // 1. Verify the PIN against the one stored on the device
            await welcomeBack(pin);

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
            // Increment attempts and lock after 3 failed attempts
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            if (newAttempts >= 3) {
                setIsLocked(true);
                setLockTime(30); // Lock for 30 seconds
                Alert.alert(
                    "Too Many Attempts",
                    "Account locked for 30 seconds due to multiple failed attempts."
                );
            } else {
                shake(); // Shake animation for wrong PIN
                Alert.alert(
                    "Login Failed", 
                    `Incorrect PIN. You have ${3 - newAttempts} attempts remaining.`
                );
            }
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

    const handleForgotPin = () => {
        Alert.alert(
            "Forgot PIN?",
            "You'll need to log in with your password to reset your PIN. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Continue", onPress: handleLoginWithPassword }
            ]
        );
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    className="flex-1"
                >
                    <Animated.View 
                        style={{ 
                            opacity: fadeAnim,
                            transform: [{ translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0]
                            })}]
                        }}
                        className="flex-1 px-6"
                    >
                        {/* Header with Back Button */}
                        <View className="pt-6 pb-4">
                            <TouchableOpacity 
                                onPress={() => router.push("/auth/login")}
                                className="flex-row items-center mb-6"
                                activeOpacity={0.7}
                            >
                                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                                    <ArrowLeft size={20} color="#374151" />
                                </View>
                                <Text className="text-lg font-semibold text-gray-800">Back</Text>
                            </TouchableOpacity>

                            <View className="items-center mb-8">
                                <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
                                    <Lock size={40} color="#059669" />
                                </View>
                                <Text className="text-2xl font-bold text-gray-800 mb-2">
                                    Secure Login
                                </Text>
                                <Text className="text-gray-600 text-center">
                                    Enter your PIN for quick and secure access
                                </Text>
                            </View>
                        </View>

                        {/* Main Content */}
                        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-50 border border-gray-100">
                            <View className="mb-6">
                                <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                    Enter Your 4-Digit PIN
                                </Text>
                                
                                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                                    <View className="mb-6">
                                        <PinInput
                                            label=""
                                            value={pin}
                                            onChangeText={setPin}
                                            maxLength={4}
                                            autoFocus={true}
                                            secureTextEntry={!showPin}
                                            containerStyle="justify-center"
                                            cellStyle="w-16 h-16 mx-2 border-2 border-gray-300 rounded-xl"
                                            activeCellStyle="border-emerald-500 bg-emerald-50"
                                            textStyle="text-3xl font-bold text-gray-800"
                                        />
                                        
                                        {/* Show/Hide PIN Toggle */}
                                        {/* <TouchableOpacity
                                            onPress={() => setShowPin(!showPin)}
                                            className="flex-row items-center justify-center mt-4"
                                            activeOpacity={0.7}
                                        >
                                            {showPin ? (
                                                <>
                                                    <EyeOff size={16} color="#6B7280" className="mr-2" />
                                                    <Text className="text-gray-500">Hide PIN</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye size={16} color="#6B7280" className="mr-2" />
                                                    <Text className="text-gray-500">Show PIN</Text>
                                                </>
                                            )}
                                        </TouchableOpacity> */}
                                    </View>
                                </Animated.View>

                                {/* Attempts Counter */}
                                {attempts > 0 && !isLocked && (
                                    <View className="p-3 bg-amber-50 rounded-lg border border-amber-100 mb-4">
                                        <Text className="text-amber-700 text-sm text-center">
                                            {attempts} failed attempt{attempts > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                )}

                                {/* Locked State */}
                                {isLocked && (
                                    <View className="p-4 bg-red-50 rounded-lg border border-red-100 mb-6">
                                        <View className="flex-row items-center justify-center">
                                            <Lock size={18} color="#DC2626" className="mr-2" />
                                            <Text className="text-red-700 font-medium">
                                                Account locked for {formatTime(lockTime)}
                                            </Text>
                                        </View>
                                        <Text className="text-red-600 text-sm text-center mt-2">
                                            Too many incorrect attempts. Please wait.
                                        </Text>
                                    </View>
                                )}

                                {/* Unlock Button */}
                                <Button
                                    input={isLoading ? "Verifying..." : "Unlock Account"}
                                    onPress={handleLogin}
                                    color="text-white"
                                    bg={
                                        !isLocked && pin.length === 4 && !isLoading
                                            ? "bg-emerald-600"
                                            : "bg-emerald-400"
                                    }
                                    disabled={pin.length !== 4 || isLoading || isLocked}
                                    isLoading={isLoading}
                                    icon={isLoading ? undefined : "lock-open"}
                                    size="lg"
                                    style={`shadow-lg ${!isLocked && pin.length === 4 && !isLoading ? "shadow-emerald-200" : ""}`}
                                />
                            </View>

                            {/* Alternative Options */}
                            <View className="space-y-4">
                                <TouchableOpacity
                                    onPress={handleLoginWithPassword}
                                    className="py-4 border border-emerald-200 rounded-xl active:bg-emerald-50"
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center justify-center">
                                        <Lock size={18} color="#059669" className="mr-2" />
                                        <Text className="text-emerald-700 font-semibold">
                                            Login with Password Instead
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleForgotPin}
                                    className="py-4"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-center text-gray-600">
                                        Forgot your PIN?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Security Information */}
                        <View className="mt-8 p-4 bg-gray-50 rounded-xl">
                            <View className="flex-row">
                                <Shield size={18} color="#059669" className="mr-3 mt-0.5" />
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-700 mb-1">
                                        <Text className="font-semibold">Security Tips:</Text>
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        • Never share your PIN with anyone
                                        {"\n"}• Make sure no one is watching as you enter your PIN
                                        {"\n"}• Log out when using shared devices
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Biometric Option (Future Enhancement) */}
                        {/* <View className="mt-6">
                            <TouchableOpacity
                                onPress={() => Alert.alert("Coming Soon", "Biometric login will be available soon.")}
                                className="flex-row items-center justify-center py-4"
                                activeOpacity={0.7}
                            >
                                <Fingerprint size={20} color="#059669" className="mr-2" />
                                <Text className="text-emerald-700 font-medium">
                                    Use Biometric Authentication
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}