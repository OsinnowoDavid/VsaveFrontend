import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Ballance from "../../components/Ballance";
import Button from "../../components/Button";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
const networks = [
  { id: "mtn", Icon: require("../../assets/images/mtn.png") },
  { id: "airtel", Icon: require("../../assets/images/airtel.png") },
  { id: "glo", Icon: require("../../assets/images/glo.png") },
  { id: "etisalat", Icon: require("../../assets/images/etisalat.png") },
];

// Sample data plans per network
const dataPlans: Record<string, { id: string; label: string; price: number }[]> =
  {
    mtn: [
      { id: "mtn1", label: "500MB - 30 Days", price: 500 },
      { id: "mtn2", label: "1GB - 30 Days", price: 1000 },
      { id: "mtn3", label: "5GB - 30 Days", price: 3000 },
    ],
    airtel: [
      { id: "air1", label: "750MB - 14 Days", price: 600 },
      { id: "air2", label: "1.5GB - 30 Days", price: 1200 },
      { id: "air3", label: "3GB - 30 Days", price: 2500 },
    ],
    glo: [
      { id: "glo1", label: "1GB - 14 Days", price: 500 },
      { id: "glo2", label: "2GB - 30 Days", price: 1000 },
      { id: "glo3", label: "6GB - 30 Days", price: 3000 },
    ],
    etisalat: [
      { id: "eti1", label: "500MB - 7 Days", price: 300 },
      { id: "eti2", label: "1.5GB - 30 Days", price: 1000 },
      { id: "eti3", label: "4GB - 30 Days", price: 2500 },
    ],
  };

const Index = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <HomeScreenWrapper>

    <View className="flex-1 bg-white">

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Balance Component */}
            <Ballance />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <View className="self-center w-[288px]   mt-10">
                {/* Title */}
                <Text className="text-[10px] font-medium text-[#212121] mb-2">
                  Choose Network
                </Text>

                {/* Network Logos */}
                <View className="flex-row justify-between mb-6">
                  {networks.map((net) => (
                    <TouchableOpacity
                      key={net.id}
                      onPress={() => {
                        setSelectedNetwork(net.id);
                        setSelectedPlan(null);
                        setCustomAmount("");
                      }}
                      className={`w-[50px] h-[50px] rounded-md border items-center justify-center ${
                        selectedNetwork === net.id
                          ? "border-[#1B8A52]"
                          : "border-[#E5E7EA]"
                      }`}
                    >
                      <Image
                        source={net.Icon}
                        style={{ width: 40, height: 40, resizeMode: "contain" }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Data Plans */}
                {selectedNetwork && (
                  <View className="mb-4">
                    <Text className="text-[12px] font-medium text-[#131927] mb-1">
                      Select Data Plan
                    </Text>
                    <ScrollView
                      className="max-h-[120px] border border-[#E5E7EA] rounded-lg bg-[#F9FAFB]"
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      {dataPlans[selectedNetwork].map((plan) => (
                        <TouchableOpacity
                          key={plan.id}
                          onPress={() => {
                            setSelectedPlan(plan.id);
                            setCustomAmount(String(plan.price));
                          }}
                          className={`px-3 py-2 border-b border-[#E5E7EA] ${
                            selectedPlan === plan.id ? "bg-[#1B8A52]" : "bg-transparent"
                          }`}
                        >
                          <Text
                            className={`text-[14px] ${
                              selectedPlan === plan.id ? "text-white" : "text-[#131927]"
                            }`}
                          >
                            {plan.label} — ₦{plan.price}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Custom Amount Input */}
                <View>
                  <Text className="text-[12px] font-medium text-[#131927] mb-1">
                    Enter Custom Amount
                  </Text>
                  <TextInput
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    returnKeyType="done"
                    className="w-full h-[40px] px-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EA] text-[14px] text-[#131927]"
                  />
                </View>
                {/* Proceed Button */}
                <View className="mt-10 mb-5">
              <Button input="Proceed" onPress={() => {}} />
            </View>

              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
    </HomeScreenWrapper>

  );
};

      const styles = StyleSheet.create({
        container: {
          flex: 1,
    padding: 20,
        },
      });
export default Index;
