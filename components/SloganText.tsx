import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

interface SloganTextProps {
    tagline?: string;
}

export default function SloganText({
    tagline = "Secure financial planning with  encryption and intuitive controls",
}: SloganTextProps): React.ReactElement {
    return (
        <View className="items-center">
            <Animated.View
                entering={FadeIn.duration(500)}
                className="flex-row items-baseline mb-4"
            >
                {/* <View className="w-3 h-3 bg-emerald-400 rounded-full mr-3" /> */}
                {/* <Text className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                    Financial Security
                </Text> */}
            </Animated.View>

            <Animated.View
                entering={FadeInUp.duration(700).delay(200)}
                className="items-center"
            >
                <View className="flex-row items-baseline flex-wrap justify-center">
                    <Text className="text-5xl font-bold text-gray-900 leading-tight">
                        Save Smarter,
                    </Text>
                </View>
                <View className="flex-row items-baseline mt-2">
                    <Text className="text-5xl font-bold text-gray-900">
                        Live{" "}
                    </Text>
                    <Text className="text-5xl font-bold text-emerald-600">
                        Better
                    </Text>
                </View>

                {/* Divider */}
                <View className="w-20 h-0.5 bg-emerald-200 my-8" />
                {/* 
                <Text className="text-lg text-gray-500 text-center px-6 leading-relaxed">
                    {tagline}
                </Text> */}

                {/* Feature Points */}
                {/* <View className="flex-row flex-wrap justify-center mt-8 gap-4">
                    <View className="flex-row items-center bg-emerald-50 px-4 py-2 rounded-full">
                        <Text className="text-emerald-700 text-sm font-medium">✓ Access to loan</Text>
                    </View>
                    <View className="flex-row items-center bg-emerald-50 px-4 py-2 rounded-full">
                        <Text className="text-emerald-700 text-sm font-medium">✓ Secure Storage</Text>
                    </View>
                    <View className="flex-row items-center bg-emerald-50 px-4 py-2 rounded-full">
                        <Text className="text-emerald-700 text-sm font-medium">✓ PIN Protection</Text>
                    </View>
                </View> */}
            </Animated.View>
        </View>
    );
}
