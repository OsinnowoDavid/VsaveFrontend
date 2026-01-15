import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Button from '../../../components/Button';
import ConfirmTransactionModal from '../../../components/ConfirmTransactionModal';
import useProfileStore from '../../../store/useProfileStore';
import useAuthStore from "../../../store/useAuthStore";
import { CheckCircle, X, Smartphone, Calendar, Hash, CreditCard } from "lucide-react-native";
import { fundTerminal } from '../../../services/fundTerminal';
import axios from 'axios'; // If you're using axios

interface TransactionDetails {
    amount?: number;
    receiver?: string;
    phoneNumber?: string;
    createdAt?: string;
    transactionReference?: string;
    planName?: string;
    network?: string;
    dataSize?: string;
    validity?: string;
}

// Success Overlay Component (same as before, just including for completeness)
const SuccessOverlay = ({ 
    isVisible, 
    onClose, 
    transactionDetails 
}: { 
    isVisible: boolean; 
    onClose: () => void; 
    transactionDetails: TransactionDetails | null;
}) => {
    const router = useRouter();
    
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
                            <Text className="text-xl font-bold text-gray-900">Funding Successful!</Text>
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
                                <CreditCard size={40} color="#10B981" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Terminal Funded Successfully
                            </Text>
                            <Text className="text-gray-600 text-center">
                                Your terminal balance has been updated
                            </Text>
                        </View>

                        {/* Transaction Details */}
                        <View className="bg-gray-50 rounded-xl p-4 mb-6">
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</Text>
                            
                            {transactionDetails ? (
                                <>
                                    <View className="flex-row items-center mb-3">
                                        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                                            <CreditCard size={16} color="#3B82F6" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs text-gray-500">Amount</Text>
                                            <Text className="text-lg font-bold text-gray-900">
                                                ₦{transactionDetails.amount?.toLocaleString() || "0"}
                                            </Text>
                                        </View>
                                    </View>

                                    {transactionDetails.createdAt && (
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mr-3">
                                                <Calendar size={16} color="#EC4899" />
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
                                    )}

                                    {transactionDetails.transactionReference && (
                                        <View className="flex-row items-center">
                                            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mr-3">
                                                <Hash size={16} color="#EF4444" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Reference ID</Text>
                                                <Text className="text-sm font-medium text-gray-900">
                                                    {transactionDetails.transactionReference}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <Text className="text-gray-500 text-center">Loading transaction details...</Text>
                            )}
                        </View>

                        {/* Info Box */}
                        <View className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6">
                            <Text className="text-green-800 text-sm text-center">
                                ✓ The terminal has been funded successfully.
                                Your new balance will reflect shortly.
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 py-3 rounded-lg border border-green-700 items-center justify-center"
                            >
                                <Text className="text-green-700 font-semibold">Fund Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.replace("/home")}
                                className="flex-1 py-3 rounded-lg bg-green-700 items-center justify-center"
                            >
                                <Text className="text-white font-semibold">Go Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Response interfaces based on the actual API response
interface TerminalFundResponseData {
    __v: number;
    _id: string;
    amount: number;
    createdAt: string;
    date: string;
    from: string;
    lottoryId: string;
    status: string; // "success"
    transactionReference: string;
    type: string; // "deposit"
    updatedAt: string;
    userId: string;
}

interface TerminalFundResponse {
    status: string; // "Success"
    message: string;
    data: TerminalFundResponseData;
}

// Axios response wrapper
interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
}

export default function FundTerminal() {
  const { fetchProfile, profile, clearProfile } = useProfileStore();
  const { token } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setFormData] = useState({
    amount: '',
    remark: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessOverlayVisible, setIsSuccessOverlayVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.amount.trim()) {
      Alert.alert('Error', 'Please enter amount');
      return false;
    }
    
    const sanitizedAmount = form.amount.replace(/,/g, '');
    const amountNum = parseFloat(sanitizedAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    
    if (amountNum > 1000000) {
      Alert.alert('Error', 'Amount exceeds maximum limit of ₦1,000,000');
      return false;
    }
    
    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter PIN');
      return false;
    }
    
    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return false;
    }
    
    if (!/^\d+$/.test(pin)) {
      Alert.alert('Error', 'PIN must contain only digits');
      return false;
    }
    
    return true;
  };

  const handleFundTerminal = async () => {
    console.log('Fund amount:', form.amount);
    console.log('Fund remark:', form.remark);
    console.log('Pin:', pin);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const sanitizedAmount = form.amount.replace(/,/g, '');
      
      // Call the API
      const response = await fundTerminal(sanitizedAmount, pin, form.remark);
      
      console.log('Fund terminal response:', response);
      
      // Check if response is an Axios response object
      // The actual API response data is in response.data
      const apiResponse: TerminalFundResponse = response.data || response;
      
      console.log('API Response:', apiResponse);
      
      // Check the status from the API response (not the HTTP status)
      // The response shows status: "Success" (with capital S)
      if (apiResponse?.status?.toLowerCase() === "success") {
        // Set transaction details
        setTransactionDetails({
          amount: parseFloat(sanitizedAmount),
          transactionReference: apiResponse.data?.transactionReference,
          createdAt: apiResponse.data?.createdAt || new Date().toISOString(),
        });
        setIsSuccessOverlayVisible(true);
      } else {
        Alert.alert(
          "Error",
          apiResponse?.message || "Transaction failed. Please try again."
        );
        setFormData({ amount: '', remark: '' });
        setPin("");
      }
      
      setIsModalVisible(false);
    } catch (error: any) {
      console.error('Fund terminal error:', error);
      
      // Handle different error formats
      let errorMessage = 'Failed to fund terminal';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const apiError = error.response.data;
        errorMessage = apiError?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      setFormData({ amount: '', remark: '' });
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  // Format amount as user types
  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    
    if (!numericValue) return '';
    
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    return number.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    handleInputChange('amount', formatted);
  };

  useEffect(() => {
    if (token && !profile) {
      fetchProfile(token);
    }
  }, [token, profile]);

  const canSubmit = form.amount.trim() && form.remark.trim();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-green-600 mt-5">Fund Terminal</Text>
            <Text className="text-gray-600 mt-2">Add funds to your terminal wallet</Text>
          </View>

          {/* Card Container */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
            {/* Amount Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2 ml-1">Amount (₦)</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg ${
                    form.amount ? 'border-green-500' : 'border-gray-200'
                  }`}
                  value={form.amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                  maxLength={15}
                  editable={!loading}
                />
                <View className="absolute right-4 top-0 bottom-0 justify-center">
                  <Text className="text-green-600 font-bold">NGN</Text>
                </View>
              </View>
            </View>

            {/* Remark Input */}
            <View className="mb-8">
              <Text className="text-gray-700 font-medium mb-2 ml-1">Remark (Optional)</Text>
              <TextInput
                className={`bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg min-h-[100px] ${
                  form.remark ? 'border-green-500' : 'border-gray-200'
                }`}
                value={form.remark}
                onChangeText={(value) => handleInputChange('remark', value)}
                placeholder="Enter transaction remark (optional)"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
                editable={!loading}
                maxLength={200}
              />
              <Text className="text-gray-500 text-xs mt-2 ml-1">
                Description of this transaction (optional)
              </Text>
            </View>

            {/* Current Balance */}
            {profile?.availableBalance !== undefined && (
              <View className="mb-4 p-3 bg-blue-50 rounded-xl">
                <Text className="text-blue-700 text-sm font-medium">
                  Current Balance: ₦{profile.availableBalance.toLocaleString()}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                input={loading ? "Processing..." : "Continue"}
                onPress={() => setIsModalVisible(true)}
                disabled={!canSubmit || loading}
              />
            </View>
          </View>

          {/* Info Cards */}
          <View className="flex-row space-x-4 mb-6">
            <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Text className="text-green-600 font-bold mb-1">🔒 Secure</Text>
              <Text className="text-gray-600 text-xs">End-to-end encryption</Text>
            </View>
            
            <View className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Text className="text-green-600 font-bold mb-1">⚡ Fast</Text>
              <Text className="text-gray-600 text-xs">Instant processing</Text>
            </View>
          </View>

          {/* Footer Note */}
          <Text className="text-gray-500 text-center text-xs mt-4">
            By proceeding, you agree to our terms and conditions
          </Text>

          {/* Confirmation Modal */}
          <ConfirmTransactionModal
            isVisible={isModalVisible}
            onClose={() => !loading && setIsModalVisible(false)}
            onConfirm={handleFundTerminal}
            title="Confirm Terminal Funding"
            amount={form.amount}
            isLoading={loading}
            pin={pin}
            onPinChange={setPin}
            details={[
              { label: "Amount", value: `₦${parseFloat(form.amount.replace(/,/g, '') || "0").toLocaleString()}` },
              { label: "Remark", value: form.remark || "N/A" },
            ]}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Overlay */}
      <SuccessOverlay
        isVisible={isSuccessOverlayVisible}
        onClose={() => {
          setIsSuccessOverlayVisible(false);
          setFormData({ amount: '', remark: '' });
          setPin("");
        }}
        transactionDetails={transactionDetails}
      />
    </SafeAreaView>
  );
}