import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
} from "react-native";
import { Search, Filter } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { useState } from "react";
import FormField from "../../components/FormField";
// ---------------- PlanCard ----------------
type PlanCardProps = {
  title: string;
  amount: string;
  startDate: string;
  maturityDate: string;
  progress: number; // 0–100
};


const PlanCard: React.FC<PlanCardProps> = ({
  title,
  amount,
  startDate,
  maturityDate,
  progress,
}) => {

  return (
    <View className="w-[330px] h-[60px] bg-white rounded border border-green-800 mb-2 px-2 py-3">
      {/* Top row */}
      <View className="flex-row justify-between items-center px-2">
        <Text className="text-[10px] text-[#212121]">{title}</Text>
        <Text className="text-[12px] font-medium text-[#212121]">{amount}</Text>
      </View>

      {/* Progress bar */}
      <View className="w-[300px] h-[5px] bg-[#EFEFEFA3] rounded mt-1 mx-auto">
        <View
          className="h-[5px] bg-[#1B8A52] rounded"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Bottom row */}
      <View className="flex-row justify-between items-center px-2 mt-1">
        <Text className="text-[10px] text-[#5C5A5A]">Start Date: {startDate}</Text>
        <Text className="text-[10px] text-[#5C5A5A]">
          Maturity Date: {maturityDate}
        </Text>
      </View>
    </View>
  );
};

// ---------------- SearchBar ----------------
const SearchBar: React.FC = () => {

  return (
    <SafeAreaProvider>

    <View className="flex-row items-center px-4 gap-3 py-3 bg-[#f5f5f5] mt-2" >
      {/* Search Input */}
      <View className="flex-row items-center border-2 rounded-lg px-2 w-[258px] h-10">
        <Search size={16} color="black" strokeWidth={1.5} />
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
    </SafeAreaProvider>

  );
};

// ---------------- PlansList ----------------
export default function PlansList()


{
   const [visible, setVisible] = useState(false);

  const plans: PlanCardProps[] = [
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 20 },
    { title: "60 Days Plan", amount: "₦100,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 40 },
    { title: "60 Days Plan", amount: "₦70,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 60 },
    { title: "60 Days Plan", amount: "₦20,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 80 },
    { title: "60 Days Plan", amount: "₦90,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 50 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦30,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
    { title: "60 Days Plan", amount: "₦100,000", startDate: "30-09-2025", maturityDate: "30-12-2025", progress: 35 },
  ];

  return (
<SafeAreaProvider>

    <View className="flex-1 bg-[#f5f5f5]">

      <FlatList
        data={plans}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PlanCard {...item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<SearchBar />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </View>

    <View className="mb-10  ml-2 mr-2" > {/* Spacer for button */}
    
    <Button input="Create New Plan"   onPress={() => setVisible(true)} />
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
        <Text className="text-white text-center">Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

</SafeAreaProvider>





  );
}
