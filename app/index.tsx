import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StatusBar, Text, View } from "react-native";
import Button from "../components/Button";
import GradientText from "../components/GradientText";
import "../global.css";

export default function App() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-center items-center relative"
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <Image
        source={require("../assets/images/transparent-logo.png")}
        className="absolute top-20"
        resizeMode="cover"
      />
      <View className="flex flex-row gap-1 absolute top-56">
        <Text className="text-2xl font-bold">Save Now,</Text>
        <GradientText>Enjoy Later</GradientText>
      </View>
      <View className="absolute bottom-28 w-[90%] gap-2.5">
        <Button
          onPress={() => {
            router.push("/auth/signup");
          }}
          input="Get Started"
          bg="bg-white"
          color="text-black"
        />
        <Button
          input="Login"
          bg="bg-transparent"
          border="border-[1px] border-white"
          onPress={() => {
            router.push("/auth/login");
          }}
        />
      </View>
    </ImageBackground>
  );
}
