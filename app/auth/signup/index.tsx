import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  Text,
  View,
} from "react-native";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import GradientText from "../../../components/GradientText";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";

export default function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const keyboardVisible = useKeyboardVisible();

  const [barStyle, setBarStyle] = useState("light-content");

  useEffect(() => {
    keyboardVisible
      ? setBarStyle("dark-content")
      : setBarStyle("light-content");
  }, [keyboardVisible]);

  const handleSubmit = () => {
    router.push("/auth/otp");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/onboarding-wallpaper.jpg")}
      className="flex-1 justify-around items-center relative"
      resizeMode="cover"
    >
      <StatusBar
        barStyle={
          Platform.OS === "android"
            ? (barStyle as StatusBarStyle)
            : "light-content"
        }
      />
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
          <Text className="text-2xl font-bold pb-4 mb-10 text-center border-b-[0.3px] border-gray-500">
            Sign Up
          </Text>
          <ScrollView
            className="max-h-[400px]"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <FormField
              label="Full Name"
              value={form.fullName}
              onChangeText={(fullName) => setForm({ ...form, fullName })}
              placeholder="John Doe"
            />
            <FormField
              label="Email"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="you@example.com"
            />
            <FormField
              label="Password"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="........."
              secureTextEntry
            />
            <FormField
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(confirmPassword) =>
                setForm({ ...form, confirmPassword })
              }
              placeholder="..........."
            />

            <Button input="Sign Up" onPress={handleSubmit} color="text-white" />
          </ScrollView>
        </View>
      </KeyboardAvoidingWrapper>
    </ImageBackground>
  );
}
