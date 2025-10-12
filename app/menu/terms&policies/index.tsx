import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsAndPoliciesScreen() {
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
                        Terms and Policies
                    </Text>
                </View>

                <View className="p-6">
                    <Text className="text-sm text-gray-500 mb-6">
                        Last updated: October 26, 2023
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        1. Terms
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        By accessing this application, you are agreeing to be
                        bound by these terms of service, all applicable laws and
                        regulations, and agree that you are responsible for
                        compliance with any applicable local laws.
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        2. Use License
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        Permission is granted to temporarily download one copy
                        of the materials (information or software) on Vsave's
                        application for personal, non-commercial transitory
                        viewing only. This is the grant of a license, not a
                        transfer of title.
                    </Text>

                    <Text className="text-lg font-bold text-gray-800 mb-2">
                        3. Disclaimer
                    </Text>
                    <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                        The materials on Vsave's application are provided on an
                        'as is' basis. Vsave makes no warranties, expressed or
                        implied, and hereby disclaims and negates all other
                        warranties including, without limitation, implied
                        warranties or conditions of merchantability, fitness for
                        a particular purpose, or non-infringement of
                        intellectual property or other violation of rights.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
