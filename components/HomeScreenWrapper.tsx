import { usePathname, useRouter } from "expo-router";
import { ReactNode } from "react";
import { StatusBar, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
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
    const pathname = usePathname();

    const insets = useSafeAreaInsets();
    const navItems = [
        {
            href: "/home",
            input: "Home",
            icon: HomeIcon,
        },
        {
            href: "/savings",
            input: "Savings",
            icon: WalletIcon,
        },
        {
            href: "/reward",
            input: "Reward",
            icon: RewardIcon,
        },
        {
            href: "/menu",
            input: "Menu",
            icon: MenuIcon,
        },
    ];

    return (
        <SafeAreaView className={`h-full ${bgColor}`}>
            {children}
            {showFooter && (
                <View
                    id="footer"
                    className="border-t border-gray-200 w-full h-40 absolute bottom-0 flex flex-row justify-around items-center py-1 bg-white"
                >
                    {/* <StatusBar barStyle="dark-content" /> */}
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <NavButton
                                key={item.input}
                                iconComponent={<Icon isActive={isActive} />}
                                input={item.input}
                                onPress={() =>
                                    item.href !== "/" &&
                                    !isActive &&
                                    router.push(item.href as any)
                                }
                            />
                        );
                    })}
                </View>
            )}
        </SafeAreaView>
    );
}
