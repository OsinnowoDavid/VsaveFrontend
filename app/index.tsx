import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Alert, 
  Image, 
  View,  
  Text 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import SloganText from "../components/SloganText";
import "../global.css";
import { hasPin } from "../services/pinService";
import useAuthStore from "../store/useAuthStore";
import useProfileStore from "../store/useProfileStore";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App(): React.ReactElement {
    const router = useRouter();
    const { hasCachedToken } = useAuthStore();
    const { fetchProfile } = useProfileStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoginPress = async (): Promise<void> => {
        setIsLoading(true);
        if (hasCachedToken) {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const profileResponse = await fetchProfile(token);
                
                if (!profileResponse.success) {
                    throw new Error("Session expired");
                }

                const userHasPin = await hasPin();
                router.replace(userHasPin ? "/auth/login-with-pin" : "/auth/pincode-setup");
            } catch {
                Alert.alert(
                    "Session Expired",
                    "Please log in again to continue."
                );
                router.replace("/auth/login");
            }
        } else {
            router.replace("/auth/login");
        }
        setIsLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            
            {/* Decorative Elements */}
            <View className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full -mr-32 -mt-32" />
            <View className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300 rounded-full -ml-40 -mb-40" />
            
            <View className="flex-1 px-8 justify-center">
                {/* Logo Container */}
                <View className="items-center mb-12">
                    <View className="w-32 h-32 rounded-3xl items-center justify-center shadow-lg shadow-emerald-100/50">
                        <Image
                            source={require("../assets/images/transparent-logo.png")}
                            className="w-24 h-24"
                            resizeMode="contain"
                        />
                    </View>
                    
                    {/* App Name */}
                    <Text className="text-3xl font-bold text-gray-900 mt-6 tracking-tight">
                        VSave
                    </Text>
                    <Text className="text-emerald-600 font-medium mt-2">
                        Secure Financial Management
                    </Text>
                </View>

                {/* Slogan Text */}
                <View className="mb-16">
                    <SloganText />
                </View>

                {/* Action Buttons */}
                <View className="w-full gap-4">
                    <Button
                        onPress={() => router.push("/auth/signup")}
                        input="Create Account"
                        bg="bg-emerald-600"
                        color="text-white"
                        // textStyle="font-semibold"
                        // icon="user-plus"
                        size="lg"
                        style="shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                        loading={isLoading}
                    />
                    
                    <Button
                    className="text-2xl"
                        input="Sign In"
                        bg="bg-white"
                        border="border border-emerald-200"
                        color="text-emerald-700"
                        onPress={handleLoginPress}
                        isLoading={isLoading}
                        textStyle="font-bold"
                        icon="log-in"
                        size="lg"
                        style="shadow-md shadow-gray-100"
                    />
                    
                    {/* Privacy Notice */}
                    {/* <Text className="text-center text-gray-400 text-xs mt-6 px-4">
                        By continuing, you agree to our{" "}
                        <Text className="text-emerald-600 font-medium">Terms</Text> and{" "}
                        <Text className="text-emerald-600 font-medium">Privacy Policy</Text>
                    </Text> */}
                </View>
            </View>
        </SafeAreaView>
    );
}