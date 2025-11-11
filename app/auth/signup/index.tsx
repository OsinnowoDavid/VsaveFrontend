import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StatusBarStyle,
} from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import DatePickerField from "../../../components/DatePickerField";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import PhoneInput from "../../../components/PhoneInput";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";
import {
    confirmPasswordSchema,
    dateOfBirthSchema,
    emailSchema,
    fullNameSchema,
    genderSchema,
    passwordSchema,
    phoneNumberSchema,
    signupSchema,
} from "../../../schema/form";
import { handleSignup } from "../../../services/authService";
import { SignUpData } from "../../../types/data";

export default function SignUpScreen() {
    const [form, setForm] = useState<SignUpData>({
        fullName: "",
        email: "",
        countryCode: "234",
        phoneNumber: "", // Store as string
        gender: "", // Default to an empty string or a placeholder value
        dateOfBirth: new Date(),
        password: "",
        confirmPassword: "",
    });

    const keyboardVisible = useKeyboardVisible();

    const [barStyle, setBarStyle] = useState("light-content");

    const [signupInput, setSignupInput] = useState("Sign Up");

    const [signupBg, setSignBg] = useState("bg-green-700");

    const [isLoading, setIsLoading] = useState(false);

    function handleKeyboardVisible() {
        setBarStyle(keyboardVisible ? "dark-content" : "light-content");
    }

    useEffect(handleKeyboardVisible, [keyboardVisible]);

    const handleSubmit = async () => {
        const validationResult = signupSchema.safeParse(form);
        if (!validationResult.success) {
            const firstError = validationResult.error;
            Alert.alert("Invalid Input", firstError.issues[0].message);
            return;
        }

        setIsLoading(true);
        setSignupInput("Creating account...");
        setSignBg("bg-green-900");

        try {
            const result = await handleSignup(form);
            if (result.success) {
                Alert.alert(
                    "Signup Successful",
                    "Please check your email to verify your account.",
                    [
                        {
                            onPress: () => {
                                // Navigate to a verification screen, passing the email
                                router.replace({
                                    pathname: "/auth/email-verification",
                                    params: { email: form.email },
                                });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert("Signup", result.message);
                console.log(result.message);
            }
        } catch (error: any) {
            Alert.alert(
                "Signup Error",
                error.message || "An unexpected error occurred."
            );
        } finally {
            setIsLoading(false);
            setSignupInput("Sign Up");
            setSignBg("bg-green-700");
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
                    <PhoneInput
                        label="Phone Number"
                        phone={form.phoneNumber}
                        countryCode={form.countryCode}
                        onPhoneChange={(phoneNumber) =>
                            setForm({ ...form, phoneNumber })
                        }
                        onCountryChange={(countryCode) =>
                            setForm({ ...form, countryCode })
                        }
                        placeholder="08012345678"
                        validate
                        schema={phoneNumberSchema}
                        field={form.phoneNumber} // Pass as string
                    />
                    <FormField
                        label="Gender"
                        value={form.gender}
                        onChangeText={(gender) => setForm({ ...form, gender })}
                        type="select"
                        options={[
                            { label: "Select Gender", value: "" },
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ]}
                        validate
                        schema={genderSchema}
                        field={form.gender}
                    />
                    <DatePickerField
                        label="Date of Birth"
                        value={form.dateOfBirth as Date} // Pass the Date object
                        onChange={(dateOfBirth) =>
                            setForm({ ...form, dateOfBirth })
                        }
                        validate
                        schema={dateOfBirthSchema}
                        field={form.dateOfBirth}
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
                        input={signupInput}
                        onPress={handleSubmit}
                        color="text-white"
                        bg={signupBg}
                        disabled={isLoading}
                    />
                </ScrollView>
            </FormWrapper>
        </ScreenWrapper>
    );
}
