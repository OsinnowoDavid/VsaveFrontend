import { Text, View } from "react-native";
import Button from "./Button";

export default function SavingsAccountInfo() {
    return (
        <View className="mt-24 w-[90%] mx-auto">
            <Text className="text-3xl text-center mb-6 font-semibold">
                Vsave Information
            </Text>
            <View className="bg-[rgba(27,138,82,0.1)] p-6 flex justify-center items-center rounded-lg mb-8">
                <Text className="text-3xl text-gray-700 py-3">Wema Bank</Text>
                <View>
                    <Text className="text-3xl font-semibold py-3">
                        1234567890
                    </Text>
                </View>
                <Text className="text-base text-gray-700 py-3">
                    Use the virtual Account Number above and it&apos;s valid for
                    for
                </Text>
                <Text className="text-green-700 font-semibold text-2xl">
                    15:00
                </Text>
            </View>
            <Button input="Continue" onPress={() => {}} />
        </View>
    );
}
