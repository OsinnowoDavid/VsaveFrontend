import { Country } from "country-state-city";
import { ChevronDown, Search, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    KeyboardTypeOptions,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateFormField } from "../utils";
import FormFieldError from "./FormFieldError";

interface PhoneInputProps {
    label: string;
    phone: string;
    countryCode: string;
    onPhoneChange: (text: string) => void;
    onCountryChange: (value: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    validate?: boolean;
    schema?: any;
    field?: any;
}

const countries = Country.getAllCountries()
    .filter((country) => country.phonecode) // Ensure country has a phone code
    .map((country) => ({
        // The label will be shown in the dropdown list
        label: `${country.name} (${country.phonecode})`,
        // The value is what's stored in state when selected
        value: country.phonecode,
        isoCode: country.isoCode,
    }))
    // Remove duplicates for countries sharing the same phone code, keeping the first one.
    .filter(
        (country, index, self) =>
            index === self.findIndex((c) => c.value === country.value)
    )
    .sort((a, b) => a.label.localeCompare(b.label));

export default function PhoneInput({
    label,
    phone,
    countryCode,
    onPhoneChange,
    onCountryChange,
    placeholder,
    keyboardType,
    validate = false,
    schema,
    field,
}: PhoneInputProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [fieldError, setFieldError] = useState("");

    const handleBlur = () => {
        if (validate && schema && field !== undefined) {
            const error = validateFormField(schema, field).errorMessage;
            if (error) setFieldError(error);
        }
    };

    const handleFocus = () => {
        setFieldError("");
    };

    const filteredCountries = useMemo(() => {
        if (!searchQuery) {
            return countries;
        }
        return countries.filter((country) =>
            country.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    const inputContainerStyle =
        "w-full h-12 rounded-lg bg-gray-100 border border-gray-200 flex-row items-center";

    return (
        <View className="mb-6">
            {label && (
                <Text className="text-sm font-medium text-gray-800 mb-1">
                    {label}
                </Text>
            )}
            <View className={inputContainerStyle}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="w-[100px] h-full flex-row items-center justify-between px-3 border-r border-gray-300"
                >
                    <Text className="text-sm text-gray-800 font-medium">
                        {`+${countryCode}`}
                    </Text>
                    <ChevronDown size={16} color="#6B7280" />
                </TouchableOpacity>

                <View className="flex-1 h-full px-3 justify-center">
                    <TextInput
                        value={phone}
                        onChangeText={onPhoneChange}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        className="text-sm text-gray-800"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                </View>
            </View>
            {validate && <FormFieldError error={fieldError} />}

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="p-4 border-b border-gray-200">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-gray-800">
                                Select Country
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="p-1"
                            >
                                <X size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center border border-gray-300 bg-gray-50 rounded-lg px-3 h-11">
                            <Search
                                size={18}
                                color="#6B7280"
                                strokeWidth={2.5}
                            />
                            <TextInput
                                placeholder="Search for a country..."
                                placeholderTextColor="#6B7280"
                                className="px-2 text-base flex-1 h-full"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.isoCode}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onCountryChange(item.value);
                                    setModalVisible(false);
                                    setSearchQuery("");
                                }}
                                className="p-4 border-b border-gray-100 flex-row justify-between items-center"
                            >
                                <Text className="text-base text-gray-800 flex-1">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text className="text-center text-gray-500 p-8">
                                No countries found.
                            </Text>
                        }
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}
