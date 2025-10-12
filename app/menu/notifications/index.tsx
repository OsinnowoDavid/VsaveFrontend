import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationCard from "../../../components/NotificationCard";
import { notificationsData } from "../../../constants/notifications";

export default function NotificationsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">
                    Notifications
                </Text>
            </View>

            <FlatList
                data={notificationsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard {...item} />}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center p-8">
                        <Text className="text-gray-500">
                            No notifications yet.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
