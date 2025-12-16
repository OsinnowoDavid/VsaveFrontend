import { router } from "expo-router";
import React, { useState } from "react";
import { 
  Alert, 
  Image, 
  Pressable, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity,
  TouchableOpacity as ButtonAlternative 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../../components/Balance";
// Temporarily comment out Button import to debug
// import Button from "../../../components/Button";
import ConfirmTransactionModal from "../../../components/ConfirmTransactionModal";
import FormField from "../../../components/FormField";
import KeyboardAvoidWrapper from "../../../components/KeyboardAvoidWrapper";
import { networks, quickAmounts } from "../../../constants/networks";
import { buyAirtime } from "../../../services/vending";
import useAuthStore from "../../../store/useAuthStore";
import useProfileStore from "../../../store/useProfileStore";
import { CheckCircle, X, Smartphone, Calendar, Hash } from "lucide-react-native";

// Simple Button component to replace the problematic one
const SimpleButton = ({ 
  input, 
  onPress, 
  variant = "primary",
  disabled = false,
  style 
}) => {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: isOutline ? 1 : 0,
          borderColor: isOutline ? '#10B981' : 'transparent',
          backgroundColor: isPrimary ? '#10B981' : isOutline ? 'transparent' : '#F3F4F6',
        },
        disabled && { opacity: 0.5 },
        style
      ]}
    >
      <Text 
        style={{
          color: isPrimary ? 'white' : isOutline ? '#10B981' : '#374151',
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {input}
      </Text>
    </TouchableOpacity>
  );
};

