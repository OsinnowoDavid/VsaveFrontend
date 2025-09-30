import React from "react";
import { Text, View } from "react-native";

interface FormErrorsProps {
    error: string;
}

const FormFieldError: React.FC<FormErrorsProps> = ({ error }) => {
    return (
        <>
            {error && (
                <View className="mt-2">
                    <Text className="text-red-500 text-sm">{error}</Text>
                </View>
            )}
        </>
    );
};

export default FormFieldError;
