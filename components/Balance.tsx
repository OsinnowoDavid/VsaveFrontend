import React from "react";
import { Image, Text, View } from "react-native";

export default function Balance() {
    return (
        <View
            className="border-[0.01px] mt-5 h-36 rounded-2xl relative overflow-hidden"
            style={{
                backgroundColor: "rgba(27, 138, 82, 0.7)",
            }}
        >
            <View className="w-56 h-56 flex items-center justify-center rounded-full bg-[#f8f8f8] absolute -right-12 -top-6 z-0">
                <Image
                    source={require("../assets/images/transparent-logo.png")}
                    className="w-24 h-24 opacity-40"
                />
            </View>
            <View
                className="mt-5 w-full h-40 rounded-2xl absolute -top-9 z-10 py-6 px-4 flex flex-col justify-between"
                style={{
                    backgroundColor: "rgba(27, 138, 82, 0.7)",
                }}
            >
                <View>
                    <Text className="text-white text-lg">
                        Available Balance
                    </Text>
                </View>
                <View>
                    <Text className="text-white text-4xl tracking-tighter">
                        N5000,000,000
                    </Text>
                </View>
                <View>
                    <Text className="text-[#EFEFEF] text-[16px]">
                        Pending Balance N2,500,000
                    </Text>
                </View>
            </View>
        </View>
    );
}
