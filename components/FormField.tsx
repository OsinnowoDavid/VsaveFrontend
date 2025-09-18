import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import ScrollPicker from "../hooks/react-native-scroll-picker";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  type = "text",
  options = [],
}: FormFieldProps) {
  const [selectedValue, setSelectedValue] = useState(options[0]?.value ?? "");
  return (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-700 mb-2">{label}</Text>

      {type === "text" ? (
        <TextInput
          className="border border-gray-300 rounded-md px-3 py-3 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={secureTextEntry}
        />
      ) : (
        <View
          pointerEvents="box-none"
          className="border border-gray-300 rounded-md px-1 w-full h-16"
        >
          {Platform.OS === "android" ? (
            <ScrollPicker
              list={options}
              onItemPress={onChangeText}
              labelColor="#111"
              selectedColor="#000"
            />
          ) : (
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => setSelectedValue(value)}
              style={{
                height: 53,
                justifyContent: "center",
              }}
              itemStyle={{ color: "#111", fontSize: 17, fontWeight: "500" }}
            >
              {options.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label ?? "Missing label"}
                  value={opt.value}
                />
              ))}
            </Picker>
          )}
        </View>
      )}
    </View>
  );
}
