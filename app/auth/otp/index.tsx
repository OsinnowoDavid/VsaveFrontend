import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import PinInput from "../../../components/PinInput";

export default function OTPScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {};

  return (
    <ScreenWrapper>
      <KeyboardAvoidingWrapper>
        <View className="px-6 py-8 bg-white w-full rounded-t-3xl">
          <Text className="text-2xl font-bold pb-4 mb-8 text-center border-b-[0.3px] border-gray-500">
            OTP Verifcation
          </Text>
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
            <Text className="font-medium">Didn't recieve the OTP?</Text>
            <Pressable>
              <Text className="text-green-700 font-medium text-[16px]">
                Resend
              </Text>
            </Pressable>
          </View>
          <Button
            input="Verify and Continue"
            onPress={() => {
              handleSubmit;
            }}
            color="text-white"
          />
        </View>
      </KeyboardAvoidingWrapper>
    </ScreenWrapper>
  );
}
