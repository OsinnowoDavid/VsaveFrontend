import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import FormFieldError from "./FormFieldError";

interface DatePickerFieldProps {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
    error?: string;
    validate?: boolean;
    schema?: any;
    field?: any;
    minimumDate?: Date; // Added minimumDate prop
    maximumDate?: Date; // Added maximumDate prop
}

export default function PickFutureDate({
    label,
    value,
    onChange,
    error,
    minimumDate, // New prop to restrict past dates
    maximumDate, // New prop to restrict far future dates
}: DatePickerFieldProps) {
    const [show, setShow] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // On Android, the picker is dismissed automatically.
        // On iOS, we need to hide it manually.
        if (Platform.OS === "ios") {
            setShow(false);
        } else {
            setShow(false);
        }

        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const formattedDate = value.toLocaleDateString("en-CA"); // YYYY-MM-DD format

    return (
        <>
            <View className="mb-6">
                <Text className="text-sm font-medium text-gray-800 mb-1">
                    {label}
                </Text>
                <TouchableOpacity
                    onPress={showDatePicker}
                    className="w-full h-12 px-3 rounded-lg bg-gray-100 border border-gray-200 flex-row items-center justify-between"
                >
                    <Text className="text-sm text-gray-800">
                        {formattedDate}
                    </Text>
                    <Calendar size={20} color="#6B7280" />
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={value}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        // FIXED: Removed maximumDate restriction to allow future dates
                        // Only set minimumDate to prevent past dates
                        minimumDate={minimumDate || new Date()} // Default to today if not provided
                        maximumDate={maximumDate} // Optional: set a far future date if needed
                    />
                )}
            </View>
            {error ? <FormFieldError error={error} /> : null}
        </>
    );
}