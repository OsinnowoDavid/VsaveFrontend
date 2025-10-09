import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import SavingsCard from "../../components/SavingsCard";

export default function Savings() {
    return (
        <HomeScreenWrapper bgColor="bg-gray-50">
            <SavingsCard />
            <View className="p-4 flex-col space-y-2 mt-2 justify-center">
                {/* Inner Card */}
                <View className="w-[330px] h-[44px] flex-row items-center justify-between px-4 py-1.5 bg-white rounded shadow">
                    {/* Left Section */}
                    <View className="flex-row items-center space-x-2">
                        {/* Icon Placeholder */}
                        <View className="w-8 h-8 rounded-full bg-gradient-to-b from-[#5D8A1B52] to-[#18240770] flex items-center justify-center">
                            {/* replace with actual icon/gradient illustration */}
                            <View className="w-6 h-6 rounded-full bg-pink-400" />
                        </View>

                        {/* Texts */}
                        <View>
                            <Text className="text-[12px] font-medium text-[#212121]">
                                Active Plan
                            </Text>
                            <Text className="text-[10px] text-[#5C5A5A]">
                                6 Ongoing plans
                            </Text>
                        </View>
                    </View>

                    {/* Right Section */}
                    <TouchableOpacity
                        className="flex-row items-center space-x-1"
                        onPress={() => router.push("/savings/active-plan")}
                    >
                        <Text className="text-[10px] text-[#1B8A52]">
                            View all
                        </Text>
                        <ArrowRight
                            size={16}
                            color="#1B8A52"
                            strokeWidth={1.5}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </HomeScreenWrapper>
    );
}
