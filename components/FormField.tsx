import { ChevronDown, Eye, EyeOff, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardTypeOptions,
    Modal,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { validateFormField } from "../utils";
import FormFieldError from "./FormFieldError";

interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    type?: "text" | "select";
    options?: { label: string; value: string }[];
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    validate?: boolean;
    schema?: any;
    field?: any;
}

export default function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    type = "text",
    options = [],
    keyboardType,
    maxLength,
    validate = false,
    schema,
    field,
}: FormFieldProps) {
    const [fieldError, setFieldError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleFocus = () => {
        if (!validate) return;
        setFieldError("");
    };

    const handleBlur = () => {
        if (!validate) return;
        const error = validateFormField(schema, field).errorMessage;
        if (!!error) setFieldError(error);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const inputContainerStyle =
        "w-full h-12 px-3 rounded-lg bg-gray-100 border border-gray-200 flex-row items-center";
    const textStyle = "text-lg text-gray-800";

    return (
        <View className="mb-6">
            {label && (
                <Text className="text-lg font-medium text-gray-800 mb-1">
                    {label}
                </Text>
            )}
            <View
                className={`${inputContainerStyle} ${type === "select" ? "justify-center" : ""}`}
            >
                {type === "select" ? (
                    <TouchableOpacity
                        onPress={() => setPickerVisible(true)}
                        className="w-full h-full flex-row items-center justify-between"
                    >
                        <Text className="text-sm text-gray-800">
                            {options.find((opt) => opt.value === value)
                                ?.label || placeholder}
                        </Text>
                        <ChevronDown size={20} color="#6B7280" />
                    </TouchableOpacity>
                ) : (
                    <>
                        <TextInput
                            className="flex-1 text-sm text-gray-800"
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            secureTextEntry={
                                secureTextEntry && !isPasswordVisible
                            }
                            keyboardType={keyboardType}
                            maxLength={maxLength}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        {secureTextEntry && (
                            <Pressable onPress={togglePasswordVisibility}>
                                {isPasswordVisible ? (
                                    <EyeOff size={20} color="#6B7280" />
                                ) : (
                                    <Eye size={20} color="#6B7280" />
                                )}
                            </Pressable>
                        )}
                    </>
                )}
            </View>
            {validate && <FormFieldError error={fieldError} />}

            {type === "select" && (
                <Modal
                    visible={isPickerVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setPickerVisible(false)}
                >
                    <SafeAreaView className="flex-1 justify-end bg-black/50">
                        <View className="bg-white rounded-t-3xl p-6 max-h-[50%]">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold text-gray-800">
                                    {label}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setPickerVisible(false)}
                                >
                                    <X size={24} color="#333" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onChangeText(item.value);
                                            setPickerVisible(false);
                                        }}
                                        className="py-4 border-b border-gray-100"
                                    >
                                        <Text className="text-base text-gray-700">
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
            )}
        </View>
    );
}
