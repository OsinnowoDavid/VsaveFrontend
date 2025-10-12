import { Pressable, Text } from "react-native";

export default function Button({
    onPress,
    bg = "bg-green-700",
    border = "",
    color = "text-white",
    input = "",
}) {
    return (
        <Pressable
            className={`w-full py-3 rounded-xl ${
                bg ? bg : "bg-green-700"
            } ${border}`}
            onPress={onPress}
        >
            <Text className={`text-center font-semibold ${color}`}>
                {input}
            </Text>
        </Pressable>
    );
}
