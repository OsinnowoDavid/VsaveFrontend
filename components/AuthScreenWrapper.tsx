import React from "react";
import { Image, ImageBackground, Platform, ViewStyle } from "react-native";
import SloganText from "./SloganText";
import platform from "react-native"
const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  // Platform-specific padding
  const containerStyle: ViewStyle =
    Platform.OS === "ios"
      ? {
          paddingTop: 40,
          with: "100%",

        }
      : {
          paddingTop: 50,
        };

  return (
    <ImageBackground
      source={require("../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-around items-center relative"
      resizeMode="cover"
      style={containerStyle}
    >
      <Image
        source={require("../assets/images/transparent-logo.png")}
        className="absolute top-20 w-32 h-32"
        resizeMode="contain"
      />
      <SloganText />
      {children}
    </ImageBackground>
  );
};

export default ScreenWrapper;
