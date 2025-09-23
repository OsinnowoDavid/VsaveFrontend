import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StatusBarStyle } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
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
    <ScreenWrapper>
      <StatusBar
        barStyle={
          Platform.OS === "android"
            ? (barStyle as StatusBarStyle)
            : "light-content"
        }
      />
      <FormWrapper heading="Sign Up">
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
      </FormWrapper>
    </ScreenWrapper>
  );
}
