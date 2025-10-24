import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import MenuListItem from "../../components/MenuListItem";
import { accountItems, supportItems } from "../../constants/menuItems";
import useAuthStore from "../../store/useAuthStore";

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
                "You have disabled biometric authentication."
            );
            return;
        }

        // --- Logic for ENABLING biometrics ---
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert(
                "Unsupported Device",
                "Your device does not support biometric authentication."
            );
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert(
                "No Biometrics Enrolled",
                "You have not set up any biometrics on this device. Please go to your device settings to add a fingerprint or Face ID."
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
                "You can now log in using biometrics."
            );
        }
    };

    const handleLogout = () => {
        const logout = useAuthStore.getState().logout;
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
                    onPress: () => {
                        logout();
                        router.replace("/auth/login");
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
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
                            <MenuListItem
                                key={item.label}
                                item={item}
                                isLastItem={index === accountItems.length - 1}
                                switchValue={isBiometricsEnabled}
                                onSwitchChange={handleBiometricsToggle}
                            />
                        ))}
                    </View>

                    {/* Support Section */}
                    <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 px-1">
                        Support
                    </Text>
                    <View className="bg-white rounded-lg shadow-sm mb-8">
                        {supportItems.map((item, index) => (
                            <MenuListItem
                                key={item.label}
                                item={item}
                                isLastItem={index === supportItems.length - 1}
                            />
                        ))}
                    </View>

                    {/* Log Out Button */}
                    <TouchableOpacity
                        className="flex-row items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
                        onPress={handleLogout}
                    >
                        <LogOut size={24} color="#EF4444" />
                        <Text className="text-lg text-red-500 ml-2">
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}
