import { Pencil, Save } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface EditableFieldProps {
    label: string;
    initialValue: string;
    onSave: (newValue: string) => void;
}

export default function EditableField({
    label,
    initialValue,
    onSave,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handlePress = () => {
        if (isEditing) {
            onSave(value);
            setIsEditing(false);
            Keyboard.dismiss();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-500 mb-1">
                {label}
            </Text>
            <View className="flex-row items-center justify-between border border-gray-200 bg-gray-50 rounded-lg p-3">
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={setValue}
                    editable={isEditing}
                    className={`flex-1 text-base ${
                        isEditing ? "text-gray-800" : "text-gray-600"
                    }`}
                />
                <TouchableOpacity onPress={handlePress} className="p-1">
                    {isEditing ? (
                        <Save size={20} color="#1B8A52" />
                    ) : (
                        <Pencil size={20} color="#6B7280" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
