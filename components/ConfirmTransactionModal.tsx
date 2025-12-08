import React from "react";
import { 
  ActivityIndicator, 
  Modal, 
  Text, 
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import PinInput from "./PinInput";

interface DetailItem {
    label: string;
    value: string | React.ReactNode;
}

interface ConfirmTransactionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    details: DetailItem[];
    amount: string;
    isLoading?: boolean;
    pin: string;
    onPinChange: (pin: string) => void;
}

export default function ConfirmTransactionModal({
    isVisible,
    onClose,
    onConfirm,
    title,
    details,
    amount,
    isLoading = false,
    pin,
    onPinChange,
}: ConfirmTransactionModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <SafeAreaView>
                            <View className="bg-white rounded-t-3xl p-6">
                                {/* Header */}
                                <Text className="text-xl font-bold text-gray-800 text-center mb-6">
                                    {title}
                                </Text>

                                {/* Details */}
                                <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                    {details.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex-row justify-between items-center py-2"
                                        >
                                            <Text className="text-sm text-gray-500">
                                                {item.label}
                                            </Text>
                                            <Text className="text-sm font-semibold text-gray-800 text-right text-nowrap w-[50%]">
                                                {item.value}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Amount */}
                                <View className="items-center mb-8">
                                    <Text className="text-sm text-gray-500">
                                        You are paying
                                    </Text>
                                    <Text className="text-4xl font-bold text-gray-900 mt-1">
                                        ₦{amount}
                                    </Text>
                                </View>

                                {/* PIN Input */}
                                <PinInput
                                    label="Enter Transaction PIN"
                                    value={pin}
                                    onChangeText={onPinChange}
                                    maxLength={4}
                                />

                                {/* Action Buttons */}
                                <View className="flex-row gap-3 mt-6">
                                    <View className="flex-1">
                                        <Button
                                            input="Cancel"
                                            onPress={onClose}
                                            variant="outline"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Button
                                            input={isLoading ? "" : "Confirm"}
                                            onPress={onConfirm}
                                        >
                                            {isLoading && (
                                                <ActivityIndicator color="white" />
                                            )}
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}