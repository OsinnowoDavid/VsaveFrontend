import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ImageBackground, StatusBar, View } from "react-native";
import Button from "../components/Button";
import SloganText from "../components/SloganText";
import "../global.css";
import { hasPin } from "../services/pinService";
import useAuthStore from "../store/useAuthStore";
import useProfileStore from "../store/useProfileStore";

export default function App() {
    const router = useRouter();
    const { hasCachedToken } = useAuthStore();
    const { fetchProfile } = useProfileStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginPress = async () => {
        setIsLoading(true);
        if (hasCachedToken) {
            try {
                // 1. Attempt to validate the token by fetching the profile
                const token = await AsyncStorage.getItem("authToken");
                if (!token) throw new Error("No token found");

                const profileResponse = await fetchProfile(token);
                if (!profileResponse.success) {
                    // If profile fetch fails (e.g., JWT expired), treat as logged out.
                    throw new Error("Session expired");
                }

                // 2. If token is valid, check for PIN and redirect
                const userHasPin = await hasPin();
                if (userHasPin) {
                    router.push("/auth/login-with-pin");
                } else {
                    // This case happens if a user logs in but quits before setting a PIN
                    router.push("/auth/pincode-setup");
                }
            } catch {
                // If token is invalid or any other error occurs, force a password login.
                Alert.alert(
                    "Session Expired",
                    "Please log in again to continue."
                );
                router.push("/auth/login");
                try {
                    // 1. Attempt to validate the token by fetching the profile
                    const token = await AsyncStorage.getItem("authToken");
                    if (!token) throw new Error("No token found");

                    const profileResponse = await fetchProfile(token);
                    if (!profileResponse.success) {
                        // If profile fetch fails (e.g., JWT expired), treat as logged out.
                        throw new Error("Session expired");
                    }

                    // 2. If token is valid, check for PIN and redirect
                    const userHasPin = await hasPin();
                    if (userHasPin) {
                        router.push("/auth/login-with-pin");
                    } else {
                        // This case happens if a user logs in but quits before setting a PIN
                        router.push("/auth/pincode-setup");
                    }
                } catch {
                    // If token is invalid or any other error occurs, force a password login.
                    Alert.alert(
                        "Session Expired",
                        "Please log in again to continue."
                    );
                    router.push("/auth/login");
                }
            }
        } else {
            // No cached token, go to standard login
            router.push("/auth/login");
        }
        setIsLoading(false);
    };

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
                    onPress={handleLoginPress}
                    isLoading={isLoading}
                />
            </View>
        </ImageBackground>
    );
}