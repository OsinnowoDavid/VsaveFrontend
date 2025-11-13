import { Text, View, Platform } from "react-native";
import KeyboardAvoidingWrapper from "./KeyboardAvoidWrapper";

export default function FormWrapper({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  // Adjust padding based on platform
  const containerClass =
    Platform.OS === "ios"
      ? "px-6 pt-10 pb-8 bg-white w-full rounded-t-3xl max-h-[85%]"
      : "px-6 py-8 bg-white w-full rounded-t-3xl max-h-[80%]";

  return (
    <KeyboardAvoidingWrapper modal={true}>
      <View className={containerClass}>
        <Text className="text-2xl font-bold pb-4 mb-10 text-center border-b border-gray-500 text-gray-800">
          {heading}
        </Text>
        {children}
      </View>
    </KeyboardAvoidingWrapper>
  );
}
