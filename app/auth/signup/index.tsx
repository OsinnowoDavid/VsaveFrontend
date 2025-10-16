import { RelativePathString, router } from "expo-router";
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
import { validateFormField } from "../../../utils";

export default function SignUpScreen() {
    const [form, setForm] = useState({
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
        if (isLoading) return;

        // 1. Validate the form data first
        const validationData = {
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            gender: form.gender,
            dateOfBirth: form.dateOfBirth.toISOString(), // Use ISO string for validation
            password: form.password,
        };

        const { isValid } = validateFormField(signupSchema, validationData);

        if (!isValid) {
            Alert.alert(
                "Validation Error",
                "Some fields are incorrect. Please review the form.",
            );
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Validation Error", "Passwords don't match.");
            return;
        }

        // 2. Format the payload for the API
        const nameParts = form.fullName.trim().split(" ");
        const apiPayload = {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ") || nameParts[0], // Handle single name case
            email: form.email,
            password: form.password,
            gender: form.gender.charAt(0).toUpperCase() + form.gender.slice(1), // Capitalize (e.g., "male" -> "Male")
            dateOfBirth: form.dateOfBirth.toISOString().split("T")[0], // Format as YYYY-MM-DD
            phoneNumber: form.phoneNumber, // Send local number as is
        };

        // 3. Submit to the backend
        setIsLoading(true);
        setSignupInput("Submitting...");
        setSignBg("bg-green-700");
        const response = await handleSignup(apiPayload);
        setIsLoading(false);

        if (response.success) {
            setSignupInput("Success! Account Created");
            Alert.alert("Registration Successful", response.data?.message, [
                {
                    text: "OK",
                    // TODO: Navigate to email verification screen
                    onPress: () =>
                        router.push({
                            pathname:
                                "/auth/verify-email" as RelativePathString,
                            params: { email: apiPayload.email },
                        }),
                },
            ]);
        } else {
            setSignupInput("An error occurred!");
            setSignBg("bg-red-600");
            Alert.alert("Registration Failed", response.message);
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
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                        ]}
                        validate
                        schema={genderSchema}
                        field={form.gender}
                    />
                    <DatePickerField
                        label="Date of Birth"
                        value={form.dateOfBirth} // Pass the Date object
                        onChange={(dateOfBirth) =>
                            setForm({ ...form, dateOfBirth })
                        }
                        validate
                        schema={dateOfBirthSchema}
                        field={form.dateOfBirth.toISOString()}
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
