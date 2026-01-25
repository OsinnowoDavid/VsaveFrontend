import React, { useState } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,

  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react-native";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  emailSchema,
  passwordSchema,
  signinSchema,
} from "../../../schema/form";
import { handleSignin } from "../../../services/authService";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateField = (field: "email" | "password", value: string) => {
    let error = "";
    
    if (field === "email") {
      const validation = emailSchema.safeParse(value);
      if (!validation.success && value.length > 0) {
        error = "Please enter a valid email address";
      }
    }
    
    if (field === "password") {
      const validation = passwordSchema.safeParse(value);
      if (!validation.success && value.length > 0) {
        error = "Password must be at least 6 characters";
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});
    
    const formValidation = signinSchema.safeParse(form);
    
    if (!formValidation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      formValidation.error.errors.forEach((err) => {
        if (err.path[0] === "email") {
          fieldErrors.email = "Please enter a valid email address";
        }
        if (err.path[0] === "password") {
          fieldErrors.password = "Password must be at least 6 characters";
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleSignin(form);
      
      if (result.success) {
        // Navigate based on user state
        if (result.requiresPinSetup) {
          router.replace("/auth/pincode-setup");
        } else if (result.requiresPinLogin) {
          router.replace("/auth/login-with-pin");
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert(
          "Login Failed",
          result.message || "Invalid email or password. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error.message || "Unable to connect to the server. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/reset-password");
  };

  const handleQuickLogin = () => {
    router.push("/auth/login-with-pin");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="px-6 pt-10 pb-6">
            <View className="flex-row items-center mb-6">
              <View className=" rounded-xl items-center justify-center">
                <Image
                                            source={require("../../../assets/images/transparent-logo.png")}
                                            className="w-24 h-24"
                                            resizeMode="contain"
                                        />
              </View>
              <Text className="text-3xl font-bold text-gray-900 ml-4">
                Welcome Back
              </Text>
            </View>
            
            
            {/* Quick Stats */}
            
          </View>

          {/* Form Section */}
          <FormWrapper 
            heading="Account Login" 
            subtitle="Enter your credentials to continue"
          >
            {/* Email Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Mail size={16} color="#6B7280" />
                <Text className="text-gray-700 font-medium ml-2">
                  Email Address
                </Text>
              </View>
              <FormField
                value={form.email}
                onChangeText={(email) => {
                  setForm({ ...form, email });
                  validateField("email", email);
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9CA3AF"
                containerClassName={`border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } bg-white rounded-xl`}
                textClassName="text-gray-900"
                leftIcon={
                  <View className="ml-3">
                    <Mail size={20} color={errors.email ? "#DC2626" : "#9CA3AF"} />
                  </View>
                }
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Lock size={16} color="#6B7280" />
                  <Text className="text-gray-700 font-medium ml-2">
                    Password
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                >
                  <Text className="text-emerald-600 text-sm font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <FormField
                value={form.password}
                onChangeText={(password) => {
                  setForm({ ...form, password });
                  validateField("password", password);
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
                containerClassName={`border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } bg-white rounded-xl`}
                textClassName="text-gray-900"
                leftIcon={
                  <View className="ml-3">
                    <Lock size={20} color={errors.password ? "#DC2626" : "#9CA3AF"} />
                  </View>
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="mr-3"
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                }
              />
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Remember Me & Quick Login */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
                  rememberMe
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-white border-gray-300"
                }`}>
                  {rememberMe && (
                    <View className="w-2 h-2 bg-white rounded" />
                  )}
                </View>
                <Text className="text-gray-700 text-sm">
                  Remember me
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={handleQuickLogin}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Shield size={16} color="#059669" />
                <Text className="text-emerald-600 font-medium ml-2">
                  Quick PIN Login
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* Login Button */}
            <Button
              input={isLoading ? "Authenticating..." : "Sign In"}
              onPress={handleSubmit}
              color="text-white"
              bg={
                form.email && form.password && !errors.email && !errors.password
                  ? "bg-emerald-600"
                  : "bg-emerald-400"
              }
              disabled={
                isLoading ||
                !form.email ||
                !form.password ||
                !!errors.email ||
                !!errors.password
              }
              isLoading={isLoading}
              icon={isLoading ? undefined : "arrow-right"}
              size="lg"
              style={`shadow-lg ${
                form.email && form.password && !errors.email && !errors.password
                  ? "shadow-emerald-200"
                  : ""
              }`}
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-500 text-sm">OR</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Alternative Actions */}
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => router.push("/auth/signup")}
                className="py-3 px-4 border-2 border-emerald-600 rounded-xl active:bg-emerald-50"
                activeOpacity={0.7}
              >
                <Text className="text-center text-emerald-700 font-semibold text-lg">
                  Create New Account
                </Text>
              </TouchableOpacity>

             
            </View>
          </FormWrapper>

          {/* Security Footer */}
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}