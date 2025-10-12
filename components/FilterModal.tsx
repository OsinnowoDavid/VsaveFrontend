import { X } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function FilterModal({
    isVisible,
    onClose,
    title,
    children,
}: FilterModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
    );
}
