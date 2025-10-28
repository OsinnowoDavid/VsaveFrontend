import { Text, View } from "react-native";
import KeyboardAvoidingWrapper from "./KeyboardAvoidWrapper";

export default function FormWrapper({
    heading,
    children,
}: {
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <KeyboardAvoidingWrapper modal={true}>
            <View className="px-6 py-8 bg-white w-full rounded-t-3xl max-h-[80%]">
                <Text className="text-2xl font-bold pb-4 mb-10 text-center border-b-[0.3px] border-gray-500">
                    {heading}
                </Text>
                {children}
            </View>
        </KeyboardAvoidingWrapper>
    );
}
