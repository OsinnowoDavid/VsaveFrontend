import {
    Check,
    FileText,
    Share2,
    UserPlus,
    X as XIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

interface TransactionStatusModalProps {
    isVisible: boolean;
    status: "success" | "failure";
    onRedirectHome: () => void;
}

const iconConfig = {
    success: {
        Icon: Check,
        color: "#16A34A", // green-600
        bgColor: "bg-green-100",
        effectColor: "bg-green-200/50",
        text: "Successful",
        textColor: "text-green-600",
    },
    failure: {
        Icon: XIcon,
        color: "#DC2626", // red-600
        bgColor: "bg-red-100",
        effectColor: "bg-red-200/50",
        text: "Failed",
        textColor: "text-red-600",
    },
};

const ActionButton = ({
    icon,
    label,
    onPress,
}: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}) => (
    <TouchableOpacity onPress={onPress} className="items-center space-y-2">
        <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
            {icon}
        </View>
        <Text className="text-xs text-gray-600 font-medium">{label}</Text>
    </TouchableOpacity>
);

export default function TransactionStatusModal({
    isVisible,
    status,
    onRedirectHome,
}: TransactionStatusModalProps) {
    const [countdown, setCountdown] = useState(5);
    const config = iconConfig[status];

    // Effect to handle the countdown timer
    useEffect(() => {
        if (isVisible) {
            setCountdown(5); // Reset countdown on show
            const timer = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isVisible]);

    // Effect to handle the redirection when countdown finishes
    useEffect(() => {
        if (isVisible && countdown < 1) {
            onRedirectHome();
        }
    }, [isVisible, countdown, onRedirectHome]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onRedirectHome}
        >
            <SafeAreaView className="flex-1 justify-center items-center bg-black/60 p-6">
                <View className="bg-white rounded-2xl p-8 w-full items-center">
                    {/* Icon with effect */}
                    <View className="relative w-28 h-28 items-center justify-center mb-6">
                        <View
                            className={`absolute w-28 h-28 rounded-full ${config.effectColor}`}
                        />
                        <View
                            className={`absolute w-24 h-24 rounded-full ${config.effectColor} scale-75`}
                        />
                        <View
                            className={`w-20 h-20 rounded-full items-center justify-center ${config.bgColor}`}
                        >
                            <config.Icon
                                size={40}
                                color={config.color}
                                strokeWidth={3}
                            />
                        </View>
                    </View>

                    {/* Status Text */}
                    <Text
                        className={`text-2xl font-bold mb-8 ${config.textColor}`}
                    >
                        {config.text}
                    </Text>

                    {/* Action Buttons */}
                    <View className="flex-row justify-around w-full mb-8">
                        <ActionButton
                            icon={<UserPlus size={24} color="#4B5563" />}
                            label="Save Beneficiary"
                            onPress={() => {
                                /* TODO */
                            }}
                        />
                        <ActionButton
                            icon={<Share2 size={24} color="#4B5563" />}
                            label="Share Receipt"
                            onPress={() => {
                                /* TODO */
                            }}
                        />
                        <ActionButton
                            icon={<FileText size={24} color="#4B5563" />}
                            label="View Receipt"
                            onPress={() => {
                                /* TODO */
                            }}
                        />
                    </View>

                    {/* Countdown */}
                    <Text className="text-sm text-gray-500 mb-4">
                        Redirecting to home in {countdown}s...
                    </Text>

                    {/* Redirect Button */}
                    <Button
                        input="Go to Home"
                        onPress={onRedirectHome}
                        variant="outline"
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
}
