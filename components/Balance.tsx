import * as Clipboard from "expo-clipboard";
import { Copy, Landmark } from "lucide-react-native";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import useProfileStore from "../store/useProfileStore";

export default function Balance({ version = "v1" }: { version?: "v1" | "v2" }) {
    if (version === "v1") {
        return <BalanceV1 />;
    }
    return <BalanceV2 />;
}

function BalanceV1() {
    const { profile } = useProfileStore(); // profile is { profile: ProfileDetails, kyc: KycDetails }

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return "0.00";
        return amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const copyToClipboard = async () => {
        if (profile?.profile?.virtualAccountNumber) {
            await Clipboard.setStringAsync(
                profile.profile.virtualAccountNumber
            );
            Alert.alert("Copied!", "Account number copied to clipboard.");
        }
    };

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
                <View className="flex-row items-center gap-2">
                    <Text className="text-white text-base">
                        Account Number:{" "}
                        {profile?.profile?.virtualAccountNumber ?? "123456789"}
                    </Text>
                    {profile?.profile?.virtualAccountNumber && (
                        <TouchableOpacity onPress={copyToClipboard}>
                            <Copy size={16} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    <Text className="text-white text-4xl tracking-tighter">
                        ₦{formatCurrency(profile?.profile?.availableBalance)}
                    </Text>
                </View>
                <View>
                    <Text className="text-[#EFEFEF] text-[16px]">
                        Pending Balance ₦
                        {formatCurrency(profile?.profile?.pendingBalance)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

function BalanceV2() {
    const { profile } = useProfileStore();
    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return "0.00";
        return amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };
    return (
        <View className="w-full h-28 mx-auto bg-green-100 flex flex-row gap-3">
            <View className="bg-white rounded-xl h-20 w-[90%] m-auto flex flex-row gap-3 items-center">
                <View className="flex-row justify-center items-center w-12 h-12 ml-4 my-auto bg-green-100 rounded-full">
                    <Landmark size={24} color="#1B8A52" strokeWidth={2} />
                </View>
                <View>
                    <Text className="text-xl font-bold text-gray-800">
                        ₦{formatCurrency(profile?.profile?.availableBalance)}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500">
                        Available Balance
                    </Text>
                </View>
            </View>
        </View>
    );
}
