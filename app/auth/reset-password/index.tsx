import { router } from "expo-router";
import { ArrowLeft, Lock, Mail, ShieldCheck, Eye, EyeOff, Key, AlertCircle, Smartphone } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View, Animated, Easing, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import PinInput from "../../../components/PinInput";
import { confirmPasswordSchema, passwordSchema } from "../../../schema/form";
import { validateFormField } from "../../../utils";
import { sendMail, resetPassword } from "../../../services/authService";
import { SafeAreaView } from "react-native-safe-area-context";


const EmailStep = ({
  email,
  setEmail,
  onSubmit,
  isLoading = false,
}: {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}) => {
  return (
    <>
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Mail size={40} color="#059669" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Reset Your Password
        </Text>
        <Text className="text-gray-600 text-center">
          Enter your email address to receive a verification code
        </Text>
      </View>

      <View className="mb-8">
        <FormField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={Mail}
          containerStyle="mb-6"
        />

        {/* Instructions */}
        <View className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <View className="flex-row">
            <AlertCircle size={18} color="#3B82F6" className="mr-3 mt-0.5" />
            <View className="flex-1">
              <Text className="text-sm text-blue-700">
                We'll send a 6-digit verification code to this email. Make sure you have access to this email account.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Button
        input={isLoading ? "Sending..." : "Send Verification Code"}
        onPress={onSubmit}
        color="text-white"
        bg={email.length > 0 && !isLoading ? "bg-emerald-600" : "bg-emerald-400"}
        disabled={email.length === 0 || isLoading}
        isLoading={isLoading}
        icon={isLoading ? undefined : "send"}
        size="lg"
        style="shadow-lg shadow-emerald-200"
      />
    </>
  );
};

const VerifyStep = ({
  pin,
  setPin,
  onVerify,
  email = "da****2@gmail.com",
  onResend,
  isResending = false,
  isLoading = false,
}: {
  pin: string;
  setPin: (pin: string) => void;
  onVerify: () => void;
  email?: string;
  onResend?: () => void;
  isResending?: boolean;
  isLoading?: boolean;
}) => {
  const [countdown, setCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0) {
      Alert.alert("Please Wait", `You can resend the code in ${countdown} seconds.`);
      return;
    }
    
    if (resendAttempts >= 3) {
      Alert.alert("Limit Reached", "You've reached the maximum resend attempts. Please try again later.");
      return;
    }
    
    if (onResend) {
      onResend();
      setCountdown(60);
      setResendAttempts(prev => prev + 1);
    }
  };

  return (
    <>
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Smartphone size={40} color="#059669" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Check Your Email
        </Text>
        <Text className="text-gray-600 text-center">
          We've sent a 6-digit verification code to
        </Text>
        <Text className="text-lg font-semibold text-emerald-700 mt-1">
          {email}
        </Text>
      </View>

      <View className="mb-8">
        <Text className="text-gray-700 font-medium mb-4 text-center">
          Enter Verification Code
        </Text>
        <PinInput
          label=""
          value={pin}
          onChangeText={setPin}
          autoFocus={true}
          length={6}
          containerStyle="justify-center"
          cellStyle="w-14 h-14 mx-1 border-2 border-gray-300 rounded-lg"
          activeCellStyle="border-emerald-500 bg-emerald-50"
          textStyle="text-2xl font-bold text-gray-800"
        />

        {/* Code Instructions */}
        <View className="mt-6 p-4 bg-gray-50 rounded-xl mb-4">
          <Text className="text-sm text-gray-600 mb-1">
            <Text className="font-semibold text-gray-700">Note:</Text> The code expires in 15 minutes. Check your spam folder if you don't see it.
          </Text>
        </View>

        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-gray-600 mr-2">
            Didn't receive the code?
          </Text>
          <Pressable
            onPress={handleResend}
            disabled={isResending || countdown > 0}
            className={`px-4 py-2 rounded-lg ${countdown > 0 || isResending ? "bg-gray-100" : "bg-emerald-50"}`}
          >
            {isResending ? (
              <Text className="text-gray-500 font-medium">Sending...</Text>
            ) : countdown > 0 ? (
              <Text className="text-emerald-700 font-medium">
                Resend in {countdown}s
              </Text>
            ) : (
              <Text className="text-emerald-700 font-medium">Resend Code</Text>
            )}
          </Pressable>
        </View>
      </View>

      <Button
        input={isLoading ? "Verifying..." : "Verify & Continue"}
        onPress={onVerify}
        color="text-white"
        bg={pin.length === 6 && !isLoading ? "bg-emerald-600" : "bg-emerald-400"}
        disabled={pin.length !== 6 || isLoading}
        isLoading={isLoading}
        icon={isLoading ? undefined : "arrow-right"}
        size="lg"
        style="shadow-lg shadow-emerald-200"
      />
    </>
  );
};

