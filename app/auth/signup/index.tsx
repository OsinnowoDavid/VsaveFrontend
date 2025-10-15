import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StatusBarStyle } from "react-native";
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
        countryCode: "+234", // Default to Nigeria
        phoneNumber: 9012345678,
        gender: "", // Default to an empty string or a placeholder value
        dateOfBirth: new Date(),
        password: "",
        confirmPassword: "",
    });

    const keyboardVisible = useKeyboardVisible();

    const [barStyle, setBarStyle] = useState("light-content");

    const [signupInput, setSignupInput] = useState("Sign Up");

    const [signupBg, setSignBg] = useState("bg-green-700");

    function handleKeyboardVisible() {
        setBarStyle(keyboardVisible ? "dark-content" : "light-content");
    }

    useEffect(handleKeyboardVisible, [keyboardVisible]);

    const handleSubmit = async () => {
        // Strip leading zero from phone number if present
        const formattedPhoneNumber = form.phoneNumber.toString().startsWith("0")
            ? Number(form.phoneNumber.toString().substring(1))
            : form.phoneNumber;
        const formObject = {
            fullName: form.fullName,
            email: form.email,
            phoneNumber: Number(
                `${form.countryCode.replace("+", "")}${formattedPhoneNumber}`,
            ),
            gender: form.gender, // Make sure your backend can handle this
            dateOfBirth: form.dateOfBirth.toISOString().split("T")[0], // YYYY-MM-DD
            password: form.password,
        };
        setSignBg("bg-green-700");
        const { isValid, errorMessage } = validateFormField(
            signupSchema,
            formObject,
        );

        if (!isValid) {
            alert(
                "Some fields are incorrect. Please review the form and correct the errors.",
            );
        } else if (form.password !== form.confirmPassword) {
            alert("Passwords don't match.");
        } else {
            setSignupInput("Submiting...");
            const response = await handleSignup(formObject);
            if (response === true) setSignupInput("Success! Account Created");
            else {
                setSignupInput("An error occured! Please try again");
                setSignBg("bg-red-600");
            }
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
                        phone={form.phoneNumber.toString()}
                        countryCode={form.countryCode}
                        onPhoneChange={(phoneNumber) => {
                            const phone = Number(phoneNumber);
                            setForm({ ...form, phoneNumber: phone });
                            console.log(phoneNumber);
                        }}
                        onCountryChange={(countryCode) =>
                            setForm({ ...form, countryCode })
                        }
                        placeholder="08012345678"
                        validate
                        schema={phoneNumberSchema}
                        field={form.phoneNumber.toString()}
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
                    />
                </ScrollView>
            </FormWrapper>
        </ScreenWrapper>
    );
}
