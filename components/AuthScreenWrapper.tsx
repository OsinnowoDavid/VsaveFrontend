import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientText from "./GradientText";
type Props = {
  children: React.ReactNode;
  bg?: string;
};

const ScreenWrapper = ({ children, bg }: Props) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <ImageBackground
      source={require("../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-around items-center relative"
      resizeMode="cover"
    >
      <Image
        source={require("../assets/images/transparent-logo.png")}
        className="absolute top-20"
        resizeMode="cover"
      />
      <View className="flex flex-row gap-1 absolute top-56">
        <Text className="text-2xl font-bold">Save Now,</Text>
        <GradientText>Enjoy Later</GradientText>
      </View>
      {children}
    </ImageBackground>
  );
};

export default ScreenWrapper;
