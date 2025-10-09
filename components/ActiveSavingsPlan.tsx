import { Filter, Search } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function SearchBar() {
    return (
        <View className="absolute top-[148px] left-1/2 -ml-[160px] w-[320px] h-6 flex-row items-center px-4 space-x-2">
            {/* Search Input */}
            <View className="flex-row items-center border border-[#E7E7E7] rounded-lg px-2 w-[258px] h-6">
                <Search size={16} color="#212121" strokeWidth={1.5} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#5C5A5A"
                    className="px-2 text-[10px] font-semibold text-[#5C5A5A] flex-1 h-full"
                />
            </View>

            {/* Filter Button */}
            <TouchableOpacity className="w-6 h-6 items-center justify-center">
                <Filter size={20} color="#212121" strokeWidth={1.5} />
            </TouchableOpacity>
        </View>
    );
}
