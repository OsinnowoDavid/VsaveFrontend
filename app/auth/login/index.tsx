import React, { useState } from "react";
import { Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import PinInput from "../../../components/PinInput";

export default function LoginScreen() {
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
    </ScreenWrapper>
  );
}
