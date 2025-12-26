 import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

const statusColors = {
    Completed: "text-green-600",
    Pending: "text-yellow-600",
    Failed: "text-red-600",
};

interface Transaction {
    _id: string;
    type: "deposit" | "airtime" | "data" | "withdrawal" | string;
    amount: number;
    date: string;
    status: "success" | "pending" | "failed" | string;
    reciever?: string;
    sender?: string;
    network?: string;
    bundle?: {
        bundle_description?: string;
    };
}

export type TransactionCardProps = Transaction;

export default function TransactionCard(props: TransactionCardProps) {
    // --- Data Transformation Logic ---

    // 1. Determine if it's a credit or debit transaction
    const isCredit = props.type === "deposit";

    // 2. Craft a descriptive title
    const getTitle = () => {
        switch (props.type) {
            case "deposit":
                return `Deposit from ${props.sender || "Unknown"}`;
            case "airtime":
                return `Airtime Purchase (${props.network || "N/A"})`;
            case "data":
                return `Data Purchase (${
                    props.bundle?.bundle_description || props.network || "N/A"
                })`;
            case "withdrawal":
                return `Transfer to ${props.reciever || "N/A"}`;
            default:
                return "Transaction"; // Fallback title
        }
    };
    const title = getTitle();

    // 3. Map status to a display-friendly format
    const statusMap = {
        success: "Completed",
        pending: "Pending",
        failed: "Failed",
    };
    const displayStatus =
        statusMap[props.status as keyof typeof statusMap] || "Unknown";

    // --- Presentation Logic ---

    const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
    const iconColor = isCredit ? "#16A34A" : "#EF4444"; // green-600 or red-500
    const amountColor = isCredit ? "text-green-600" : "text-red-500";
    const formattedDate = new Date(props.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const formattedAmount = props.amount.toLocaleString();

    return (
        <View className="flex-row items-center justify-between px-1 py-3 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center space-x-4">
                <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 mr-2">
                    <Icon size={20} color={iconColor} />
                </View>
                <View>
                    <Text className="text-base w-44 font-semibold text-gray-800 ">
                        {title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {formattedDate}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className={`text-base font-bold ${amountColor}`}>{`${
                    isCredit ? "+" : "-"
                }₦${formattedAmount}`}</Text>
                <Text
                    className={`text-xs ${
                        statusColors[displayStatus as keyof typeof statusColors]
                    }`}
                >
                    {displayStatus}
                </Text>
            </View>
        </View>
    );
}
