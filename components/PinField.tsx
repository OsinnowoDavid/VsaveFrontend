import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface PinFieldProps {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    show: boolean;
    onToggleShow: () => void;
}

export default function PinField({
    label,
    value,
    onChangeText,
    show,
    onToggleShow,
}: PinFieldProps) {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
                {label}
            </Text>

            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry={!show}
                    className="flex-1 text-lg"
                    placeholder="••••"
                />

                <TouchableOpacity
                    onPress={onToggleShow}
                    className="ml-2 p-1"
                >
                    {show ? (
                        <EyeOff size={20} color="#6b7280" />
                    ) : (
                        <Eye size={20} color="#6b7280" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
