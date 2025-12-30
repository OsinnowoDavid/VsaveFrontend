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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../../../components/Button';
import ConfirmTransactionModal from '../../../components/ConfirmTransactionModal';
import useProfileStore from '../../../store/useProfileStore';
import useAuthStore from "../../../store/useAuthStore";
import { fundTerminal } from '../../../services/fundTerminal';
import { Ambulance } from 'lucide-react-native';
export default function FundTerminal() {
  const { fetchProfile, profile, clearProfile } = useProfileStore();
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [form, setFormData] = useState({
    amount: '',
    remark: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pin, setPin] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.amount.trim()) {
      Alert.alert('Error', 'Please enter amount');
      return false;
    }
    
    const amountNum = parseFloat(form.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
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
    
    return true;
  };

  const handleFundTerminal = async () => {
    console.log('Fund amount:', form.amount);
    console.log('Fund remart:', form.remark);
    console.log('Pin:', pin);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // Example: await fundTerminalAPI({ ...form, pin });

      
      // Simulate API call
const response = await fundTerminal(form.amount,pin,form.remark)
console.log("terminal", response.data)
      // Reset form
      setFormData({ amount: '', remark: '' });
      setPin("");
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fund terminal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
     const profile =  fetchProfile(token);
     console.log(profile)
    }
    // If you need to clear profile on unmount, return cleanup function
    // return () => clearProfile();
  }, [token]);

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
            <Text className="text-gray-600 mt-2">Secure transaction platform</Text>
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
                  onChangeText={(value) => handleInputChange('amount', value)}
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
              <Text className="text-gray-700 font-medium mb-2 ml-1">Remark</Text>
              <TextInput
                className={`bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg min-h-[100px] ${
                  form.remark ? 'border-green-500' : 'border-gray-200'
                }`}
                value={form.remark}
                onChangeText={(value) => handleInputChange('remark', value)}
                placeholder="Enter transaction remark"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
                editable={!loading}
              />
              <Text className="text-gray-500 text-xs mt-2 ml-1">
                Description of this transaction
              </Text>
            </View>

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

          {/* Modal */}
          <ConfirmTransactionModal
            isVisible={isModalVisible}
            onClose={() => !loading && setIsModalVisible(false)}
            onConfirm={handleFundTerminal}
            title="Confirm Transfer"
            amount={form.amount}
            isLoading={loading}
            pin={pin}
            onPinChange={setPin}
            details={[
              { label: "Amount", value: `₦${parseFloat(form.amount).toLocaleString()}` },
              { label: "Remark", value: form.remark || "N/A" },
              // You could add terminal info from profile here
              // { label: "Terminal ID", value: profile?.terminalId || "N/A" },
            ]}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}