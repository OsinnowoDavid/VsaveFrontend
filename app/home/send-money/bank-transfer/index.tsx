import { router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
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
} from "../../../../services/bankService";

interface Bank {
    id: number;
    code: string;
    name: string;
}

export default function BankTransferScreen() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [form, setForm] = useState({
        bankCode: "",
        accountNumber: "0123456789",
        amount: "",
        remark: "",
    });
    const [resolvedAccount, setResolvedAccount] = useState<{
        account_name: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<
        "success" | "failure"
    >("success");

    useEffect(() => {
        const fetchBanks = async () => {
            const response = await getBankList();
            if (response.success) {
                setBanks(response.data);
            } else {
                Alert.alert("Error", "Could not load bank list.");
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
        const response = await resolveBankAccount({
            accountNumber: form.accountNumber,
            bankCode: form.bankCode,
        });
        setIsResolving(false);
        if (response.success) {
            setResolvedAccount(response.data as { account_name: string });
        } else {
            setResolvedAccount(null);
            Alert.alert("Verification Failed", response.message);
        }
    };

    const handleSendMoney = () => {
        // TODO: Implement actual transaction logic
        console.log("Sending money with details:", form);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsModalVisible(false);

            // Determine success or failure (hardcoded to success for now)
            const isSuccess = true;
            setTransactionStatus(isSuccess ? "success" : "failure");

            // Show the status modal
            setIsStatusModalVisible(true);
        }, 2000);
    };

    const bankOptions = banks.map((bank) => ({
        label: bank.name,
        value: bank.code,
    }));

    const selectedBankName =
        banks.find((b) => b.code === form.bankCode)?.name || "";

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

            <TransactionStatusModal
                isVisible={isStatusModalVisible}
                status={transactionStatus}
                onRedirectHome={() => router.replace("/home")}
            />
        </SafeAreaView>
    );
}
