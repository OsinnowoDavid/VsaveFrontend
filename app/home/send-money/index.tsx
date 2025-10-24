import { router } from "expo-router";
import { ArrowLeft, Landmark, Users } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChoiceCard = ({
    icon,
    title,
    description,
    onPress,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-white p-6 rounded-xl border border-gray-200 flex-row items-center space-x-5 mb-4 shadow-sm"
    >
        <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-2">
            {icon}
        </View>
        <View>
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{description}</Text>
        </View>
    </TouchableOpacity>
);

export default function SendMoneyScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">
                    Send Money
                </Text>
            </View>

            <View className="p-6">
                <Text className="text-base text-gray-600 mb-8">
                    Choose a destination for your transfer. You can send money
                    to any Nigerian bank account or instantly to another Vsave
                    user.
                </Text>

                <ChoiceCard
                    icon={<Landmark size={24} color="#1B8A52" />}
                    title="Send to Bank Account"
                    description="Transfer to any local bank."
                    onPress={() =>
                        router.push("/home/send-money/bank-transfer")
                    }
                />

                <ChoiceCard
                    icon={<Users size={24} color="#1B8A52" />}
                    title="Send to Vsave User"
                    description="Instant transfer to a Vsave wallet."
                    onPress={() =>
                        router.push("/home/send-money/vsave-transfer")
                    }
                />
            </View>
        </SafeAreaView>
    );
}
