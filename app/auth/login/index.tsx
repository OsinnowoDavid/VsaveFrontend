import React, { useState } from "react";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import PinInput from "../../../components/PinInput";
import { emailSchema } from "../../../schema/form";
import { View,Text } from "lucide-react-native";
export default function LoginScreen() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [signinInput, setSigninInput] = useState("Login");

    const [signupBg, setSignBg] = useState("bg-green-700");

  return (
    <ScreenWrapper>
      <View className="px-6 py-8 bg-white w-full rounded-t-3xl">
          <Text className="text-2xl font-bold pb-4 mb-8 text-center border-b-[0.3px] border-gray-500">
            Login
          </Text>
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
          placeholder="you@example.com"
          validate
          schema={emailSchema}
          field={form.email}
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
    </ScreenWrapper>
  );
}
