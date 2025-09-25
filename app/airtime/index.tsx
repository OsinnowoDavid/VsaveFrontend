import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image, TextInput } from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import Ballance from "../../components/Ballance";
import Button from "../../components/Button";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidWrapper";
// Example network data (replace img with your SVGs or images)
const networks = [
  { id: "mtn", img: require("../../assets/images/mtn.png") },
  { id: "airtel", img: require("../../assets/images/airtel.png") },
  { id: "glo", img: require("../../assets/images/glo.png") },
  { id: "etisalat", img: require("../../assets/images/etisalat.png") },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000];

const Index = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>(""); // single source of truth for amount
  const [phone, setPhone] = useState("");

  return (
    <View>

    

      <View className="mt-2">
        <Ballance />
      </View>

      <View className="absolute top-[200px] self-center w-[300px] bg-white rounded-xl p-4">
        {/* Title */}
        <Text className="text-[10px] font-medium text-[#212121] mb-2">
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
                source={net.img}
                className="w-full h-full rounded-md"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Fake Dropdown */}
        <View className="w-[260px] h-[40px] bg-[#F9FAFB] border border-[#E5E7EA] rounded-lg px-3 justify-center mb-6">
          <Text className="text-[#9EA2AE] text-[14px]">
            {selectedNetwork ? selectedNetwork.toUpperCase() : "Select Network"}
          </Text>
        </View>

        {/* Quick Amount Buttons */}
        <View className="w-[260px] flex-col gap-3 mb-4">
          {/* First row */}
          <View className="flex-row justify-between">
            {quickAmounts.slice(0, 4).map((amt) => (
              <TouchableOpacity
                key={amt}
                onPress={() => setAmount(String(amt))}
                className={`w-[60px] h-[39px] rounded-md items-center justify-center ${
                  amount === String(amt) ? "bg-[#1B8A52]" : "bg-[#FAFAFA]"
                }`}
              >
                <Text
                  className={`text-[12px] font-medium ${
                    amount === String(amt) ? "text-white" : "text-[#1B8A52]"
                  }`}
                >
                  N{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second row */}
          <View className="flex-row justify-between">
            {quickAmounts.slice(4, 8).map((amt) => (
              <TouchableOpacity
                key={amt}
                onPress={() => setAmount(String(amt))}
                className={`w-[60px] h-[39px] rounded-md items-center justify-center ${
                  amount === String(amt) ? "bg-[#1B8A52]" : "bg-[#FAFAFA]"
                }`}
              >
                <Text
                  className={`text-[12px] font-medium ${
                    amount === String(amt) ? "text-white" : "text-[#1B8A52]"
                  }`}
                >
                  N{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View className="w-[260px] mb-6">
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
        <View className="w-[260px]">
          <Text className="text-[12px] font-medium text-[#131927] mb-1">
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
        <Button input="Proceed" onPress={() => {}} color="text-white" />
        </View>
      </View>
    </View>
      

  );
};

export default Index;
