import { Filter, Search } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

// ---------------- SearchBar ----------------
export const SearchBar: React.FC = () => {
    return (
        <View className="flex-row items-center gap-3 py-3 bg-[#f5f5f5] mt-2 sticky top-0 w-[95%] mx-auto">
            {/* Search Input */}
            <View className="flex-row items-center border rounded-3xl px-2 w-[90%] h-10">
                <Search size={16} color="black" strokeWidth={2} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#5C5A5A"
                    className="px-2 text-[12px] font-semibold flex-1 h-10"
                />
            </View>

            {/* Filter Button */}
            <TouchableOpacity className="w-6 h-6 items-center justify-center">
                <Filter size={20} color="#212121" strokeWidth={1.5} />
            </TouchableOpacity>
        </View>
    );
};
