import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StatusBarStyle } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";
import {
    confirmPasswordSchema,
    emailSchema,
    fullNameSchema,
    passwordSchema,
    signupSchema,
} from "../../../schema/form";
import { validateFormField } from "../../../utils";

export default function SignUpScreen() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const keyboardVisible = useKeyboardVisible();

    const [barStyle, setBarStyle] = useState("light-content");

    function handleKeyboardVisible() {
        keyboardVisible
            ? setBarStyle("dark-content")
            : setBarStyle("light-content");
        return;
    }

    useEffect(handleKeyboardVisible, [keyboardVisible]);

    const handleSubmit = () => {
        const formObject = {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
        };
        const { isValid } = validateFormField(signupSchema, formObject);
        if (!isValid) {
            alert("Some fields are incorrect. Please review the form.");
        } else if (form.password !== form.confirmPassword) {
            alert("Passwords don't match.");
        }
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
                        onChangeText={(fullName) =>
                            setForm({ ...form, fullName })
                        }
                        placeholder="John Doe"
                        schema={fullNameSchema}
                        validate
                        field={form.fullName}
                    />
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
                        onChangeText={(password) =>
                            setForm({ ...form, password })
                        }
                        placeholder="........."
                        secureTextEntry
                        validate
                        schema={passwordSchema}
                        field={form.password}
                    />
                    <FormField
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChangeText={(confirmPassword) =>
                            setForm({ ...form, confirmPassword })
                        }
                        placeholder=".........."
                        secureTextEntry
                        validate
                        schema={confirmPasswordSchema}
                        field={{
                            password: form.password,
                            confirmPassword: form.confirmPassword,
                        }}
                    />

                    <Button
                        input="Sign Up"
                        onPress={handleSubmit}
                        color="text-white"
                    />
                </ScrollView>
            </FormWrapper>
        </ScreenWrapper>
    );
}