const ResetStep = ({
  passwords,
  setPasswords,
  onReset,
  isLoading = false,
}: {
  passwords: { newPassword: string; confirmPassword: string };
  setPasswords: (passwords: any) => void;
  onReset: () => void;
  isLoading?: boolean;
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(validatePassword(passwords.newPassword));
  }, [passwords.newPassword]);

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
        <View className="flex-row h-1 space-x-1 mb-1">
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
        {passwords.newPassword.length > 0 && (
          <Text className="text-xs text-gray-600">
            Password strength: {strengthLabels[passwordStrength - 1] || "None"}
          </Text>
        )}
      </View>
    );
  };

  const PasswordRequirement = ({ text, met }: { text: string; met: boolean }) => (
    <View className="flex-row items-center mb-1">
      <View className={`w-5 h-5 rounded-full items-center justify-center mr-2 ${
        met ? "bg-emerald-100" : "bg-gray-100"
      }`}>
        <Text className={`text-sm ${met ? "text-emerald-600 font-bold" : "text-gray-400"}`}>
          {met ? "✓" : "○"}
        </Text>
      </View>
      <Text className={`text-sm ${met ? "text-gray-700" : "text-gray-500"}`}>
        {text}
      </Text>
    </View>
  );

  return (
    <>
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Lock size={40} color="#059669" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Create New Password
        </Text>
        <Text className="text-gray-600 text-center">
          Your new password must be different from previous ones
        </Text>
      </View>

      <View className="mb-6">
        <View className="mb-6">
          <FormField
            label="New Password"
            value={passwords.newPassword}
            onChangeText={(text) =>
              setPasswords((prev: any) => ({
                ...prev,
                newPassword: text,
              }))
            }
            placeholder="Enter new password"
            secureTextEntry={!showNewPassword}
            icon={Key}
            rightIcon={showNewPassword ? EyeOff : Eye}
            onRightIconPress={() => setShowNewPassword(!showNewPassword)}
          />
          <PasswordStrengthIndicator />
        </View>

        <View className="mb-8">
          <FormField
            label="Confirm Password"
            value={passwords.confirmPassword}
            onChangeText={(text) =>
              setPasswords((prev: any) => ({
                ...prev,
                confirmPassword: text,
              }))
            }
            placeholder="Confirm new password"
            secureTextEntry={!showConfirmPassword}
            icon={ShieldCheck}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            error={passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword}
            errorMessage="Passwords do not match"
          />
        </View>

        {/* Password Requirements */}
        <View className="p-4 bg-gray-50 rounded-xl mb-6">
          <Text className="font-medium text-gray-700 mb-2">Password Requirements:</Text>
          <PasswordRequirement 
            text="At least 8 characters" 
            met={passwords.newPassword.length >= 8} 
          />
          <PasswordRequirement 
            text="Contains uppercase letter" 
            met={/[A-Z]/.test(passwords.newPassword)} 
          />
          <PasswordRequirement 
            text="Contains number" 
            met={/[0-9]/.test(passwords.newPassword)} 
          />
          <PasswordRequirement 
            text="Contains special character" 
            met={/[^A-Za-z0-9]/.test(passwords.newPassword)} 
          />
        </View>
      </View>

      <Button
        input={isLoading ? "Resetting..." : "Reset Password"}
        onPress={onReset}
        color="text-white"
        bg={!isLoading ? "bg-emerald-600" : "bg-emerald-400"}
        disabled={isLoading}
        isLoading={isLoading}
        icon={isLoading ? undefined : "lock"}
        size="lg"
        style="shadow-lg shadow-emerald-200"
      />
    </>
  );
};

