import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";

export default function OTPScreen() {
    const router = useRouter();

    const handleSubmit = () => {
        router.push("/auth/kyc");
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="OTP Verification">
                <PinInput
                    label="Enter the 6 digit code sent to your email"
                    icon={
                        <View className="self-start pt-1 justify-self-start">
                            <Image
                                source={require("../../../assets/icons/edit.png")}
                                className="w-6 h-6"
                            />
                        </View>
                    }
                />
                <View className="flex flex-row gap-3 justify-center mb-14 items-center">
                    <Text className="font-medium">
                        Didn&apos;t recieve the OTP?
                    </Text>
                    <Pressable>
                        <Text className="text-green-700 font-medium text-[16px]">
                            Resend
                        </Text>
                    </Pressable>
                </View>
                <Button
                    input="Verify and Continue"
                    onPress={handleSubmit}
                    color="text-white"
                />
            </FormWrapper>
        </ScreenWrapper>
    );
}
