import { router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../../components/Button";
import ConfirmTransactionModal from "../../../../components/ConfirmTransactionModal";
import FormField from "../../../../components/FormField";
import KeyboardAvoidWrapper from "../../../../components/KeyboardAvoidWrapper";
import TransactionStatusModal from "../../../../components/TransactionStatusModal";
import {
    getBankList,
    resolveBankAccount,
    sendToBank,
} from "../../../../services/bankService";
import { verifyPin } from "../../../../services/pinService"; // Corrected import
import useAuthStore from "../../../../store/useAuthStore";
import { Bank } from "../../../../types/data";
import { CheckCircle, X, Smartphone, Calendar, Hash } from "lucide-react-native";

export default function BankTransferScreen() {
    // Simple Button component to replace the problematic one
    const SimpleButton = ({ 
        input, 
        onPress, 
        variant = "primary",
        disabled = false,
        style 
    }) => {
        const isPrimary = variant === "primary";
        const isOutline = variant === "outline";

        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                style={[
                    {
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: isOutline ? 1 : 0,
                        borderColor: isOutline ? '#10B981' : 'transparent',
                        backgroundColor: isPrimary ? '#10B981' : isOutline ? 'transparent' : '#F3F4F6',
                    },
                    disabled && { opacity: 0.5 },
                    style
                ]}
            >
                <Text 
                    style={{
                        color: isPrimary ? 'white' : isOutline ? '#10B981' : '#374151',
                        fontSize: 16,
                        fontWeight: '600',
                    }}
                >
                    {input}
                </Text>
            </TouchableOpacity>
        );
    };

    // Success Overlay Component
    const SuccessOverlay = ({ 
        isVisible, 
        onClose, 
        transactionDetails 
    }) => {
        return (
            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
            >
                <View className="flex-1 bg-black/70 justify-center items-center p-5">
                    <View className="bg-white rounded-2xl w-full max-w-md">
                        {/* Header with Close Button */}
                        <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                                    <CheckCircle size={24} color="#10B981" />
                                </View>
                                <Text className="text-xl font-bold text-gray-900">Transaction Successful!</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={onClose}
                                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={18} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View className="p-5">
                            {/* Success Message */}
                            <View className="items-center mb-6">
                                <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-4">
                                    <CheckCircle size={40} color="#10B981" />
                                </View>
                                <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
                                    Money Sent Successfully
                                </Text>
                                <Text className="text-gray-600 text-center">
                                    Your transaction has been processed
                                </Text>
                            </View>

                            {/* Transaction Details */}
                            <View className="bg-gray-50 rounded-xl p-4 mb-6">
                                <Text className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</Text>
                                
                                {transactionDetails ? (
                                    <>
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                                                <Smartphone size={16} color="#3B82F6" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Amount</Text>
                                                <Text className="text-lg font-bold text-gray-900">
                                                    ₦{transactionDetails.amount?.toLocaleString() || "0"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-3">
                                                <Smartphone size={16} color="#8B5CF6" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">To</Text>
                                                <Text className="text-base font-semibold text-gray-900">
                                                    {transactionDetails.reciever || transactionDetails.receiver || transactionDetails.accountName || "N/A"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                                                <Calendar size={16} color="#F59E0B" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Date & Time</Text>
                                                <Text className="text-base font-medium text-gray-900">
                                                    {new Date(transactionDetails.createdAt || Date.now()).toLocaleDateString('en-NG', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center">
                                            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mr-3">
                                                <Hash size={16} color="#EF4444" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Reference ID</Text>
                                                <Text className="text-sm font-medium text-gray-900">
                                                    {transactionDetails.transactionReference || "N/A"}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <Text className="text-gray-500 text-center">Loading transaction details...</Text>
                                )}
                            </View>

                            {/* Info Box */}
                            <View className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6">
                                <Text className="text-green-800 text-sm text-center">
                                    ✓ The money has been credited to the recipient's account.
                                    It may take a few moments to reflect.
                                </Text>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-3">
                                <SimpleButton
                                    input="Make Another"
                                    onPress={onClose}
                                    variant="outline"
                                    style={{ flex: 1 }}
                                />
                                <SimpleButton
                                    input="Go Home"
                                    onPress={() => {
                                        onClose();
                                        router.replace("/home");
                                    }}
                                    variant="primary"
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const [banks, setBanks] = useState<Bank[]>([]);
    const [form, setForm] = useState({
        bankCode: "",
        accountNumber: "",
        amount: "",
        remark: "",
    });
    const [pin, setPin] = useState("");
    const [resolvedAccount, setResolvedAccount] = useState<{
        account_name: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [success, setSuccess] = useState(false);

    const { token } = useAuthStore();

    // Helper functions to reset form
    const resetForm = () => {
        setForm({
            bankCode: "",
            accountNumber: "",
            amount: "",
            remark: "",
        });
        setPin("");
        setResolvedAccount(null);
        setIsModalVisible(false);
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
        resetForm();
    };

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await getBankList();
                if (response.success) {
                    setBanks(response.data);
                } else {
                    Alert.alert("Error", "Could not load bank list.");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to load banks. Please try again.");
            }
        };
        fetchBanks();
    }, []);

    useEffect(() => {
        // Debounce account resolution
        if (form.accountNumber.length === 10 && form.bankCode) {
            const handler = setTimeout(() => {
                handleResolveAccount();
            }, 1000);

            return () => {
                clearTimeout(handler);
            };
        } else {
            setResolvedAccount(null);
        }
    }, [form.accountNumber, form.bankCode]);

    const handleResolveAccount = async () => {
        setIsResolving(true);
        try {
            const response = await resolveBankAccount({
                accountNumber: form.accountNumber,
                bankCode: form.bankCode,
            });
            
            if (response.success) {
                setResolvedAccount(response.data as { account_name: string });
            } else {
                setResolvedAccount(null);
                Alert.alert("Verification Failed", response.message);
            }
        } catch (error) {
            setResolvedAccount(null);
            Alert.alert("Error", "Failed to resolve account. Please check details.");
        } finally {
            setIsResolving(false);
        }
    };

    const handleSendMoney = async () => {
        if (!token) {
            Alert.alert("Error", "You are not authenticated. Please log in.");
            return;
        }
        if (!resolvedAccount) {
            Alert.alert("Error", "Recipient account is not verified.");
            return;
        }
        if (pin.length !== 4) {
            Alert.alert("Error", "Please enter your 4-digit transaction PIN.");
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await sendToBank(
                {
                    bankCode: form.bankCode,
                    accountNumber: form.accountNumber,
                    accountName: resolvedAccount.account_name,
                    amount: Number(form.amount),
                    pin
                },
                token
            );
            console.log("send", result)
            
               
        if (result.success) {
            setTransactionDetails(result.data);
            setSuccess(true);
            setIsModalVisible(false);
        } else {
            throw new Error(result.message || "Bank transfer failed.");
        }
        } catch (error: any) {
            Alert.alert("Transfer Failed", error.message || "An unexpected error occurred.");
            console.error("Transfer error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const bankOptions = banks.map((bank) => ({
        label: bank.name,
        value: bank.code,
    }));

    const selectedBankName = banks.find((b) => b.code === form.bankCode)?.name || "";

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4 w-full">
                    Send to Bank
                </Text>
            </View>

            <KeyboardAvoidWrapper>
                <View className="p-6">
                    <FormField
                        label="Select Bank"
                        type="select"
                        value={form.bankCode}
                        onChangeText={(bankCode) =>
                            setForm({ ...form, bankCode })
                        }
                        options={[
                            { label: "Choose a bank...", value: "" },
                            ...bankOptions,
                        ]}
                    />

                    <FormField
                        label="Account Number"
                        value={form.accountNumber}
                        onChangeText={(accountNumber) =>
                            setForm({ ...form, accountNumber })
                        }
                        placeholder="0123456789"
                        keyboardType="number-pad"
                        maxLength={10}
                    />

                    {isResolving && <ActivityIndicator className="mb-4" />}

                    {resolvedAccount && (
                        <View className="flex-row items-center bg-green-50 p-3 rounded-lg mb-6 border border-green-200">
                            <CheckCircle2 size={20} color="#16A34A" />
                            <Text className="text-green-800 font-semibold ml-2">
                                {resolvedAccount.account_name}
                            </Text>
                        </View>
                    )}

                    <FormField
                        label="Amount (₦)"
                        value={form.amount}
                        onChangeText={(amount) => setForm({ ...form, amount })}
                        placeholder="0.00"
                        keyboardType="numeric"
                    />

                    <FormField
                        label="Remark (Optional)"
                        value={form.remark}
                        onChangeText={(remark) => setForm({ ...form, remark })}
                        placeholder="e.g., For groceries"
                    />

                    <View className="mt-4">
                        <Button
                            input="Continue"
                            onPress={() => setIsModalVisible(true)}
                            disabled={
                                !resolvedAccount ||
                                !form.amount ||
                                !form.bankCode
                            }
                        />
                    </View>
                </View>
            </KeyboardAvoidWrapper>

            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleSendMoney}
                title="Confirm Transfer"
                amount={form.amount}
                isLoading={isLoading}
                pin={pin}
                onPinChange={setPin}
                details={[
                    {
                        label: "Recipient Name",
                        value: resolvedAccount?.account_name || "",
                    },
                    { label: "Bank Name", value: selectedBankName },
                    { label: "Account Number", value: form.accountNumber },
                    { label: "Remark", value: form.remark || "N/A" },
                ]}
            />
            
            {/* Success Overlay */}
            <SuccessOverlay
                isVisible={success}
                onClose={handleCloseSuccess}
                transactionDetails={transactionDetails}
            />
        </SafeAreaView>
    );
}