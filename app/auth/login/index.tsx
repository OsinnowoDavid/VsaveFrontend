import React, { useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import GradientText from "../../../components/GradientText";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import PinInput from "../../../components/PinInput";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {};

  return (
    <ImageBackground
      source={require("../../../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-around items-center relative"
      resizeMode="cover"
    >
      <Image
        source={require("../../../assets/images/transparent-logo.png")}
        className="absolute top-20"
        resizeMode="cover"
      />
      <View className="flex flex-row gap-1 absolute top-56">
        <Text className="text-2xl font-bold">Save Now,</Text>
        <GradientText>Enjoy Later</GradientText>
      </View>
      <KeyboardAvoidingWrapper>
        <View className="px-6 py-8 bg-white w-full rounded-t-3xl">
          <Text className="text-2xl font-bold pb-4 mb-8 text-center border-b-[0.3px] border-gray-500">
            Login
          </Text>
          <FormField
            label="Email"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            placeholder="you@example.com"
          />

          <PinInput />
          <Button
            input="Login"
            onPress={() => {
              handleSubmit;
            }}
            color="text-white"
          />
        </View>
      </KeyboardAvoidingWrapper>
    </ImageBackground>
  );
}
