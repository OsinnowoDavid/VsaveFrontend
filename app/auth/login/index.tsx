import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import {
    emailSchema,
    passwordSchema,
    signinSchema,
} from "../../../schema/form";
import { handleSignin } from "../../../services/authService";
import { validateFormField } from "../../../utils";

export default function LoginScreen() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [signinInput, setSigninInput] = useState("Login");

    const [signupBg, setSignBg] = useState("bg-green-700");

    const handleSubmit = async () => {
        if (isLoading) return;

        const { isValid } = validateFormField(signinSchema, form);
        setSignBg("bg-green-700");
        if (!isValid) {
            Alert.alert(
                "Invalid Input",
                "Some fields are incorrect. Please review the form.",
            );
        } else {
            setIsLoading(true);
            setSigninInput("Logging you in...");
            const response = await handleSignin(form);
            setIsLoading(false);
            if (response.success) {
                setSigninInput("Login Success!");
                router.replace("/home"); // Navigate to home on success
            } else {
                setSigninInput("Login failed! Please try again");
                setSignBg("bg-red-600");
                Alert.alert("Login Failed", response.message);
            }
        }
    };

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
                <FormField
                    label="Password"
                    value={form.password}
                    onChangeText={(password) => setForm({ ...form, password })}
                    placeholder="............."
                    validate
                    schema={passwordSchema}
                    field={form.password}
                    secureTextEntry
                />
                <Button
                    input={signinInput}
                    onPress={handleSubmit}
                    color="text-white"
                    bg={signupBg}
                    disabled={isLoading}
                />
            </FormWrapper>
        </ScreenWrapper>
    );
}
