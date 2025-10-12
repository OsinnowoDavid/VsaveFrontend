import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800 ml-4">
                        Privacy Policy
                    </Text>
                </View>

                <View className="p-6">
                    <Text className="text-sm text-gray-500 mb-6">
                        Last updated: October 26, 2023
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        1. Introduction
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        Welcome to Vsave. We are committed to protecting your
                        personal information and your right to privacy. If you
                        have any questions or concerns about our policy, or our
                        practices with regards to your personal information,
                        please contact us.
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        2. Information We Collect
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        We collect personal information that you voluntarily
                        provide to us when you register on the app, express an
                        interest in obtaining information about us or our
                        products and services, when you participate in
                        activities on the app or otherwise when you contact us.
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        3. How We Use Your Information
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        We use personal information collected via our app for a
                        variety of business purposes described below. We process
                        your personal information for these purposes in reliance
                        on our legitimate business interests, in order to enter
                        into or perform a contract with you, with your consent,
                        and/or for compliance with our legal obligations.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
