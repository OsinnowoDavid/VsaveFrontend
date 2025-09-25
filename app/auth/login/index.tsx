import React, { useState } from "react";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";
import { emailSchema } from "../../../schema/form";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {};

  return (
    <ScreenWrapper>
      <FormWrapper heading="Login">
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
      </FormWrapper>
    </ScreenWrapper>
  );
}
