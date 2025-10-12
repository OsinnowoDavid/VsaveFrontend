import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { ArrowRight, LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import { accountItems, supportItems } from "../../constants/menu";

export default function MenuScreen() {
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

    // Load the saved preference when the component mounts
    useEffect(() => {
        const loadBiometricsPreference = async () => {
            const savedValue = await AsyncStorage.getItem("biometrics_enabled");
            setIsBiometricsEnabled(savedValue === "true");
        };
        loadBiometricsPreference();
    }, []);

    const handleBiometricsToggle = async () => {
        const isEnabling = !isBiometricsEnabled;

        if (!isEnabling) {
            // Simply turn it off
            await AsyncStorage.setItem("biometrics_enabled", "false");
            setIsBiometricsEnabled(false);
            Alert.alert(
                "Biometrics Disabled",
                "You have disabled biometric authentication.",
            );
            return;
        }

        // --- Logic for ENABLING biometrics ---
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert(
                "Unsupported Device",
                "Your device does not support biometric authentication.",
            );
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert(
                "No Biometrics Enrolled",
                "You have not set up any biometrics on this device. Please go to your device settings to add a fingerprint or Face ID.",
            );
            return;
        }

        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm to enable biometric login",
        });

        if (success) {
            await AsyncStorage.setItem("biometrics_enabled", "true");
            setIsBiometricsEnabled(true);
            Alert.alert(
                "Biometrics Enabled",
                "You can now log in using biometrics.",
            );
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Log Out",
                    onPress: () => router.replace("/auth/login"),
                    style: "destructive",
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <HomeScreenWrapper bgColor="bg-gray-50">
            <ScrollView className="flex-1">
                <View className="p-4 mt-6">
                    {/* Account Section */}
                    <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 px-1">
                        Account
                    </Text>
                    <View className="bg-white rounded-lg shadow-sm mb-8">
                        {accountItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                className={`flex-row items-center justify-between p-4 ${
                                    index < accountItems.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                                onPress={() =>
                                    item.type === "navigation" &&
                                    router.push(item.screen as any)
                                }
                                activeOpacity={item.type === "switch" ? 1 : 0.2}
                            >
                                <View className="flex-row items-center space-x-4">
                                    <item.icon size={24} color="#4B5563" />
                                    <Text className="text-base text-gray-700 ml-2">
                                        {item.label}
                                    </Text>
                                </View>
                                {item.type === "navigation" && (
                                    <ArrowRight size={20} color="#9CA3AF" />
                                )}
                                {item.type === "switch" && (
                                    <Switch
                                        trackColor={{
                                            false: "#767577",
                                            true: "#1B8A52",
                                        }}
                                        thumbColor={
                                            isBiometricsEnabled
                                                ? "#f4f3f4"
                                                : "#f4f3f4"
                                        }
                                        onValueChange={handleBiometricsToggle}
                                        value={isBiometricsEnabled}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Support Section */}
                    <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 px-1">
                        Support
                    </Text>
                    <View className="bg-white rounded-lg shadow-sm mb-8">
                        {supportItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                className={`flex-row items-center justify-between p-4 ${
                                    index < supportItems.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                                onPress={() =>
                                    item.type === "navigation" &&
                                    router.push(item.screen as any)
                                }
                                activeOpacity={0.2}
                            >
                                <View className="flex-row items-center space-x-4">
                                    <item.icon size={24} color="#4B5563" />
                                    <Text className="text-base text-gray-700 ml-2">
                                        {item.label}
                                    </Text>
                                </View>
                                {item.type === "navigation" && (
                                    <ArrowRight size={20} color="#9CA3AF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Log Out Button */}
                    <TouchableOpacity
                        className="flex-row items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
                        onPress={handleLogout}
                    >
                        <LogOut size={24} color="#EF4444" />
                        <Text className="text-base text-red-500">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}
