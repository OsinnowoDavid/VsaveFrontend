import { useRouter } from "expo-router";
import {
    ArrowUpRight,
    Banknote,
    Bell,
    Landmark,
    PlusCircle,
    Smartphone,
    UserCircleIcon,
    Wifi,
} from "lucide-react-native";
import { useEffect, useMemo, useCallback } from "react"; // Added useCallback
import { 
    ScrollView,
    Text, 
    TouchableOpacity, 
    View, 
    Alert 
} from "react-native";
import Balance from "../../components/Balance";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import NavButton from "../../components/NavButton";
import TransactionCard from "../../components/TransactionCard";
import useProfileStore from "../../store/useProfileStore";
import useTransactionStore from "../../store/useTransactionStore";
import CompactVSaveCarousel from "../../components/CompactCarousel";

export default function Home() {
    const router = useRouter();
    const { profile, fetchProfile, } = useProfileStore();
    const { transactions, fetchTransactions } = useTransactionStore();

    // Memoize the carousel press handler
    const handleCarouselItemPress = useCallback((item: any) => {
        Alert.alert(
            item.title,
            item.description || 'Tap to explore this offer',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'View Details', 
                    onPress: () => {
                        console.log('Navigating to:', item.id);
                        // You might want to navigate based on item.type or route
                        if (item.route) {
                            router.push(item.route);
                        }
                    }
                }
            ]
        );
    }, [router]);

    // Fetch data when home screen is focused
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchTransactions(),
                    fetchProfile() // Fetch profile if needed
                ]);
            } catch (error) {
                console.error("Error loading home data:", error);
                // Optionally show a toast/alert
                Alert.alert(
                    "Error",
                    "Failed to load data. Please pull to refresh.",
                    [{ text: "OK" }]
                );
            }
        };
        
        loadData();
    }, [fetchTransactions, fetchProfile]); // Add dependencies

    // Memoize recent transactions
    const recentTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];
        
        // Sort by date (newest first) and take first 3
        return [...transactions]
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || 0);
                const dateB = new Date(b.createdAt || b.date || 0);
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 3);
    }, [transactions]);

    // Memoize quick actions to prevent recreation on every render
    const quickActions = useMemo(() => {
        const baseActions = [
            {
                id: "send",
                label: "Send",
                icon: <ArrowUpRight color="#1B8A52" size={28} />,
                bgColor: "bg-green-100", // More consistent opacity
                onPress: () => router.push("/home/send-money/bank-transfer"),
                width: "w-[23%]", // Consistent width for 4 items per row
            },
            {
                id: "add-money",
                label: "Add Money",
                bgColor: "bg-blue-100",
                icon: <PlusCircle color="#47BBD4" size={28} />,
                onPress: () => router.push("/home/add-money"),
                width: "w-[23%]",
            },
            {
                id: "airtime",
                label: "Airtime",
                bgColor: "bg-orange-100",
                icon: <Smartphone color="#FFA726" size={28} />, // Fixed color
                onPress: () => router.push("/home/airtime"),
                width: "w-[23%]",
            },
            {
                id: "data",
                label: "Data",
                bgColor: "bg-purple-100",
                icon: <Wifi color="#7B1B8A" size={28} />,
                onPress: () => router.push("/home/data"),
                width: "w-[23%]",
            },
            {
                id: "quick-loan",
                label: "Quick Loan",
                bgColor: "bg-yellow-100",
                icon: <Banknote color="#C1C717" size={28} />,
                onPress: () => router.push("/home/loan"),
                width: "w-[48%]", // Takes half width for better alignment
            },
        ];

        // Conditionally add Terminal button if user is a Lottery Agent
        if (profile?.kyc?.profession === "Lottery Agent") {
            baseActions.push({
                id: "terminal",
                label: "Terminal",
                bgColor: "bg-pink-100", // Using pink instead of brown for better contrast
                icon: <Landmark color="#B32375" size={28} />,
                onPress: () => router.push("/home/terminal"),
                width: "w-[48%]",
            });
        }

        return baseActions;
    }, [router, profile?.kyc?.profession]); // Recreate only when dependencies change

    // Handle pull-to-refresh if implemented
    const handleRefresh = useCallback(async () => {
        try {
            await Promise.all([fetchTransactions(), fetchProfile()]);
        } catch (error) {
            console.error("Refresh error:", error);
        }
    }, [fetchTransactions, fetchProfile]);

    return (
        <HomeScreenWrapper>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                // Add refresh control if needed:
                // refreshControl={
                //     <RefreshControl
                //         refreshing={false}
                //         onRefresh={handleRefresh}
                //     />
                // }
            >
                <View className="mt-6 w-[95%] mx-auto">
                    {/* Header */}
                    <View className="flex-row justify-between items-center px-2 mb-6">
                        <Text className="font-medium text-2xl">
                            Welcome, {profile?.profile?.firstName || "User"}
                        </Text>
                        <View className="flex-row gap-5">
                            <TouchableOpacity 
                                onPress={() => router.push("/menu/account")}
                                activeOpacity={0.7}
                                accessibilityLabel="Go to account"
                            >
                                <UserCircleIcon color="#1B8A52" size={28} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => router.push("/menu/notifications")}
                                activeOpacity={0.7}
                                accessibilityLabel="Go to notifications"
                            >
                                <Bell color="#1B8A52" size={28} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Balance */}
                    <Balance />
                    
                    {/* Quick Actions */}
                    <View className="mt-7">
                        <Text className="text-xl font-semibold mb-4">
                            Quick Actions
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-4">
                            {quickActions.map((action) => (
                                <NavButton
                                    key={action.id}
                                    bg={action.bgColor}
                                    input={action.label}
                                    onPress={action.onPress}
                                    icon
                                    iconComponent={action.icon}
                                    width={action.width}
                                    padding="p-4"
                                    className="min-h-[90px]" // Consistent height
                                />
                            ))}
                        </View>
                    </View>
                    
                    {/* Recent Transactions */}
                    <View className="mt-8 mb-6">
                        <View className="mb-4 flex-row justify-between items-center">
                            <Text className="text-xl font-semibold">
                                Recent Transactions
                            </Text>
                            {recentTransactions.length > 0 && (
                                <TouchableOpacity 
                                    onPress={() => router.push("/home/transactions")}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-[#1B8A52] text-base font-medium">
                                        See all
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tx, index) => (
                                    <TransactionCard 
                                        key={tx._id || `tx-${index}-${tx.createdAt || tx.date}`}
                                        {...tx} 
                                    />
                                ))
                            ) : (
                                <View className="items-center justify-center p-6">
                                    <Text className="text-gray-500 text-center mb-2">
                                        No recent transactions
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => router.push("/home/add-money")}
                                        className="mt-2"
                                    >
                                        <Text className="text-[#1B8A52] font-medium">
                                            Add money to get started
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        
                        {/* Carousel */}
                        <View className="mt-6">
                            <Text className="text-xl font-semibold mb-4">
                                Offers
                            </Text>
                            <CompactVSaveCarousel 
                                onItemPress={handleCarouselItemPress}
                                // Pass any other props needed by CompactCarousel
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}