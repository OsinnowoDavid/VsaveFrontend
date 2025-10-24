import React from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    StatusBar,
    View,
} from "react-native";
import SloganText from "./SloganText";

export default function SplashScreen() {
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
            <SloganText />
            <View className="absolute bottom-28">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        </ImageBackground>
    );
}
