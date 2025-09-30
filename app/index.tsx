import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StatusBar, View } from "react-native";
import Button from "../components/Button";
import SloganText from "../components/SloganText";
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
            <SloganText />
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
