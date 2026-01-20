import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBarStyle,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Image
} from "react-native";
import { Check, ChevronRight, Shield, FileText } from "lucide-react-native";
import { useRouter } from "expo-router";
import Button from "../../../components/Button";
import DatePickerField from "../../../components/DatePickerField";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";
import { handleSignup } from "../../../services/authService";
import { SignUpData } from "../../../types/data";

interface FormValidation {
    fullName: boolean;
    email: boolean;
    phoneNumber: boolean;
    password: boolean;
    confirmPassword: boolean;
    gender: boolean;
    dateOfBirth: boolean;
}

export default function SignUpScreen() {
    const router = useRouter();
    
    // Helper function to calculate max date (18 years ago from today)
    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return maxDate;
    };
    
    const [form, setForm] = useState<SignUpData>({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: getMaxDate(), // Set initial date to max allowed date (18 years ago)
        password: "",
        confirmPassword: "",
        referralCode: "",
    });

    const [validation, setValidation] = useState<FormValidation>({
        fullName: false,
        email: false,
        phoneNumber: false,
        password: false,
        confirmPassword: false,
        gender: false,
        dateOfBirth: true, // Initially true since we set it to max date
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [dateError, setDateError] = useState<string | null>(null);
    
    const keyboardVisible = useKeyboardVisible();
    const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
    const [isLoading, setIsLoading] = useState(false);

    function handleKeyboardVisible() {
        setBarStyle(keyboardVisible ? "dark-content" : "light-content");
    }

    useEffect(handleKeyboardVisible, [keyboardVisible]);

    // Function to check if date is 18 years or older
    const isAtLeast18YearsOld = (date: Date): boolean => {
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return date <= eighteenYearsAgo;
    };

    // Form validation logic
    useEffect(() => {
        const isFormComplete = validation.fullName && 
            validation.email && 
            validation.phoneNumber && 
            validation.password && 
            validation.confirmPassword && 
            validation.gender && 
            validation.dateOfBirth &&
            acceptedTerms && 
            acceptedPrivacy;

        setIsFormValid(isFormComplete);
    }, [validation, acceptedTerms, acceptedPrivacy]);

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate password strength
    const validatePassword = (password: string): number => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // Update form validation on change
    const updateForm = (field: keyof SignUpData, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));

        // Validate individual fields
        if (field === 'email') {
            setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        } else if (field === 'password') {
            const strength = validatePassword(value);
            setPasswordStrength(strength);
            setValidation(prev => ({ ...prev, password: strength >= 3 }));
            // Validate confirm password if it exists
            if (form.confirmPassword) {
                setValidation(prev => ({ ...prev, confirmPassword: value === form.confirmPassword }));
            }
        } else if (field === 'confirmPassword') {
            setValidation(prev => ({ ...prev, confirmPassword: value === form.password }));
        } else if (field === 'fullName') {
            setValidation(prev => ({ ...prev, fullName: value.trim().length >= 2 }));
        } else if (field === 'phoneNumber') {
            setValidation(prev => ({ ...prev, phoneNumber: value.length >= 10 }));
        } else if (field === 'gender') {
            setValidation(prev => ({ ...prev, gender: value.length > 0 }));
        } else if (field === 'dateOfBirth') {
            const isValid = isAtLeast18YearsOld(value);
            setValidation(prev => ({ ...prev, dateOfBirth: isValid }));
            if (!isValid) {
                setDateError("You must be at least 18 years old");
            } else {
                setDateError(null);
            }
        }
    };

    const handleSubmit = async () => {
        // Double-check date validation before submission
        if (!isAtLeast18YearsOld(form.dateOfBirth)) {
            Alert.alert(
                "Age Restriction",
                "You must be at least 18 years old to create an account."
            );
            return;
        }

        if (!isFormValid) {
            Alert.alert(
                "Incomplete Form",
                "Please fill in all required fields and accept the terms to continue."
            );
            return;
        }

        setIsLoading(true);

        try {
            const result = await handleSignup(form);
            if (result.success) {
                Alert.alert(
                    "Account Created Successfully",
                    result.message || "Please check your email to verify your account.",
                    [
                        {
                            text: "Continue",
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
        }
    };

    const CustomCheckbox = ({ 
        checked, 
        onPress, 
        label,
        required = false,
        icon: IconComponent
    }: { 
        checked: boolean; 
        onPress: () => void; 
        label: React.ReactNode;
        required?: boolean;
        icon?: React.ComponentType<any>;
    }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-start mb-4 p-3 rounded-lg border border-gray-200 bg-white"
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
            >
                <View className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center
                    ${checked 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'bg-white border-gray-300'
                    }`}
                >
                    {checked && (
                        <Check size={14} color="#FFFFFF" />
                    )}
                </View>
                {IconComponent && (
                    <View className="mr-3">
                        <IconComponent size={20} color={checked ? "#059669" : "#9CA3AF"} />
                    </View>
                )}
                <View className="flex-1">
                    {label}
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
                <Text className={`font-semibold ${highlight ? 'text-emerald-600' : 'text-emerald-500'}`}>
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

    const PasswordStrengthIndicator = () => {
        const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
        const strengthColors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-emerald-400",
            "bg-emerald-600"
        ];

        return (
            <View className="mt-2">
                <View className="flex-row h-1 space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                        <View
                            key={level}
                            className={`flex-1 rounded-full ${
                                level <= passwordStrength 
                                    ? strengthColors[passwordStrength - 1] 
                                    : "bg-gray-200"
                            }`}
                        />
                    ))}
                </View>
                {form.password.length > 0 && (
                    <Text className="text-xs text-gray-600 mt-1">
                        Password strength: {strengthLabels[passwordStrength - 1] || "None"}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="">
                        <View className="items-center justify-center">
                            <Image
                                source={require("../../../assets/images/transparent-logo.png")}
                                className="w-24 h-24"
                                resizeMode="contain"
                            />
                        </View>

                        <FormWrapper heading="Create Your Account">
                            <View className="mb-2">
                                <Text className="text-gray-600 text-sm mb-6">
                                    Join thousands of users who trust VSave for secure financial management
                                </Text>
                            </View>

                            {/* Personal Information Section */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />
                                    <Text className="text-lg font-semibold text-gray-800">
                                        Personal Information
                                    </Text>
                                </View>
                                
                                <FormField
                                    label="Full Name *"
                                    value={form.fullName}
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={(fullName) => updateForm('fullName', fullName)}
                                    placeholder="John Doe"
                                    error={form.fullName.length > 0 && !validation.fullName}
                                    errorMessage="Enter a valid name"
                                />
                                
                                <FormField
                                    label="Email Address *"
                                    value={form.email}
                                    onChangeText={(email) => updateForm('email', email)}
                                    placeholder="you@example.com"
                                    keyboardType="email-address"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                    error={form.email.length > 0 && !validation.email}
                                    errorMessage="Enter a valid email address"
                                />
                                
                                <FormField
                                    label="Phone Number *"
                                    value={form.phoneNumber}
                                    onChangeText={(phoneNumber) => updateForm('phoneNumber', phoneNumber)}
                                    placeholder="08012345678"
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#9CA3AF"
                                    error={form.phoneNumber.length > 0 && !validation.phoneNumber}
                                    errorMessage="Enter a valid phone number"
                                />
                                
                                <FormField
                                    label="Gender *"
                                    value={form.gender}
                                    onChangeText={(gender) => updateForm('gender', gender)}
                                    type="select"
                                    options={[
                                        { label: "Select Gender", value: "" },
                                        { label: "Male", value: "Male" },
                                        { label: "Female", value: "Female" },
                                        { label: "Prefer not to say", value: "Other" },
                                    ]}
                                />
                                
                                <View>
                                    <DatePickerField
                                        label="Date of Birth *"
                                        value={form.dateOfBirth}
                                        onChange={(dateOfBirth) => updateForm('dateOfBirth', dateOfBirth)}
                                        maximumDate={getMaxDate()} // Pass max date to DatePickerField
                                    />
                                    {dateError && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {dateError}
                                        </Text>
                                    )}
                                    <Text className="text-gray-500 text-xs mt-1">
                                        You must be at least 18 years old
                                    </Text>
                                </View>
                            </View>

                            {/* Security Information Section */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />
                                    <Text className="text-lg font-semibold text-gray-800">
                                        Security Information
                                    </Text>
                                </View>
                                
                                <FormField
                                    label="Password *"
                                    value={form.password}
                                    onChangeText={(password) => updateForm('password', password)}
                                    placeholder="Create a strong password"
                                    secureTextEntry
                                    placeholderTextColor="#9CA3AF"
                                    error={form.password.length > 0 && !validation.password}
                                    errorMessage="Password must be at least 8 characters with uppercase, number, and special character"
                                />
                                <PasswordStrengthIndicator />
                                
                                <FormField
                                    label="Confirm Password *"
                                    value={form.confirmPassword}
                                    onChangeText={(confirmPassword) => updateForm('confirmPassword', confirmPassword)}
                                    placeholder="Confirm your password"
                                    secureTextEntry
                                    placeholderTextColor="#9CA3AF"
                                    error={form.confirmPassword.length > 0 && !validation.confirmPassword}
                                    errorMessage="Passwords do not match"
                                />
                                
                                <FormField
                                    label="Referral Code (Optional)"
                                    value={form.referralCode}
                                    onChangeText={(referralCode) => updateForm('referralCode', referralCode)}
                                    placeholder="Enter referral code if you have one"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            {/* Terms and Policies Section */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />
                                    <Text className="text-lg font-semibold text-gray-800">
                                        Terms & Policies
                                    </Text>
                                </View>

                                <CustomCheckbox
                                    checked={acceptedTerms}
                                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                                    required={true}
                                    icon={FileText}
                                    label={
                                        <View>
                                            <Text className="text-gray-700 text-sm">
                                                I agree to the
                                                <PolicyLink 
                                                    text=" Terms & Conditions" 
                                                    onPress={() => readPolicy('terms')}
                                                /> of VSave. I understand and authorize automatic deductions for savings contributions.
                                            </Text>
                                        </View>
                                    }
                                />

                                <CustomCheckbox
                                    checked={acceptedPrivacy}
                                    onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                                    required={true}
                                    icon={Shield}
                                    label={
                                        <View>
                                            <Text className="text-gray-700 text-sm">
                                                I agree to the{' '}
                                                <PolicyLink 
                                                    text="Privacy & Cookie Policy" 
                                                    onPress={() => readPolicy('privacy')}
                                                /> of VSave. I consent to data collection and processing for operational purposes.
                                            </Text>
                                        </View>
                                    }
                                />

                                {/* Policy Preview Links */}
                                <View className="flex-row space-x-3 mt-2 gap-3">
                                    <TouchableOpacity 
                                        onPress={() => readPolicy('terms')}
                                        className="flex-1 py-3 px-4 bg-emerald-50 rounded-lg border border-emerald-100 flex-row items-center justify-between"
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center ">
                                            <FileText size={16} color="#059669" />
                                            <Text className="ml-2 text-emerald-700 font-medium">
                                                View Terms
                                            </Text>
                                        </View>
                                        <ChevronRight size={16} color="#059669" />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        onPress={() => readPolicy('privacy')}
                                        className="flex-1 py-3 px-4 bg-emerald-50 rounded-lg border border-emerald-100 flex-row items-center justify-between"
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center">
                                            <Shield size={16} color="#059669" />
                                            <Text className="ml-2 text-emerald-700 font-medium">
                                                View Privacy
                                            </Text>
                                        </View>
                                        <ChevronRight size={16} color="#059669" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Sign Up Button */}
                            <Button
                                input={isLoading ? "Creating Account..." : "Create Account"}
                                onPress={handleSubmit}
                                color="text-white"
                                bg={isFormValid && !isLoading ? "bg-emerald-600" : "bg-emerald-400"}
                                disabled={!isFormValid || isLoading}
                                isLoading={isLoading}
                                icon={isLoading ? undefined : "arrow-right"}
                                size="lg"
                                style={`shadow-lg ${isFormValid && !isLoading ? "shadow-emerald-200" : ""}`}
                            />

                            {/* Form Validation Summary */}
                            {!isFormValid && (
                                <View className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <Text className="text-amber-800 text-sm font-medium mb-2">
                                        Complete these steps to continue:
                                    </Text>
                                    <View className="space-y-1">
                                        <Text className={`text-xs ${validation.fullName ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.fullName ? '✓' : '○'} Full name (minimum 2 characters)
                                        </Text>
                                        <Text className={`text-xs ${validation.email ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.email ? '✓' : '○'} Valid email address
                                        </Text>
                                        <Text className={`text-xs ${validation.phoneNumber ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.phoneNumber ? '✓' : '○'} Phone number (10+ digits)
                                        </Text>
                                        <Text className={`text-xs ${validation.dateOfBirth ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.dateOfBirth ? '✓' : '○'} Must be 18 years or older
                                        </Text>
                                        <Text className={`text-xs ${validation.password ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.password ? '✓' : '○'} Strong password
                                        </Text>
                                        <Text className={`text-xs ${validation.confirmPassword ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.confirmPassword ? '✓' : '○'} Matching passwords
                                        </Text>
                                        <Text className={`text-xs ${validation.gender ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {validation.gender ? '✓' : '○'} Gender selected
                                        </Text>
                                        <Text className={`text-xs ${acceptedTerms ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {acceptedTerms ? '✓' : '○'} Terms & Conditions accepted
                                        </Text>
                                        <Text className={`text-xs ${acceptedPrivacy ? 'text-emerald-600' : 'text-amber-700'}`}>
                                            • {acceptedPrivacy ? '✓' : '○'} Privacy Policy accepted
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Login Redirect */}
                            <View className="mt-8 pt-6 border-t border-gray-200">
                                <Text className="text-center text-gray-600 mb-4">
                                    Already have an account?
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => router.push("/auth/login")}
                                    disabled={isLoading}
                                    className="py-3 px-6 border border-emerald-200 rounded-lg"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-center text-emerald-700 font-semibold">
                                        Sign In to Your Account
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Security Assurance */}
                            <View className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <View className="flex-row items-center">
                                    <Shield size={16} color="#059669" />
                                    <Text className="ml-2 text-xs text-gray-600 flex-1">
                                        Your information is secured with bank-level encryption and will never be shared without your consent.
                                    </Text>
                                </View>
                            </View>
                        </FormWrapper>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}