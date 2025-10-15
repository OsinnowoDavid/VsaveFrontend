import { router, usePathname } from "expo-router";
import { ArrowRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export interface MenuItem {
    label: string;
    icon: LucideIcon;
    type: "navigation" | "switch";
    screen?: string;
}

interface MenuListItemProps {
    item: MenuItem;
    isLastItem: boolean;
    switchValue?: boolean;
    onSwitchChange?: () => void;
}

export default function MenuListItem({
    item,
    isLastItem,
    switchValue,
    onSwitchChange,
}: MenuListItemProps) {
    const pathname = usePathname();
    const isNavigationItem = item.type === "navigation";
    const isSwitchItem = item.type === "switch";
    const isCurrentScreen = isNavigationItem && pathname === item.screen;

    const handlePress = () => {
        if (isNavigationItem && !isCurrentScreen) {
            router.push(item.screen as any);
        }
    };

    return (
        <TouchableOpacity
            key={item.label}
            className={`flex-row items-center justify-between p-4 ${
                !isLastItem ? "border-b border-gray-100" : ""
            }`}
            onPress={handlePress}
            activeOpacity={isSwitchItem || isCurrentScreen ? 1 : 0.2}
        >
            <View className="flex-row items-center space-x-4">
                <item.icon size={24} color="#4B5563" />
                <Text className="text-base text-gray-700 ml-2">
                    {item.label}
                </Text>
            </View>

            {isNavigationItem && <ArrowRight size={20} color="#9CA3AF" />}

            {isSwitchItem && (
                <Switch
                    trackColor={{
                        false: "#767577",
                        true: "#1B8A52",
                    }}
                    thumbColor={switchValue ? "#f4f3f4" : "#f4f3f4"}
                    onValueChange={onSwitchChange}
                    value={switchValue}
                />
            )}
        </TouchableOpacity>
    );
}
