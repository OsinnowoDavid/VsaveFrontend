import React, { ReactNode } from "react";
import { Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

export default function PinInput({
    label = "Pin code",
    icon,
    textPosition,
    value,
    onChangeText,
}: {
    label?: string;
    icon?: ReactNode;
    textPosition?: "text-center" | "text-left" | "text-right";
    value: string;
    onChangeText: (text: string) => void;
}) {
    const maxLength = 6;

    const handleChange = (text: string) => {
        if (/^\d{0,6}$/.test(text)) onChangeText(text);
    };

    return (
        <View>
            <View className="flex flex-row gap-2 items-center justify-center mb-4">
                <Text
                    className={`text-md font-bold text-gray-600 ${textPosition} w-[90%]`}
                >
                    {label}
                </Text>
                {icon}
            </View>

            <TouchableWithoutFeedback>
                <View className="flex-row gap-2 mb-6 justify-center items-center">
                    {Array.from({ length: maxLength }).map((_, i) => (
                        <View
                            key={i}
                            className="w-12 h-12 border border-gray-300 rounded-md items-center justify-center bg-white"
                        >
                            <Text className="text-xl font-medium">
                                {value[i] ?? ""}
                            </Text>
                        </View>
                    ))}
                </View>
            </TouchableWithoutFeedback>

            {/* Hidden input outside the touchable */}
            <TextInput
                value={value}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={maxLength}
                focusable
                className="border"
                style={{
                    position: "absolute",
                    top: 35,
                    width: "200%",
                    left: -100,
                    height: 40,
                    opacity: 1,
                    zIndex: 1,
                    pointerEvents: "auto",
                    borderWidth: 0,
                }}
            />
        </View>
    );
}
