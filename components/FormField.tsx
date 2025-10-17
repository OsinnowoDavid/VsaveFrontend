import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";
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

    const handleFocus = () => {
        if (!validate) return;
        setFieldError("");
    };

    const handleBlur = () => {
        if (!validate) return;
        const error = validateFormField(schema, field).errorMessage;
        if (!!error) setFieldError(error);
    };

    const inputContainerStyle =
        "w-full h-12 px-3 rounded-lg bg-gray-100 border border-gray-200 justify-center";
    const textStyle = "text-lg text-gray-800";

    return (
        <View className="mb-6">
            {label && (
                <Text className="text-lg font-medium text-gray-800 mb-1">
                    {label}
                </Text>
            )}
            <View className={inputContainerStyle}>
                {type === "select" ? (
                    <Picker
                        selectedValue={value}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onValueChange={(itemValue) => onChangeText(itemValue)}
                    >
                        {options.map((option) => (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                ) : (
                    <>
                        <TextInput
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType}
                            maxLength={maxLength}
                            className={textStyle}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                    </>
                )}
            </View>
            {validate && <FormFieldError error={fieldError} />}
        </View>
    );
}
