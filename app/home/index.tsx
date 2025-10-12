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
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import Balance from "../../components/Balance";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import NavButton from "../../components/NavButton";
import TransactionCard from "../../components/TransactionCard";
import { recentTransactions } from "../../constants/transactions";

export default function Home() {
    const router = useRouter();

    const quickActions = [
        {
            label: "Send",
            icon: <ArrowUpRight color="#1B8A52" size={28} />,
            onPress: () => {},
        },
        {
            label: "Add Money",
            icon: <PlusCircle color="#1B8A52" size={28} />,
            onPress: () => router.push("/home/addMoney"),
        },
        {
            label: "Terminal",
            icon: <Landmark color="#1B8A52" size={28} />,
            onPress: () => {},
        },
        {
            label: "Airtime",
            icon: <Smartphone color="#1B8A52" size={28} />,
            onPress: () => router.push("/home/airtime"),
        },
        {
            label: "Data",
            icon: <Wifi color="#1B8A52" size={28} />,
            onPress: () => {
                router.push("/home/data");
            },
        },
        {
            label: "Quick Loan",
            icon: <Banknote color="#1B8A52" size={28} />,
            onPress: () => {},
        },
    ];

    return (
        <HomeScreenWrapper bgColor="bg-[#f5f5f5]">
            <StatusBar barStyle="dark-content" />
            <View className="mt-6 w-[95%] mx-auto bg-[#f5f5f5]">
                <View className="flex flex-row justify-between pe-3">
                    <Text className="font-meduim text-2xl px-2">
                        Welcome, David
                    </Text>
                    <View className="flex flex-row gap-5">
                        <UserCircleIcon color={"#1B8A52"} />
                        <Bell color={"#1B8A52"} />
                    </View>
                </View>
                <Balance />
                <View className="mt-8">
                    <Text className="text-xl font-semibold mb-4">
                        Quick Actions
                    </Text>
                    <View className="flex flex-row flex-wrap justify-between gap-y-4">
                        {quickActions.map((action) => (
                            <NavButton
                                key={action.label}
                                bg="bg-white"
                                input={action.label}
                                onPress={action.onPress}
                                icon
                                iconComponent={action.icon}
                                width="w-[30%]"
                            />
                        ))}
                    </View>
                </View>
                <View className="mt-8">
                    <View className="mb-4 flex flex-row justify-between">
                        <Text className="text-xl font-semibold">
                            Recent transactions
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/home/transactions")}
                        >
                            <Text className="text-[#1B8A52] text-base font-medium">
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="bg-white rounded-xl p-2">
                        {recentTransactions.map((tx, index) => (
                            <TransactionCard key={index} {...tx} />
                        ))}
                    </View>
                </View>
            </View>
        </HomeScreenWrapper>
    );
}
