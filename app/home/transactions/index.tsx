import { router } from "expo-router";
import { ArrowLeft, Download } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterModal from "../../../components/FilterModal";
import { SearchBar } from "../../../components/SearchBar";
import TransactionCard from "../../../components/TransactionCard";
import useTransactionStore from "../../../store/useTransactionStore";

type FilterOption =
    | "All"
    | "Today"
    | "This Week"
    | "This Month"
    | "Credit Only"
    | "Debit Only";

export default function TransactionHistoryScreen() {
    const { transactions, isLoading, error, fetchTransactions } =
        useTransactionStore();
    useEffect(() => {
        // Fetch transactions when the component mounts
        fetchTransactions();
    }, []);

    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const filterOptions: FilterOption[] = [
        "All",
        "Today",
        "This Week",
        "This Month",
        "Credit Only",
        "Debit Only",
    ];

    const handleDownloadPress = () => {
        Alert.alert(
            "Download Statement",
            "Choose a format to download your statement.",
            [
                {
                    text: "Download as PDF",
                    onPress: () => alert("Downloading as PDF..."),
                },
                {
                    text: "Download as CSV",
                    onPress: () => alert("Downloading as CSV..."),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions]; // Create a mutable copy to avoid reassignment issues
        const today = new Date();

        switch (activeFilter) {
            case "Credit Only":
                filtered = filtered.filter((tx) => tx.type === "credit");
                break;
            case "Debit Only":
                filtered = filtered.filter((tx) => tx.type === "debit");
                break;
            case "Today":
                filtered = filtered.filter((tx) => {
                    return (
                        new Date(tx.date).toDateString() ===
                        today.toDateString()
                    );
                });
                break;
            case "This Week":
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                filtered = filtered.filter(
                    (tx) => new Date(tx.date) >= oneWeekAgo
                );
                break;
            case "This Month":
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                filtered = filtered.filter((tx) => {
                    const txDate = new Date(tx.date);
                    return (
                        txDate.getMonth() === currentMonth &&
                        txDate.getFullYear() === currentYear
                    );
                });
                break;
        }

        if (searchQuery) {
            return filtered.filter((tx) =>
                (tx.reciever || tx.sender || tx.type)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [activeFilter, searchQuery, transactions]);

    if (isLoading && transactions.length === 0) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#1B8A52" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-red-500 text-center">{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">
                    Transaction History
                </Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={() => setFilterModalVisible(true)}
            />

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TransactionCard {...item} />}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center p-8 mt-20">
                        <Text className="text-gray-500 text-lg">
                            No transactions yet.
                        </Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity
                onPress={handleDownloadPress}
                className="absolute bottom-10 right-6 bg-green-700 w-14 h-14 rounded-full justify-center items-center shadow-lg"
            >
                <Download size={28} color="white" />
            </TouchableOpacity>

            <FilterModal
                isVisible={isFilterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                title="Filter Transactions"
            >
                <View className="flex-row flex-wrap gap-3 mb-6">
                    {filterOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => {
                                setActiveFilter(option);
                                setFilterModalVisible(false);
                            }}
                            className={`px-4 py-2 rounded-full border ${
                                activeFilter === option
                                    ? "bg-green-700 border-green-700"
                                    : "bg-white border-gray-300"
                            }`}
                        >
                            <Text
                                className={`font-semibold ${
                                    activeFilter === option
                                        ? "text-white"
                                        : "text-gray-700"
                                }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </FilterModal>
        </SafeAreaView>
    );
}
