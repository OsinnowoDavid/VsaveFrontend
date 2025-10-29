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
import { hasPin } from "../../../services/pinService";

export default function LoginScreen() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [signinInput, setSigninInput] = useState("Login");

    const [signupBg, setSignBg] = useState("bg-green-700");

    const handleSubmit = async () => {
        const formValidation = signinSchema.safeParse(form);

        if (!formValidation.success) {
            Alert.alert(
                "Invalid Input",
                "Please check your email and password."
            );
            return;
        }

        setIsLoading(true);
        setSigninInput("Logging in...");
        setSignBg("bg-green-900");

        try {
            const result = await handleSignin(form);
            if (result.success) {
                // After successful login, check if a PIN is set up.
                const userHasPin = await hasPin();
                if (userHasPin) {
                    // If PIN exists, redirect to the PIN login screen.
                    router.replace("/auth/login-with-pin");
                } else {
                    // If no PIN exists, force user to create one.
                    router.replace("/auth/pincode-setup");
                }
            } else {
                Alert.alert("Login Failed", result.message);
            }
        } catch (error: any) {
            Alert.alert(
                "Login Error",
                error.message || "An unexpected error occurred."
            );
        } finally {
            setSigninInput("Login");
            setSignBg("bg-green-700");
            setIsLoading(false);
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
