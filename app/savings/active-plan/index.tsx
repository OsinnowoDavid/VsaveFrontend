import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "../../../components/Button";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import { PlanCard } from "../../../components/PlanCard";
import { SearchBar } from "../../../components/SearchBar";
import { plans } from "../../../constants/savings-plans";

// ---------------- PlansList ----------------
export default function PlansList() {
    const [visible, setVisible] = useState(false);

    return (
        <HomeScreenWrapper showFooter={false}>
            <View className="flex-1 bg-[#f5f5f5]">
                <SearchBar />
                <FlatList
                    data={plans}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => <PlanCard {...item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 16,
                    }}
                />
            </View>
            <View className="border-[0.2px] border-gray-400"></View>
            <View className="w-[95%] mx-auto pt-2">
                {/* Spacer for button */}
                <Button
                    input="Create New Plan"
                    onPress={() => setVisible(true)}
                />
            </View>
            {/* Overlay / Modal */}
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    {/* Bottom Sheet */}
                    <View className="bg-white w-full rounded-t-2xl p-6 shadow-lg">
                        <Text className="text-lg font-bold text-center text-[#212121] mb-4">
                            Start New Plan
                        </Text>

                        {/* Example Content */}
                        <Text className="mb-2">Select PLan</Text>
                        <TextInput
                            placeholder="Enter Amount"
                            placeholderTextColor="#5C5A5A"
                            className="px-2 text-[12px] font-semibold h-12 border border-gray-300 rounded mb-4"
                            keyboardType="numeric"
                        />
                        <Text className="mb-2">Amount</Text>
                        <TextInput
                            placeholder="Enter Amount"
                            placeholderTextColor="#5C5A5A"
                            className="px-2 text-[12px] font-semibold h-12 border border-gray-300 rounded mb-4"
                            keyboardType="numeric"
                        />

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            className="bg-[#1B8A52] px-4 py-2 rounded-lg"
                        >
                            <Text className="text-white text-center">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </HomeScreenWrapper>
    );
}
