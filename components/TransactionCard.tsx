import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export type TransactionType = "credit" | "debit";

export interface TransactionCardProps {
    type: TransactionType;
    title: string;
    date: string;
    amount: string;
    status: "Completed" | "Pending" | "Failed";
}

const statusColors = {
    Completed: "text-green-600",
    Pending: "text-yellow-600",
    Failed: "text-red-600",
};

export default function TransactionCard({
    type,
    title,
    date,
    amount,
    status,
}: TransactionCardProps) {
    const isCredit = type === "credit";
    const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
    const iconColor = isCredit ? "#16A34A" : "#EF4444";
    const amountColor = isCredit ? "text-green-600" : "text-red-500";
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <View className="flex-row items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center space-x-4">
                <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-100">
                    <Icon size={20} color={iconColor} />
                </View>
                <View>
                    <Text className="text-base font-semibold text-gray-800">
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
                }₦${amount}`}</Text>
                <Text className={`text-xs ${statusColors[status]}`}>
                    {status}
                </Text>
            </View>
        </View>
    );
}
