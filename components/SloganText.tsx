import { Text, View } from "react-native";
import GradientText from "./GradientText";

export default function SloganText() {
    return (
        <View className="flex flex-row gap-1 absolute top-56">
            <Text className="text-2xl font-bold">Save Now,</Text>
            <GradientText>Enjoy Later</GradientText>
        </View>
    );
}
