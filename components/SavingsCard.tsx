import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function SavingsCard() {
    return (
        <View className="w-[95%] mx-auto mt-10 bg-[#6BAA8A] flex flex-col gap-4 px-3 py-4 rounded-md">
            {/* Header */}
            <View className="w-full justify-center">
                <Text className="text-lg font-semibold text-[#FAFAFA]">
                    Available Balance: ₦300,000
                </Text>
            </View>

            {/* Gradient Box */}
            <View className="rounded-lg border-[0.01px] overflow-hidden">
                <LinearGradient
                    colors={["rgba(27,138,82,0.39)", "rgba(11,101,56,0.39)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 2 }}
                    className="px-3 py-2 rounded-md"
                >
                    {/* Savings Row */}
                    <View className="flex-row justify-between items-center">
                        <View className="py-2">
                            <Text className="text-lg text-[rgba(250,250,250,0.6)]">
                                My Savings
                            </Text>
                            <Text className="text-lg font-semibold text-white">
                                ₦100,000
                            </Text>
                        </View>

                        {/* Illustration */}
                        <Image
                            source={require("../assets/icons/piggy.png")}
                            className="w-[120px] h-14"
                            resizeMode="contain"
                        />
                    </View>

                    {/* Maturity Info */}
                    <View className="border-t border-[rgba(250,250,250,0.2)] py-1">
                        <Text className="text-sm text-[rgba(250,250,250,0.6)]">
                            Next maturity: 20-09-2025 (20 days plan)
                        </Text>
                    </View>
                </LinearGradient>
            </View>
            {/* Actions */}
            <View className="flex-row justify-between gap-3">
                <TouchableOpacity className="bg-[#1B8A52] rounded text-center items-center justify-center p-2 flex-grow">
                    <Text className="text-white text-base font-semibold whitespace-nowrap">
                        Top Up
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white rounded flex-row items-center justify-center p-2 flex-grow">
                    <Text className="text-[#1B8A52] text-base font-semibold">
                        Withdraw
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
