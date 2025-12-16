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
import { useEffect } from "react";
import {  Text, TouchableOpacity, View } from "react-native";
import Balance from "../../components/Balance";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import NavButton from "../../components/NavButton";
import TransactionCard from "../../components/TransactionCard";
import useProfileStore from "../../store/useProfileStore";
import useTransactionStore from "../../store/useTransactionStore";
import VSaveCarousel from "../../components/VSaveCarousel";
import CompactVSaveCarousel,{CompactCarouselItems} from "../../components/CompactCarousel";
export default function Home() {
    const router = useRouter();
    const { profile } = useProfileStore();
    const { transactions, fetchTransactions } = useTransactionStore();

     const handleCarouselItemPress = (item: any) => {
    Alert.alert(
      item.title,
      item.description || 'Tap to explore this offer',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => {
          // Navigate to offer details
          console.log('Navigating to:', item.id);
        }}
      ]
    );
  };

    // Fetch transactions when home screen is focused
    useEffect(() => {
        fetchTransactions();
    }, []);

    const quickActions = [
        {
            label: "Send",
            icon: <ArrowUpRight color="#1B8A52" size={28} />,
            bgColor: "bg-green-200/20",
            onPress: () => {
                router.push("/home/send-money/bank-transfer");
            },
            width: "w-[20%]",
        },
        {
            label: "Add Money",
            bgColor: "bg-blue-200/20",
            icon: <PlusCircle color="#47BBD4" size={28} />,
            onPress: () => router.push("/home/add-money"),
            width: "w-[20%]",
        },

        {
            label: "Airtime",
            bgColor: "bg-orange-200/20",
            icon: <Smartphone color="orange" size={28} />,
            onPress: () => router.push("/home/airtime"),
            width: "w-[20%]",
        },
        {
            label: "Data",
            bgColor: "bg-purple-200/20",
            icon: <Wifi color="#7B1B8A" size={28} />,
            onPress: () => {
                router.push("/home/data");
            },
            width: "w-[20%]",
        },
        
        // {
        //     label: "Terminal",
        //     bgColor: "bg-[brown]/15",
        //     icon: <Landmark color="#B32375" size={28} />,
        //     onPress: () => {},
        //     width: "w-[40%]",
        // },

        {
            label: "Quick Loan",
            bgColor: "bg-yellow-200/20",
            icon: <Banknote color="#C1C717" size={28} />,
            onPress: () => {router.push("/home/loan")},
            width: "w-[40%]",
        },
    ];

    return (
        <HomeScreenWrapper  >
            {/* <StatusBar barStyle="dark-content" /> */}
            <View className="mt-6 w-[95%] mx-auto  ">
                <View className="flex flex-row justify-between pe-3 ">
                    <Text className="font-meduim text-2xl px-2">
                        Welcome, {profile?.profile?.firstName}
                    </Text>
                    <View className="flex flex-row gap-5">
                        <UserCircleIcon
                            color={"#1B8A52"}
                            onPress={() => router.push("/menu/account")}
                        />
                        <Bell
                            color={"#1B8A52"}
                            onPress={() => router.push("/menu/notifications")}
                        />
                    </View>
                </View>
                <Balance />
                <View className="mt-7">
                    <Text className="text-xl font-semibold mb-4">
                        Quick Actions
                    </Text>
                    <View className="flex flex-row flex-wrap justify-between gap-y-4">
                        {/* <View>
                            <Text>knxe</Text>
                        </View> */}
                        {quickActions.map((action) => (
                            <NavButton
                                key={action.label}
                                bg={action.bgColor}
                                input={action.label}
                                onPress={action.onPress}
                                icon
                                iconComponent={action.icon}
                                width={action.width + " gap-2"}
                                padding="p-4"
                            />
                        ))}
{/* { */}

// profile.profile.gder==="njfnvewjn"?
                        <View className="bg-[brown]/15 p-4 w-[40%] h-[27%] justify-self-center">
                        <View className="justify-center">



                            <Landmark  color="#B32375" size={28}/>
                        </View>


                            <Text className="absolute mt-16">Terminal</Text>

                            </View>:(<View></View>)
{/* } */}
                    </View>
                </View>
                <View className="mt-3">
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
                        {transactions.slice(0, 3).map((tx, index) => (
                            <TransactionCard key={tx._id || index} {...tx} />
                        ))}
                        {transactions.length === 0 && (
                            <Text className="text-center text-gray-500 p-4">
                                No recent transactions.
                            </Text>
                        )}
                    </View>
                     <CompactVSaveCarousel 

          />
                </View>
            </View>
        </HomeScreenWrapper>
    );
}
