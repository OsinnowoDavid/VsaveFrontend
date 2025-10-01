import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SavingsCard() {
  return (
    <View className="absolute w-[350px] h-[170px] ml-1 top-[62px]  bg-[#6BAA8A] rounded-m mb-2">
      {/* Header */}
      <View className="w-full h-[29px] justify-center px-4 pt-2">
        <Text className="text-[15px] font-semibold text-[#FAFAFA] mb-2">
          Available Balance: ₦300,000
        </Text>
      </View>

      {/* Gradient Box */}
      <LinearGradient
        colors={["rgba(27,138,82,0.39)", "rgba(11,101,56,0.39)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 2 }}
        className="flex-1 mx-[10px] rounded-md px-[10px] py-2"
      >
        {/* Savings Row */}
        <View className="flex-row justify-between items-center h-14 ">
          <View className="py-2">
            <Text className="text-[15px] text-[rgba(250,250,250,0.6)]">
              My Savings
            </Text>
            <Text className="text-[16px] font-semibold text-white">
              ₦100,000
            </Text>
          </View>

          {/* Illustration */}
          <Image
            source={require("../assets/images/pig.png")} // replace with actual image
            className="w-[120px] h-14"
            resizeMode="contain"
          />
        </View>

        {/* Maturity Info */}
        <View className="border-t border-[rgba(250,250,250,0.2)] py-1">
          <Text className="text-[10px] text-[rgba(250,250,250,0.6)]">
            Next maturity: 20-09-2025 (20 days plan)
          </Text>
        </View>
      </LinearGradient>

      {/* Actions */}
      <View className="absolute bottom-3 left-[14px] right-[14px] flex-row justify-between p-2">
        <TouchableOpacity className="w-[126px] bg-[#1B8A52] rounded flex-row items-center justify-center p-2">
          <Text className="text-white text-[12px] font-semibold ">Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[126px]  bg-white rounded flex-row items-center justify-center p-2">
          <Text className="text-[#1B8A52] text-[10px] font-semibold">
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
