import { router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../../components/Button";
import ConfirmTransactionModal from "../../../../components/ConfirmTransactionModal";
import FormField from "../../../../components/FormField";
import KeyboardAvoidWrapper from "../../../../components/KeyboardAvoidWrapper";
import TransactionStatusModal from "../../../../components/TransactionStatusModal";
import { resolveVsaveUser } from "../../../../services/userService";

interface VsaveUser {
    name: string;
    phone: string;
    tag: string;
}

export default function VsaveTransferScreen() {
    const [form, setForm] = useState({
        recipientPhone: "07012345678",
        amount: "",
        remark: "",
    });
    const [resolvedUser, setResolvedUser] = useState<VsaveUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<
        "success" | "failure"
    >("success");

    useEffect(() => {
        // Debounce user resolution
        if (form.recipientPhone.length >= 10) {
            const handler = setTimeout(() => {
                handleResolveUser();
            }, 1000);

            return () => {
                clearTimeout(handler);
            };
        } else {
            setResolvedUser(null);
        }
    }, [form.recipientPhone]);

    const handleResolveUser = async () => {
        setIsResolving(true);
        const response = await resolveVsaveUser(form.recipientPhone);
        setIsResolving(false);
        if (response.success) {
            setResolvedUser(response.data as VsaveUser);
        } else {
            setResolvedUser(null);
            // Optionally show a subtle error or just wait for a valid number
        }
    };

    const handleSendMoney = () => {
        // TODO: Implement actual transaction logic
        console.log("Sending money to Vsave user:", form);
        setIsLoading(true);
        setTimeout(() => {
            // This timeout simulates the API call
            setIsLoading(false);
            setIsModalVisible(false);

            // Determine success or failure (hardcoded to success for now)
            const isSuccess = true;
            setTransactionStatus(isSuccess ? "success" : "failure");

            // Show the status modal
            setIsStatusModalVisible(true);
        }, 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">
                    Send to Vsave User
                </Text>
            </View>

            <KeyboardAvoidWrapper>
                <View className="p-6">
                    <FormField
                        label="Recipient's Phone Number"
                        value={form.recipientPhone}
                        onChangeText={(recipientPhone) =>
                            setForm({ ...form, recipientPhone })
                        }
                        placeholder="07012345678"
                        keyboardType="number-pad"
                        maxLength={11}
                    />

                    {isResolving && <ActivityIndicator className="mb-4" />}

                    {resolvedUser && (
                        <View className="flex-row items-center bg-green-50 p-3 rounded-lg mb-6 border border-green-200">
                            <CheckCircle2 size={20} color="#16A34A" />
                            <View className="ml-2">
                                <Text className="text-green-800 font-semibold">
                                    {resolvedUser.name}
                                </Text>
                                <Text className="text-green-700 text-xs">
                                    {resolvedUser.tag}
                                </Text>
                            </View>
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
                        placeholder="e.g., For lunch"
                    />

                    <View className="mt-4">
                        <Button
                            input="Continue"
                            onPress={() => setIsModalVisible(true)}
                            disabled={!resolvedUser || !form.amount}
                        />
                    </View>
                </View>
            </KeyboardAvoidWrapper>

            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleSendMoney}
                title="Confirm Vsave Transfer"
                amount={form.amount}
                isLoading={isLoading}
                details={[
                    {
                        label: "Recipient Name",
                        value: resolvedUser?.name || "",
                    },
                    {
                        label: "Recipient Phone",
                        value: resolvedUser?.phone || "",
                    },
                    {
                        label: "Vsave Tag",
                        value: resolvedUser?.tag || "",
                    },
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