export default function ResetPasswordScreen() {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [pin, setPin] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step]);

  // Mask email for display
  const maskEmailForDisplay = (email: string) => {
    if (!email) return "your email";
    const [user, domain] = email.split("@");
    if (user.length <= 3) return email;
    const maskedUser = user.substring(0, 3) + "*".repeat(Math.min(user.length - 3, 4));
    return `${maskedUser}@${domain}`;
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendMail(email);
      console.log("sendEmail", response)
      const masked = maskEmailForDisplay(email);
      setMaskedEmail(masked);
      setIsLoading(false);
      setStep("verify");
      Alert.alert("Code Sent", `Verification code sent to ${masked || email}`);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Error", 
        error.response?.data?.message || 
        "Failed to send verification code. Please check your email and try again."
      );
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await sendMail(email);
      setIsResending(false);
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } catch (error: any) {
      setIsResending(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || 
        "Failed to resend code. Please try again."
      );
    }
  };

  const handleVerify = () => {
    if (pin.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit code.");
      return;
    }
    setStep("reset");
  };

  const handleResetPassword = async () => {
    const { isValid } = validateFormField(confirmPasswordSchema, {
      password: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    });

    if (!isValid) {
      Alert.alert(
        "Password Requirements Not Met",
        "Please ensure your password meets all requirements and matches in both fields."
      );
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, pin, passwords.newPassword);
      setIsLoading(false);
      Alert.alert(
        "Password Reset Successful!",
        "Your password has been reset successfully. You can now log in with your new password.",
        [
          { 
            text: "Continue to Login", 
            onPress: () => router.replace("/auth/login") 
          },
        ]
      );
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Reset Failed",
        error.response?.data?.message || 
        "Failed to reset password. Please check your code and try again."
      );
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case "email": return 33;
      case "verify": return 66;
      case "reset": return 100;
      default: return 33;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "email": return "Enter Email";
      case "verify": return "Verify Code";
      case "reset": return "New Password";
      default: return "Reset Password";
    }
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
          className="flex-1"
        >
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="flex-1 px-6"
          >
            {/* Header with Back Button */}
            <View className="pt-6 pb-4">
              <TouchableOpacity 
                onPress={() => {
                  if (step === "email") {
                    router.back();
                  } else if (step === "verify") {
                    setStep("email");
                    setPin("");
                  } else if (step === "reset") {
                    setStep("verify");
                  }
                }}
                className="flex-row items-center mb-6"
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <ArrowLeft size={20} color="#374151" />
                </View>
                <Text className="text-lg font-semibold text-gray-800">Back</Text>
              </TouchableOpacity>

              {/* Progress Indicator */}
              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-medium text-gray-700">
                    {getStepTitle()}
                  </Text>
                  <Text className="text-sm font-medium text-emerald-600">
                    {step === "email" ? "Step 1 of 3" : 
                     step === "verify" ? "Step 2 of 3" : 
                     "Step 3 of 3"}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full">
                  <View 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${getStepProgress()}%` }}
                  />
                </View>
                {/* Step Dots */}
                <View className="flex-row justify-between mt-2 px-1">
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    step === "email" ? "bg-emerald-500" : 
                    step === "verify" || step === "reset" ? "bg-emerald-300" : "bg-gray-300"
                  }`}>
                    <Text className={`text-xs font-bold ${
                      step === "email" ? "text-white" : 
                      step === "verify" || step === "reset" ? "text-white" : "text-gray-500"
                    }`}>1</Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    step === "verify" ? "bg-emerald-500" : 
                    step === "reset" ? "bg-emerald-300" : "bg-gray-300"
                  }`}>
                    <Text className={`text-xs font-bold ${
                      step === "verify" ? "text-white" : 
                      step === "reset" ? "text-white" : "text-gray-500"
                    }`}>2</Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    step === "reset" ? "bg-emerald-500" : "bg-gray-300"
                  }`}>
                    <Text className={`text-xs font-bold ${
                      step === "reset" ? "text-white" : "text-gray-500"
                    }`}>3</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1 justify-center">
              {step === "email" && (
                <EmailStep
                  email={email}
                  setEmail={setEmail}
                  onSubmit={handleEmailSubmit}
                  isLoading={isLoading}
                />
              )}
              {step === "verify" && (
                <VerifyStep
                  pin={pin}
                  setPin={setPin}
                  onVerify={handleVerify}
                  email={maskedEmail}
                  onResend={handleResendCode}
                  isResending={isResending}
                  isLoading={isLoading}
                />
              )}
              {step === "reset" && (
                <ResetStep
                  passwords={passwords}
                  setPasswords={setPasswords}
                  onReset={handleResetPassword}
                  isLoading={isLoading}
                />
              )}
            </View>

            {/* Security Information */}
            <View className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <View className="flex-row">
                <ShieldCheck size={18} color="#059669" className="mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-700">
                    <Text className="font-semibold">Security Notice:</Text> For your protection, your new password will be required on all your devices.
                  </Text>
                </View>
              </View>
            </View>

            {/* Help Section */}
            <View className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-center text-gray-600 mb-4">
                Having trouble resetting your password?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/support")}
                className="py-3 border border-emerald-200 rounded-lg active:bg-emerald-50"
                activeOpacity={0.7}
              >
                <Text className="text-center text-emerald-700 font-semibold">
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}