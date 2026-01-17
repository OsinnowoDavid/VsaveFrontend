import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StatusBarStyle,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Check } from "lucide-react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import DatePickerField from "../../../components/DatePickerField";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";
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
        referralCode: "",
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    
    const keyboardVisible = useKeyboardVisible();
    const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
    const [signupInput, setSignupInput] = useState("Sign Up");
    const [signupBg, setSignBg] = useState("bg-green-700");
    const [isLoading, setIsLoading] = useState(false);

    function handleKeyboardVisible() {
        setBarStyle(keyboardVisible ? "dark-content" : "light-content");
    }

    useEffect(handleKeyboardVisible, [keyboardVisible]);

    const handleSubmit = async () => {
        // Only check terms acceptance (required by UI)
        if (!acceptedTerms || !acceptedPrivacy) {
            Alert.alert(
                "Accept Terms Required",
                "You must accept both the Terms & Conditions and Privacy & Cookie Policy to continue."
            );
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
                    result.message || "Please check your email to verify your account.",
                    [
                        {
                            text: "OK",
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
                Alert.alert("Signup Failed", result.message);
            }
        } catch (error: any) {
            Alert.alert("Signup Error", error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
            setSignupInput("Sign Up");
            setSignBg("bg-green-700");
        }
    };

    const CustomCheckbox = ({ 
        checked, 
        onPress, 
        label,
        required = false 
    }: { 
        checked: boolean; 
        onPress: () => void; 
        label: React.ReactNode;
        required?: boolean;
    }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-start mb-4"
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
            >
                <View className={`w-6 h-6 rounded-md border-2 mr-3 mt-1 flex items-center justify-center
                    ${checked 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-white border-gray-300'
                    }`}
                >
                    {checked && (
                        <Check size={16} color="#FFFFFF" />
                    )}
                </View>
                <View className="flex-1">
                    <Text className="text-gray-700 text-sm leading-relaxed">
                        {label}
                        {required && (
                            <Text className="text-red-500"> *</Text>
                        )}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const PolicyLink = ({ 
        text, 
        onPress,
        highlight = false 
    }: { 
        text: string; 
        onPress: () => void;
        highlight?: boolean;
    }) => {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Text className={`underline ${highlight ? 'text-blue-600 font-semibold' : 'text-blue-500'}`}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    };

    const readPolicy = (type: 'terms' | 'privacy') => {
        if (type === 'terms') {
            router.push("/auth/TermsAndCondition");
        } else {
            router.push("/auth/Policy");
        }
    };

    return (
        <ScreenWrapper>
            <StatusBar barStyle={barStyle} />
            <FormWrapper heading="Sign Up">
                <ScrollView
                    className="max-h-[500px]"
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <FormField
                        label="Full Name"
                        value={form.fullName}
                        placeholderTextColor="grey"

                        onChangeText={(fullName) => {
                            setForm({ ...form, fullName });
                        }}
                        placeholder="John Doe"
                    />
                    <FormField
                        label="Email"
                        value={form.email}
                        onChangeText={(email) => {
                            setForm({ ...form, email });
                        }}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        placeholderTextColor="grey"

                        // autoCapitalize="none"
                    />
                    <FormField
                        label="Phone Number"
                        value={form.phoneNumber}
                        onChangeText={(phoneNumber) => {
                            setForm({ ...form, phoneNumber });
                        }}
                        placeholder="08012345678"
                        keyboardType="phone-pad"
                        placeholderTextColor="grey"
                    
                        
                    />
                    <FormField
                        label="Gender"
                        value={form.gender}
                        onChangeText={(gender) => {
                            setForm({ ...form, gender });
                        }}
                        type="select"
                        options={[
                            { label: "Select Gender", value: "" },
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ]}
                    />
                    <DatePickerField
                        label="Date of Birth"
                        value={form.dateOfBirth}
                        onChange={(dateOfBirth) => {
                            setForm({ ...form, dateOfBirth });
                        }}
                    />
                    <FormField
                        label="Referral Code (Optional)"
                        value={form.referralCode}
                        onChangeText={(referralCode) => {
                            setForm({ ...form, referralCode });
                        }}
                        placeholder="Enter your referral code"
                        placeholderTextColor="grey"

                    />
                    <FormField
                        label="Password"
                        value={form.password}
                        onChangeText={(password) => {
                            setForm({ ...form, password });
                        }}
                        placeholder="Enter your password"
                        secureTextEntry
                        placeholderTextColor="grey"

                    />
                    <FormField
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChangeText={(confirmPassword) => {
                            setForm({ ...form, confirmPassword });
                        }}
                        placeholder="Confirm your password"
                        secureTextEntry
                        placeholderTextColor="grey"

                    />

                    {/* Terms and Privacy Acceptance Section */}
                    <View className="mt-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-lg font-bold text-gray-900 mb-3">
                            Terms & Policies
                        </Text>
                        
                        <CustomCheckbox
                            checked={acceptedTerms}
                            onPress={() => setAcceptedTerms(!acceptedTerms)}
                            required={true}
                            label={
                                <Text className="text-gray-700">
                                    I have read, understood, and agree to the{' '}
                                    <PolicyLink 
                                        text="Terms & Conditions" 
                                        onPress={() => readPolicy('terms')}
                                        highlight={true}
                                    />
                                    {' '}of VSave. I understand that savings is compulsory 
                                    and authorize automatic deductions for savings contributions.
                                </Text>
                            }
                        />

                        <CustomCheckbox
                            checked={acceptedPrivacy}
                            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                            required={true}
                            label={
                                <Text className="text-gray-700">
                                    I have read, understood, and agree to the{' '}
                                    <PolicyLink 
                                        text="Privacy & Cookie Policy" 
                                        onPress={() => readPolicy('privacy')}
                                        highlight={true}
                                    />
                                    {' '}of VSave. I consent to the collection, processing, 
                                    and sharing of my data for regulatory, operational, and 
                                    fraud-prevention purposes.
                                </Text>
                            }
                        />

                        <View className="mt-4 bg-blue-50 p-3 rounded border border-blue-100">
                            <Text className="text-blue-800 text-xs leading-relaxed">
                                <Text className="font-semibold">Important:</Text> By accepting these terms, 
                                you acknowledge that VSave operates as a structured digital savings platform 
                                with compulsory savings features. You authorize automatic deductions from your 
                                wallet for savings contributions as outlined in the Terms & Conditions.
                            </Text>
                        </View>

                        <View className="mt-4 flex-row space-x-4">
                            <TouchableOpacity 
                                onPress={() => {
                                 router.push("/auth/TermsAndCondition");
                                }}
                                className="flex-1 py-2 px-4 bg-gray-100 rounded-lg border border-gray-300"
                                activeOpacity={0.7}
                            >
                                <Text className="text-center text-gray-700 font-medium">
                                    Read Terms
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={() => {
                                    router.push('/auth/Policy');
                                }}
                                className="flex-1 py-2 px-4 bg-gray-100 rounded-lg border border-gray-300"
                                activeOpacity={0.7}
                            >
                                <Text className="text-center text-gray-700 font-medium">
                                    Read Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <Button
                        input={signupInput}
                        onPress={handleSubmit}
                        color="text-white"
                        bg={signupBg}
                        disabled={isLoading || !acceptedTerms || !acceptedPrivacy}
                        // loading={isLoading}
                    />

                    {/* Acceptance Status */}
                    <View className="mt-4 p-3 rounded-lg bg-gray-50">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-sm text-gray-600">Terms & Conditions:</Text>
                            <View className={`px-3 py-1 rounded-full ${acceptedTerms ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-xs font-medium ${acceptedTerms ? 'text-green-800' : 'text-red-800'}`}>
                                    {acceptedTerms ? 'Accepted ✓' : 'Not Accepted'}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-gray-600">Privacy & Cookie Policy:</Text>
                            <View className={`px-3 py-1 rounded-full ${acceptedPrivacy ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-xs font-medium ${acceptedPrivacy ? 'text-green-800' : 'text-red-800'}`}>
                                    {acceptedPrivacy ? 'Accepted ✓' : 'Not Accepted'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View className="mt-5">
                        <TouchableOpacity 
                            onPress={() => router.push("/auth/login")}
                            disabled={isLoading}
                        >
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