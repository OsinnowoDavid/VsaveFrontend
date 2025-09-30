import React from "react";
import { Image, ImageBackground } from "react-native";
import SloganText from "./SloganText";

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
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
      <SloganText />
      {children}
    </ImageBackground>
  );
};

export default ScreenWrapper;
