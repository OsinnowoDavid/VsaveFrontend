import { router } from "expo-router";
import React, { useState } from "react";
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
    const [signinInput, setSigninInput] = useState("Login");

    const [signupBg, setSignBg] = useState("bg-green-700");
    const inProd = false;

    const handleSubmit = async () => {
        const { isValid } = validateFormField(signinSchema, form);
        setSignBg("bg-green-700");
        if (!isValid) {
            alert("Some fields are incorrect. Please review the form.");
        } else {
            setSigninInput("Logging you in...");
            const response = await handleSignin(form);
            if (response === true) setSigninInput("Login Success!");
            else {
                setSigninInput("Login failed! Please try again");
                setSignBg("bg-red-600");
            }
        }
    };
    if (inProd) {
        handleSubmit();
    }

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
                    onPress={router.push("/home")}
                    color="text-white"
                    bg={signupBg}
                />
            </FormWrapper>
        </ScreenWrapper>
    );
}
