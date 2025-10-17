import { router } from "expo-router";
import React, { useState } from "react";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { emailSchema, passwordSchema } from "../../../schema/form";
import useAuthStore from "../../../store/useAuthStore";

export default function LoginScreen() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [signinInput, setSigninInput] = useState("Login");

    const [signupBg, setSignBg] = useState("bg-green-700");

    const handleSubmit = async () => {
        // --- Development Shortcut ---
        // This will simulate a login and redirect to the home screen.
        const login = useAuthStore.getState().login;
        login("fake-dev-token"); // Use a fake token for the session
        router.replace("/home");
        // --------------------------
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
