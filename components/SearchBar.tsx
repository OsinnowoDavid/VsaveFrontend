import { Filter, Search } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onFilterPress,
}) => {
    return (
        <View className="flex-row items-center gap-3 py-3 bg-gray-50 w-[95%] mx-auto">
            {/* Search Input */}
            <View className="flex-1 flex-row items-center border border-gray-300 bg-white rounded-full px-3 h-11">
                <Search size={16} color="black" strokeWidth={2} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#5C5A5A"
                    className="px-2 text-base font-medium flex-1 h-full"
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>

            {/* Filter Button */}
            <TouchableOpacity
                onPress={onFilterPress}
                className="w-11 h-11 items-center justify-center bg-white border border-gray-300 rounded-full"
            >
                <Filter size={20} color="#212121" strokeWidth={1.5} />
            </TouchableOpacity>
        </View>
    );
};
