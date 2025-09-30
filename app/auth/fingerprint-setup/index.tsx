import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Switch, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";

export default function ExtraLoginSetupScreen() {
    const [isEnabled, setIsEnabled] = useState(true);
    const router = useRouter();
    return (
        <ScreenWrapper>
            <FormWrapper heading="Extra Login Options">
                <Text className="text-right text-green-700">skip</Text>
                <Image
                    source={require("../../../assets/icons/fingerprint.png")}
                    className="w-20 h-20 mx-auto"
                />
                <View className="flex items-center mt-4">
                    <Text className="font-bold text-lg">
                        Use Fingerprint To Access
                    </Text>
                    <Text className="text-gray-600">
                        Login fast and quick with biometric
                    </Text>
                </View>
                <View className="flex flex-row justify-between mt-6 my-4">
                    <View className="flex items-center justify-center">
                        <Text className="text-gray-600">
                            Activate fingerprint
                        </Text>
                    </View>
                    <Switch
                        value={isEnabled}
                        onValueChange={setIsEnabled}
                        thumbColor={isEnabled ? "#fff" : "#ccc"}
                        trackColor={{ false: "#767577", true: "#15803d" }}
                    />
                </View>
                <Button
                    input="Use Pin Code"
                    onPress={() => {
                        router.push("/auth/pincode-setup");
                    }}
                    bg=""
                    color="text-green-700"
                    border="border border-green-700"
                />
            </FormWrapper>
        </ScreenWrapper>
    );
}
