import { CheckCircle2, Info, XCircle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export type NotificationType = "success" | "error" | "info";

interface NotificationCardProps {
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
}

const iconMap = {
    success: <CheckCircle2 size={24} color="#16A34A" />, // green-600
    error: <XCircle size={24} color="#DC2626" />, // red-600
    info: <Info size={24} color="#2563EB" />, // blue-600
};

export default function NotificationCard({
    type,
    title,
    message,
    timestamp,
}: NotificationCardProps) {
    return (
        <View className="flex-row items-start space-x-4 p-4 bg-white border-b border-gray-100">
            <View className="mt-1 mr-2">{iconMap[type]}</View>
            <View className="flex-1">
                <Text className="text-base font-bold text-gray-800">
                    {title}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">{message}</Text>
                <Text className="text-xs text-gray-400 mt-2">{timestamp}</Text>
            </View>
        </View>
    );
}
