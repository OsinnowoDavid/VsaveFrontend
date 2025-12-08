import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StatusBarStyle,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import DatePickerField from "../../../components/DatePickerField";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
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
import { useRouter } from "expo-router";


export default function SignUpScreen() {
    const router = useRouter();
    
    const [form, setForm] = useState<SignUpData>({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
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

    // Debug function to check form state
    const debugFormState = () => {
        console.log("Form State:", form);
    };

    return (
        <ScreenWrapper>
            <FormWrapper heading="Sign Up">
                <ScrollView
                    className="max-h-[400px]"
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <FormField
                        label="Full Name"
                        value={form.fullName}
                        onChangeText={(fullName) => {
                            setForm({ ...form, fullName });
                            debugFormState(); // Add for debugging
                        }}
                        placeholder="John Doe"
                        schema={fullNameSchema}
                        validate
                        field={form.fullName}
                    />
                    <FormField
                        label="Email"
                        value={form.email}
                        onChangeText={(email) => {
                            setForm({ ...form, email });
                            debugFormState(); // Add for debugging
                        }}
                        placeholder="you@example.com"
                        validate
                        schema={emailSchema}
                        field={form.email}
                    />
                    <FormField
                        label="Phone Number"
                        value={form.phoneNumber}
                        onChangeText={(phoneNumber) => {
                            setForm({ ...form, phoneNumber });
                            debugFormState(); // Add for debugging
                        }}
                        placeholder="08012345678"
                        keyboardType="phone-pad"
                        validate
                        schema={phoneNumberSchema}
                        field={form.phoneNumber}
                    />
                    <FormField
                        label="Gender"
                        value={form.gender}
                        onChangeText={(gender) => {
                            setForm({ ...form, gender });
                            debugFormState(); // Add for debugging
                        }}
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
                        value={form.dateOfBirth as Date}
                        onChange={(dateOfBirth) => {
                            setForm({ ...form, dateOfBirth });
                            debugFormState(); // Add for debugging
                        }}
                        validate
                        schema={dateOfBirthSchema}
                        field={form.dateOfBirth}
                    />
                    <FormField
                        label="Password"
                        value={form.password}
                        onChangeText={(password) => {
                            console.log("Password input:", password); // Debug log
                            setForm({ ...form, password });
                            debugFormState(); // Add for debugging
                        }}
                        placeholder="Enter your password"
                        secureTextEntry
                        validate
                        schema={passwordSchema}
                        field={form.password}
                    />
                    <FormField
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChangeText={(confirmPassword) => {
                            console.log("Confirm Password input:", confirmPassword); // Debug log
                            setForm({ ...form, confirmPassword });
                            debugFormState(); // Add for debugging
                        }}
                        placeholder="Confirm your password"
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
                    

                    <View className="mt-5">
                        <TouchableOpacity onPress={() => router.push("/auth/login")}>
                            <Text className="text-right underline text-2xl">
                                Login Instead
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </FormWrapper>
        </ScreenWrapper>
    );
}