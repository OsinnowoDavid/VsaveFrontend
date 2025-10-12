import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Balance from "../../../components/Balance";
import Button from "../../../components/Button";
import { networks, quickAmounts } from "../../../constants/networks";

const Index = () => {
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>(""); // single source of truth for amount
    const [phone, setPhone] = useState("");

    return (
        <View className="w-[90%] mx-auto mt-2">
            <View className="mt-3 w-full mx-auto bg-[#f5f5f5] flex gap-3">
                <Balance />
                <Button
                    input="Topup my number"
                    onPress={() => {}}
                    variant="outline"
                />
            </View>

            <View className="self-center bg-white rounded-xl p-4 w-full mt-8">
                {/* Title */}
                <Text className="text-sm font-medium text-[#212121] mb-2">
                    Choose Network
                </Text>

                {/* Network Logos */}
                <View className="flex-row justify-between mb-6">
                    {networks.map((net) => (
                        <TouchableOpacity
                            key={net.id}
                            onPress={() => setSelectedNetwork(net.id)}
                            className={`w-[50px] h-[50px] rounded-md border ${
                                selectedNetwork === net.id
                                    ? "border-[#1B8A52]"
                                    : "border-transparent"
                            }`}
                        >
                            <Image
                                source={net.Icon}
                                className="w-full h-full rounded-md"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Fake Dropdown */}
                <View className="h-[40px] bg-[#F9FAFB] border border-[#E5E7EA] rounded-lg px-3 justify-center mb-6">
                    <Text className="text-[#9EA2AE] text-[14px]">
                        {selectedNetwork
                            ? selectedNetwork.toUpperCase()
                            : "Select Network"}
                    </Text>
                </View>

                {/* Quick Amount Buttons */}
                <View className="flex-col gap-3 mb-4">
                    {/* First row */}
                    <View className="flex-row flex-wrap justify-between gap-3">
                        {quickAmounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                onPress={() => setAmount(String(amt))}
                                className={`w-[60px] h-[39px] rounded-md items-center justify-center ${
                                    amount === String(amt)
                                        ? "bg-[#1B8A52]"
                                        : "bg-[#FAFAFA]"
                                }`}
                            >
                                <Text
                                    className={`text-[12px] font-medium ${
                                        amount === String(amt)
                                            ? "text-white"
                                            : "text-[#1B8A52]"
                                    }`}
                                >
                                    ₦{amt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Amount Input */}
                <View className="mb-6">
                    <Text className="text-[12px] font-medium text-[#131927] mb-1">
                        Enter Amount
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        className="w-full h-[40px] px-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EA] text-[14px] text-[#131927]"
                    />
                </View>

                {/* Phone Number Input */}
                <View>
                    <Text className="text-sm font-medium text-[#131927] mb-1">
                        Phone Number
                    </Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="numeric"
                        className="w-full h-[40px] px-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EA] text-[14px] text-[#131927]"
                    />
                </View>
                <View className="mt-10">
                    <Button
                        input="Proceed"
                        onPress={() => {}}
                        variant="classic"
                    />
                </View>
            </View>
        </View>
    );
};

export default Index;
