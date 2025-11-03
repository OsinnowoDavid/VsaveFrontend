import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AvailablePlanCardProps {
    title: string;
    amount: number;
    frequency: string;
    duration: number;
    maturityAmount: number;
    onPress: () => void;
}

export default function AvailablePlanCard({
    title,
    amount,
    frequency,
    duration,
    maturityAmount,
    onPress,
}: AvailablePlanCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4"
        >
            <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800 w-[85%]">
                    {title}
                </Text>
                <Feather name="chevron-right" size={24} color="#1B8A52" />
            </View>
            <Text className="text-gray-500 mt-1 capitalize">
                Save ₦{amount.toLocaleString()} {frequency.toLowerCase()} for{" "}
                {duration} days
            </Text>

            <View className="mt-4 pt-3 border-t border-gray-200">
                <Text className="text-sm text-gray-500">Maturity Amount</Text>
                <Text className="text-xl font-bold text-[#1B8A52]">
                    ₦{maturityAmount.toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