// Success Overlay Component
const SuccessOverlay = ({ 
  isVisible, 
  onClose, 
  transactionDetails 
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/70 justify-center items-center p-5">
        <View className="bg-white rounded-2xl w-full max-w-md">
          {/* Header with Close Button */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                <CheckCircle size={24} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Purchase Successful!</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-5">
            {/* Success Message */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-4">
                <CheckCircle size={40} color="#10B981" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
                Airtime Sent Successfully
              </Text>
              <Text className="text-gray-600 text-center">
                Your airtime purchase has been processed
              </Text>
            </View>

            {/* Transaction Details */}
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</Text>
              
              {transactionDetails ? (
                <>
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Smartphone size={16} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">Amount</Text>
                      <Text className="text-lg font-bold text-gray-900">
                        ₦{transactionDetails.amount?.toLocaleString() || "0"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-3">
                      <Smartphone size={16} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">To</Text>
                      <Text className="text-base font-semibold text-gray-900">
                        {transactionDetails.reciever || transactionDetails.receiver || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                      <Calendar size={16} color="#F59E0B" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">Date & Time</Text>
                      <Text className="text-base font-medium text-gray-900">
                        {new Date(transactionDetails.createdAt).toLocaleDateString('en-NG', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mr-3">
                      <Hash size={16} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">Reference ID</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {transactionDetails.transactionReference || "N/A"}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text className="text-gray-500 text-center">Loading transaction details...</Text>
              )}
            </View>

            {/* Info Box */}
            <View className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6">
              <Text className="text-green-800 text-sm text-center">
                ✓ The airtime has been credited to the recipient's number.
                It may take a few moments to reflect.
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <SimpleButton
                input="Make Another"
                onPress={onClose}
                variant="outline"
                style={{ flex: 1 }}
              />
              <SimpleButton
                input="Go Home"
                onPress={() => router.replace("/home")}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Index = () => {
    const { profile } = useProfileStore();
    const { token } = useAuthStore();
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [phone, setPhone] = useState(profile?.profile?.phoneNumber ?? "");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pin, setPin] = useState("");
    const [success, setSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);

    const handleProceed = () => {
        if (!selectedNetwork) {
            Alert.alert("Validation Error", "Please select a network.");
            return;
        }
        if (!phone || phone.length < 10) {
            Alert.alert("Validation Error", "Please enter a valid phone number.");
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Validation Error", "Please enter a valid amount.");
            return;
        }
        setIsModalVisible(true);
    };

    const handleConfirmPurchase = async () => {
        if (!token) {
            Alert.alert("Authentication Error", "Please log in and try again.");
            return;
        }
        
        setIsLoading(true);
        try {
            const numericAmount = Number(amount);
            const result = await buyAirtime(phone, pin, numericAmount, `${token}`);
            console.log("AIRTIME RESPONSE:", result);

            if (result.status?.toString().toLowerCase() === "success") {
                setTransactionDetails(result.data);
                setSuccess(true);
            } else {
                throw new Error(result.message || "Airtime purchase failed.");
            }
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message || "An unexpected error occurred."
            );
        } finally {
            setIsLoading(false);
            setIsModalVisible(false);
            setPin("");
        }
    };

    const handleTopupMyNumber = () => {
        if (profile?.profile?.phoneNumber) {
            setPhone(profile.profile.phoneNumber);
            Alert.alert("Phone Number Pre-filled", "Your number has been added.");
        } else {
            Alert.alert("Error", "Your phone number is not available in your profile.");
        }
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
        setAmount("");
        setSelectedNetwork("");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5] w-[95%] mx-auto">
            <KeyboardAvoidWrapper>
                <View className="mt-3 w-full mx-auto bg-transparent flex gap-3">
                    <Balance />
                    <SimpleButton
                        input="Topup my number"
                        onPress={handleTopupMyNumber}
                        variant="outline"
                    />
                </View>

                <View className="bg-white rounded-xl p-4 w-full mt-8 mb-4">
                    {/* Network Logos */}
                    <View className="flex-row justify-between mb-6">
                        {networks.map((net) => (
                            <Pressable
                                key={net.id}
                                onPress={() => setSelectedNetwork(net.id)}
                                className={`w-14 h-14 rounded-lg border-2 p-1 ${
                                    selectedNetwork === net.id
                                        ? "border-green-700"
                                        : "border-transparent"
                                }`}
                            >
                                <Image
                                    source={net.Icon}
                                    className="w-full h-full rounded-md"
                                    resizeMode="contain"
                                />
                            </Pressable>
                        ))}
                    </View>

                    <FormField
                        label="Select Network"
                        type="select"
                        value={selectedNetwork}
                        onChangeText={setSelectedNetwork}
                        options={networks.map((net) => ({
                            label: net.id,
                            value: net.id,
                        }))}
                    />

                    {/* Quick Amount Buttons */}
                    <View className="flex-row flex-wrap justify-between gap-y-3 mb-4">
                        {quickAmounts.map((amt) => (
                            <Pressable
                                key={amt}
                                onPress={() => setAmount(String(amt))}
                                className={`w-[23%] h-10 rounded-md items-center justify-center ${
                                    amount === String(amt)
                                        ? "bg-green-700"
                                        : "bg-gray-100"
                                }`}
                            >
                                <Text
                                    className={`text-xs font-medium ${
                                        amount === String(amt)
                                            ? "text-white"
                                            : "text-green-800"
                                    }`}
                                >
                                    ₦{amt}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <FormField
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                    />

                    <FormField
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                    <View className="mt-6">
                        <SimpleButton 
                            input="Proceed" 
                            onPress={handleProceed} 
                            variant="primary"
                        />
                    </View>
                </View>
            </KeyboardAvoidWrapper>

            {/* Confirmation Modal */}
            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmPurchase}
                title="Confirm Airtime Purchase"
                amount={amount}
                isLoading={isLoading}
                pin={pin}
                onPinChange={setPin}
                details={[
                    {
                        label: "Network",
                        value:
                            networks.find((n) => n.id === selectedNetwork)
                                ?.id || "N/A",
                    },
                    { label: "Phone Number", value: phone },
                ]}
            />

            {/* Success Overlay */}
            <SuccessOverlay
                isVisible={success}
                onClose={handleCloseSuccess}
                transactionDetails={transactionDetails}
            />
        </SafeAreaView>
    );
};

export default Index;