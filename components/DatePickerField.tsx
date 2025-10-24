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
}

export default function DatePickerField({
    label,
    value,
    onChange,
    error,
}: DatePickerFieldProps) {
    // We will pass the error from the parent, since this component doesn't have a blur event
    // but we can add one to the touchable if needed for more complex scenarios.
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
                        // Set a reasonable maximum date (e.g., today)
                        maximumDate={new Date()}
                    />
                )}
            </View>
            {error ? <FormFieldError error={error} /> : null}
        </>
    );
}
