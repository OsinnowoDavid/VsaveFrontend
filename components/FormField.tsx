import React from "react";
import { Text, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-700 mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-3 text-base"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
