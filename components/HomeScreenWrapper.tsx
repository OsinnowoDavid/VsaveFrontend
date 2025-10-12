import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "../assets/icons/HomeIcon";
import MenuIcon from "../assets/icons/MenuIcon";
import RewardIcon from "../assets/icons/RewardIcon";
import WalletIcon from "../assets/icons/WalletIcon";
import NavButton from "./NavButton";

export default function HomeScreenWrapper({
    children,
    bgColor = "bg-white",
    showFooter = true,
}: {
    children: ReactNode;
    bgColor?: string;
    showFooter?: boolean;
}) {
    const router = useRouter();
    return (
        <SafeAreaView className={`h-full ${bgColor}`}>
            {children}
            {showFooter && (
                <View
                    id="footer"
                    className="border-t border-gray-300 w-full absolute border bottom-0 flex flex-row justify-around items-center py-1 bg-white"
                >
                    <NavButton
                        iconComponent={<HomeIcon isActive={true} />}
                        input="Home"
                        onPress={() => {
                            router.push("/home");
                        }}
                    />
                    <NavButton
                        input="Savings"
                        iconComponent={<WalletIcon />}
                        onPress={() => {
                            router.push("/savings");
                        }}
                    />
                    <NavButton
                        input="Reward"
                        iconComponent={<RewardIcon />}
                        onPress={() => {}}
                    />
                    <NavButton
                        input="Menu"
                        iconComponent={<MenuIcon />}
                        onPress={() => {
                            router.push("/menu");
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
