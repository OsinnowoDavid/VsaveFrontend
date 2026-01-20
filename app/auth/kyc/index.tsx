import { Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";
import { ArrowLeft, Building, MapPin, User, Shield, CreditCard, Home, Briefcase, Globe } from "lucide-react-native";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import FormWrapper from "../../../components/FormWrapper";
import PinField from "../../../components/PinField";
import { getBankList, resolveBankAccount } from "../../../services/bankService";
import { getSubRegions, submitKYCStage1, SubRegion } from "../../../services/kycService";
import useAuthStore from "../../../store/useAuthStore";
import useProfileStore from "../../../store/useProfileStore";

interface Bank {
    id: number;
    code: string;
    name: string;
}

/* ------------------------ COUNTRY HELPERS ------------------------ */

const countries = Country.getAllCountries();

const countryIndexToCodeMap: Record<string, number> = {};
const countryOptions = countries.map((c, index) => {
    countryIndexToCodeMap[c.isoCode] = index;
    return { label: c.name, value: c.isoCode };
});

const getStateOptions = (countryCode: string) =>
    State.getStatesOfCountry(countryCode).map((s) => ({
        label: s.name,
        value: s.isoCode,
    }));

const initialCountryCode = "NG";
const initialCountry = countryOptions[countryIndexToCodeMap[initialCountryCode]];

/* ----------------------------- SCREEN ----------------------------- */

export default function KYCScreen() {
    const router = useRouter();
    const { fetchProfile } = useProfileStore();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [subRegions, setSubRegions] = useState<SubRegion[]>([]);
    const [stateOptions, setStateOptions] = useState(getStateOptions(initialCountryCode));

    const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);
    const [pinError, setPinError] = useState<string | null>(null);

    const [form, setForm] = useState({
        profession: "",
        accountNumber: "",
        bankCode: "",
        accountDetails: "",
        country: initialCountry.value,
        state: "",
        address: "",
        bvn: "",
        subRegion: "",
        transactionPin: "",
        confirmTransactionPin: "",
    });

    const updateForm = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        
        // Clear bank account fields when profession changes from Lottery Agent
        if (key === 'profession' && value !== "Lottery Agent") {
            setForm(prev => ({ 
                ...prev, 
                accountNumber: "", 
                bankCode: "",
                accountDetails: ""
            }));
            setResolvedAccountName(null);
        }
    };

    // Check if user is a Lottery Agent
    const isLotteryAgent = form.profession === "Lottery Agent";

    /* ----------------------- INITIAL FETCH ----------------------- */

    useEffect(() => {
        (async () => {
            const banksRes = await getBankList();
            if (banksRes.success) setBanks(banksRes.data);

            const regionsRes = await getSubRegions();
            if (regionsRes.success && regionsRes.data) {
                setSubRegions(regionsRes.data);
            }
        })();
    }, []);

    /* ----------------------- COUNTRY CHANGE ----------------------- */

    useEffect(() => {
        setStateOptions(getStateOptions(form.country));
        updateForm("state", "");
    }, [form.country]);

    /* ----------------------- ACCOUNT RESOLVE ---------------------- */

    useEffect(() => {
        // Only resolve account for Lottery Agents
        if (isLotteryAgent && form.accountNumber.length === 10 && form.bankCode) {
            const timer = setTimeout(resolveAccount, 800);
            return () => clearTimeout(timer);
        }
        setResolvedAccountName(null);
    }, [form.accountNumber, form.bankCode, isLotteryAgent]);

    const resolveAccount = async () => {
        setIsResolving(true);
        setResolvedAccountName(null);

        const res = await resolveBankAccount({
            accountNumber: form.accountNumber,
            bankCode: form.bankCode,
        });

        setIsResolving(false);

        if (res.success && res.data.account_name) {
            setResolvedAccountName(res.data.account_name);
        } else {
            Alert.alert("Verification Failed", res.message);
        }
    };

    /* ---------------------------- SUBMIT ---------------------------- */

    const handleSubmit = async () => {
        // Only require account verification for Lottery Agents
        if (isLotteryAgent && !resolvedAccountName) {
            Alert.alert("Account Verification Required", "Please verify your bank account details before proceeding.");
            return;
        }

        if (form.transactionPin.length !== 4 || form.confirmTransactionPin.length !== 4) {
            Alert.alert("Invalid PIN", "Transaction PIN must be exactly 4 digits.");
            return;
        }

        if (form.transactionPin !== form.confirmTransactionPin) {
            setPinError("PINs do not match. Please re-enter your PIN.");
            return;
        }

        setPinError(null);
        setIsLoading(true);

        const payload = {
            profession: form.profession,
            accountNumber: isLotteryAgent ? form.accountNumber : "", // Only send if Lottery Agent
            bank: isLotteryAgent ? form.bankCode : "", // Only send if Lottery Agent
            country: form.country,
            state: form.state,
            address: form.address,
            bvn: form.bvn,
            accountDetails: isLotteryAgent ? resolvedAccountName : "", // Only send if Lottery Agent
            subRegion: form.subRegion,
            transactionPin: form.transactionPin,
        };

        const res = await submitKYCStage1(payload);
        setIsLoading(false);

        if (res.success) {
            const token = useAuthStore.getState().token;
            if (token) await fetchProfile(token);
            
            Alert.alert(
                "KYC Submitted Successfully!",
                "Your verification is being processed. You'll be notified once completed.",
                [
                    {
                        text: "Continue to Dashboard",
                        onPress: () => router.replace("/home"),
                    },
                ]
            );
        } else {
            Alert.alert("Submission Failed", res.message || "Please check your information and try again.");
        }
    };

    /* ----------------------------- UI ----------------------------- */

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
                    <View className="p-3">

                    {/* Header */}
                    <View className="px-6 pt-6 pb-4">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="flex-row items-center mb-4"
                            activeOpacity={0.7}
                        >
                            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                                <ArrowLeft size={20} color="#374151" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-800">Back</Text>
                        </TouchableOpacity>

                        <View className="mb-6">
                            <Text className="text-2xl font-bold text-gray-800 mb-2">
                                Complete Your Profile
                            </Text>
                            <Text className="text-gray-600">
                                Secure your account with additional verification. This helps us keep your account safe.
                                Your data is securely stored
                            </Text>
                        </View>

                    </View>

                        {/* Personal Information Section */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                    <User size={16} color="#059669" />
                                </View>
                                <Text className="text-xl font-bold text-gray-800">
                                    Personal Information
                                </Text>
                            </View>

                            <FormField
                                label="Profession"
                                type="select"
                                value={form.profession}
                                onChangeText={(v) => updateForm("profession", v)}
                                icon={Briefcase}
                                options={[
                                    { label: "Select Profession", value: "" },
                                    { label: "Lottery Agent", value: "Lottery Agent" },
                                    { label: "Student", value: "Student" },
                                    { label: "Self Employed", value: "self-employed" },
                                    { label: "Unemployed", value: "unemployed" },
                                    { label: "Others", value: "others" },
                                ]}
                                containerStyle="mb-4"
                            />

                            <FormField
                                label="BVN"
                                keyboardType="number-pad"
                                maxLength={11}
                                value={form.bvn}
                                onChangeText={(v) => updateForm("bvn", v)}
                                icon={Shield}
                                placeholder="Enter your 11-digit BVN"
                                containerStyle="mb-4"
                            />
                        </View>

                        {/* Bank Account Section - Only for Lottery Agents */}
                        {isLotteryAgent && (
                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                        <CreditCard size={16} color="#059669" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xl font-bold text-gray-800">
                                            Bank Account Details
                                        </Text>
                                        <Text className="text-sm text-gray-500 mt-1">
                                            Required for Lottery Agents to receive commissions
                                        </Text>
                                    </View>
                                </View>

                                <FormField
                                    label="Bank"
                                    type="select"
                                    value={form.bankCode}
                                    onChangeText={(v) => updateForm("bankCode", v)}
                                    icon={Building}
                                    options={[
                                        { label: "Select Bank", value: "" },
                                        ...banks.map((b) => ({
                                            label: b.name,
                                            value: b.code,
                                        }))
                                    ]}
                                    containerStyle="mb-4"
                                />

                                <FormField
                                    label="Account Number"
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    value={form.accountNumber}
                                    onChangeText={(v) => updateForm("accountNumber", v)}
                                    icon={CreditCard}
                                    placeholder="Enter 10-digit account number"
                                    containerStyle="mb-4"
                                />

                                {/* Account Verification Status */}
                                <View className="mb-6">
                                    {isResolving && (
                                        <View className="flex-row items-center p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                                            <ActivityIndicator size="small" color="#059669" className="mr-3" />
                                            <Text className="text-blue-700 font-medium">Verifying account details...</Text>
                                        </View>
                                    )}

                                    {resolvedAccountName && (
                                        <View className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 mb-4">
                                            <View className="flex-row items-center mb-2">
                                                <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                                    <Text className="text-emerald-700 font-bold">✓</Text>
                                                </View>
                                                <Text className="font-semibold text-emerald-800">Account Verified</Text>
                                            </View>
                                            <Text className="text-emerald-700 pl-9">
                                                {resolvedAccountName}
                                            </Text>
                                        </View>
                                    )}

                                    {!isResolving && !resolvedAccountName && form.accountNumber.length === 10 && form.bankCode && (
                                        <View className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
                                            <Text className="text-yellow-700 text-sm">
                                                Account verification required. Please wait for verification to complete.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Location Information */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                    <MapPin size={16} color="#059669" />
                                </View>
                                <Text className="text-xl font-bold text-gray-800">
                                    Location Information
                                </Text>
                            </View>

                            <FormField
                                label="Country"
                                type="select"
                                value={form.country}
                                onChangeText={(v) => updateForm("country", v)}
                                icon={Globe}
                                options={countryOptions}
                                containerStyle="mb-4"
                            />

                            <FormField
                                label="State"
                                type="select"
                                value={form.state}
                                onChangeText={(v) => updateForm("state", v)}
                                icon={MapPin}
                                options={stateOptions}
                                containerStyle="mb-4"
                            />

                            <FormField
                                label="Address"
                                value={form.address}
                                onChangeText={(v) => updateForm("address", v)}
                                icon={Home}
                                placeholder="Enter your complete address"
                                multiline
                                numberOfLines={2}
                                containerStyle="mb-4"
                            />

                            <FormField
                                label="Sub Region"
                                type="select"
                                value={form.subRegion}
                                onChangeText={(v) => updateForm("subRegion", v)}
                                icon={MapPin}
                                options={subRegions.map((r) => ({
                                    label: r.subRegionName,
                                    value: r._id,
                                }))}
                                containerStyle="mb-6"
                            />
                        </View>

                        {/* Transaction PIN Section */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                    <Shield size={16} color="#059669" />
                                </View>
                                <Text className="text-xl font-bold text-gray-800">
                                    Security PIN
                                </Text>
                            </View>

                            <Text className="text-gray-600 mb-4">
                                Create a 4-digit PIN for secure transactions
                            </Text>

                            <PinField
                                label="Create PIN"
                                value={form.transactionPin}
                                onChangeText={(v) => updateForm("transactionPin", v)}
                                show={showPin}
                                onToggleShow={() => setShowPin((p) => !p)}
                                containerStyle="mb-4"
                                cellStyle="w-14 h-14 border-2 border-gray-300 rounded-lg"
                                activeCellStyle="border-emerald-500 bg-emerald-50"
                            />

                            <PinField
                                label="Confirm PIN"
                                value={form.confirmTransactionPin}
                                onChangeText={(v) => updateForm("confirmTransactionPin", v)}
                                show={showConfirmPin}
                                onToggleShow={() => setShowConfirmPin((p) => !p)}
                                containerStyle="mb-4"
                                cellStyle="w-14 h-14 border-2 border-gray-300 rounded-lg"
                                activeCellStyle="border-emerald-500 bg-emerald-50"
                            />

                            {pinError && (
                                <View className="p-3 bg-red-50 rounded-lg border border-red-100 mb-4">
                                    <Text className="text-red-600 text-sm">{pinError}</Text>
                                </View>
                            )}

                            <View className="p-4 bg-gray-50 rounded-lg mb-6">
                                <Text className="text-sm text-gray-600">
                                    <Text className="font-semibold text-gray-700">Important:</Text> This PIN will be required for all transactions. Keep it secure and do not share with anyone.
                                </Text>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <Button
                            input={isLoading ? "Submitting..." : "Submit Verification"}
                            onPress={handleSubmit}
                            color="text-white"
                            bg={
                                (isLotteryAgent ? resolvedAccountName : true) && !isLoading
                                    ? "bg-emerald-600"
                                    : "bg-emerald-400"
                            }
                            disabled={(isLotteryAgent && !resolvedAccountName) || isLoading}
                            isLoading={isLoading}
                            icon={isLoading ? undefined : "shield-check"}
                            size="lg"
                            style="shadow-lg shadow-emerald-200"
                        />

                        {/* Security Notice */}
                        <View className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <View className="flex-row">
                                <Shield size={18} color="#059669" className="mr-3 mt-0.5" />
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-700">
                                        <Text className="font-semibold">Your security is our priority.</Text> All information is encrypted and processed securely in compliance with data protection regulations.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Support Information */}
                        <View className="mt-8 pt-6 border-t border-gray-200">
                            <TouchableOpacity
                                onPress={() => router.push("/auth/support")}
                                className="py-3 border border-emerald-200 rounded-lg active:bg-emerald-50"
                                activeOpacity={0.7}
                            >
                                <Text className="text-center text-emerald-700 font-semibold">
                                    Contact Support Team
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}