import React from "react";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import GradientText from "../../../components/GradientText";
import "../../../global.css";

export default function App() {
  return (
    <ImageBackground
      source={require("../../../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-center items-center relative"
      resizeMode="cover"
    >
      <Image
        source={require("../../../assets/images/transparent-logo.png")}
        className="absolute top-20"
        resizeMode="cover"
      />
      <View className="flex flex-row gap-1 absolute top-56">
        <Text className="text-2xl font-bold">Save Now,</Text>
        <GradientText>Enjoy Later</GradientText>
      </View>
      <View className="absolute bottom-28 w-[90%] gap-2.5">
        <Pressable className="bg-white w-full py-3 rounded-lg">
          <Text className="text-center font-semibold">Get Started</Text>
        </Pressable>
        <Pressable className="bg-transparent border-2 border-white w-full py-3 rounded-lg ">
          <Text className="text-white text-center font-semibold">Login</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}
