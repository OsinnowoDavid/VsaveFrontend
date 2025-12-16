// screens/LoanScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Banknote,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
  ShieldCheck,
  ChevronRight,
  Filter,
  Plus,
  X,
} from 'lucide-react-native';
import useProfileStore from '../../../store/useProfileStore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkEligibility } from '../../../services/loan';

const LoanScreen = () => {
  const [activeTab, setActiveTab] = useState('eligibility');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('12');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [creditScore, setCreditScore] = useState(750);
  const [userInfo, setUserInfo] = useState([]);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loanTitle, setLoanTitle] = useState("")

  const { fetchProfile } = useProfileStore();

  const userDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Session expired. Please log in with your password.");
      }
      const profileResponse = await fetchProfile(token);
      setUserInfo(profileResponse);
      console.log("Profile Response:", profileResponse);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const checkEligibilityData = async () => {
    setIsLoading(true);
    try {
      const response = await checkEligibility();
      console.log("ELE Response:", response);
      
      // Check if response has data property
      if (response && response.data) {
        // Set the actual eligibility data from the nested structure
        const eligibilityData = response.data.data; // This is where your actual data is
        const message = response.data.message;
        
        console.log("Processed Eligibility Data:", eligibilityData);
        
        // Transform to match UI expectations
        const transformedResult = {
          eligible: eligibilityData?.pass || false,
          maxAmount: eligibilityData?.maxAmount || 0,
          interestRate: `${eligibilityData?.interestRate || 0}%`,
          message: message || 'Eligibility check completed',
          rawData: eligibilityData
        };
        
        setEligibilityResult(transformedResult);
        
        // Update eligibilityData state
        setEligibilityData({
          monthlyIncome: 3500, // This should come from user profile
          employmentStatus: 'employed',
          creditScore: 750,
          existingLoans: 2,
          maxLoanAmount: eligibilityData?.maxAmount || 0,
          eligibleAmount: eligibilityData?.maxAmount || 0,
          interestRateRange: `${eligibilityData?.interestRate || 0}%`,
          apiData: eligibilityData // Store the raw API data
        });
        
        // Also update credit score banner with actual data
        if (eligibilityData?.maxAmount) {
          // You might want to calculate credit score based on eligibility
          setCreditScore(750); // Keep default or calculate based on eligibility
        }
      } else {
        console.warn("No data in response:", response);
        Alert.alert("Info", "No eligibility data received from server.");
      }
      
    } catch (error) {
      console.error("Error checking eligibility:", error);
      Alert.alert("Error", "Failed to check eligibility. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  // Mock data for active loans
  const [activeLoans, setActiveLoans] = useState([
    {
      id: '1',
      loanName: 'Personal Loan',
      amount: 5000,
      interestRate: 8.5,
      remainingAmount: 3200,
      nextPaymentDate: '2024-12-15',
      nextPaymentAmount: 450,
      status: 'active',
      disbursedDate: '2024-06-15',
      term: '12 months',
    },
    {
      id: '2',
      loanName: 'Education Loan',
      amount: 15000,
      interestRate: 6.5,
      remainingAmount: 9800,
      nextPaymentDate: '2024-12-20',
      nextPaymentAmount: 650,
      status: 'active',
      disbursedDate: '2024-03-20',
      term: '24 months',
    },
  ]);

  const applyForLoan = () => {
    console.log("LOAN",loanTitle, loanAmount)
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid loan amount');
      return;
    }

    // Get max amount from eligibility data
    const maxAmount = eligibilityData?.apiData?.maxAmount || 
                     eligibilityResult?.maxAmount || 
                     eligibilityData?.maxLoanAmount || 
                     0;
    
    if (parseFloat(loanAmount) > maxAmount) {
      Alert.alert('Limit Exceeded', `Maximum loan amount is $${maxAmount.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    
    // Simulate loan application
    setTimeout(() => {
      // Use actual interest rate from API if available
      const interestRate = eligibilityData?.apiData?.interestRate || 1.2;
      
      const newLoan = {
        id: Date.now().toString(),
        loanName: 'Quick Loan',
        amount: parseFloat(loanAmount),
        interestRate: interestRate,
        remainingAmount: parseFloat(loanAmount),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextPaymentAmount: (parseFloat(loanAmount) * (1 + interestRate/100) / parseInt(loanDuration)).toFixed(2),
        status: 'pending',
        disbursedDate: new Date().toISOString().split('T')[0],
        term: `${loanDuration} months`,
      };

      setActiveLoans([...activeLoans, newLoan]);
      setShowLoanModal(false);
      setLoanAmount('');
      setIsLoading(false);
      
      Alert.alert(
        'Success!',
        'Your loan application has been submitted and is under review.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkEligibilityData().finally(() => {
      setRefreshing(false);
    });
  };

  const calculateEMI = (amount, rate, months) => {
    const monthlyRate = rate / 12 / 100;
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return emi.toFixed(2);
  };

  // Function to close modal
  const closeModal = () => {
    setShowLoanModal(false);
    setLoanAmount('');
    Keyboard.dismiss();
  };

  // Initialize with defaults if null
  const currentEligibilityData = eligibilityData || {
    monthlyIncome: 3500,
    employmentStatus: 'employed',
    creditScore: 750,
    existingLoans: 2,
    maxLoanAmount: 0,
    eligibleAmount: 0,
    interestRateRange: '0%',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">Loan Services</Text>
        <Text className="text-gray-600 mt-1">Manage your loans and check eligibility</Text>
      </View>

      {/* Credit Score Banner */}
      <View className="mx-6 mt-4 bg-green-600 rounded-2xl p-5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-sm font-medium">Credit Score</Text>
            <Text className="text-white text-3xl font-bold mt-1">{creditScore}</Text>
            <Text className="text-blue-100 text-sm mt-1">Good • Updated today</Text>
          </View>
          <View className="items-end">
            <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
              <TrendingUp size={16} color="white" />
              <Text className="text-white ml-2 font-medium">+15 this month</Text>
            </View>
            <Text className="text-white text-sm mt-3">
              Max Loan: ${currentEligibilityData.maxLoanAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-6 mt-6 border-b border-gray-200">
        {['eligibility', 'active', 'history'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 pb-3 ${activeTab === tab ? 'border-b-2 border-green-600' : ''}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === tab ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              {tab === 'eligibility' ? 'Eligibility' : 
               tab === 'active' ? 'Active Loans' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'eligibility' ? (
          // Eligibility Check Section
          <View className="px-6 py-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center">
                <ShieldCheck size={24} color="#4F46E5" />
                <Text className="text-xl font-bold text-gray-900 ml-3">
                  Check Eligibility
                </Text>
              </View>
              
              <Text className="text-gray-600 mt-4">
                See how much you can borrow and at what rates
              </Text>

              {/* Eligibility Criteria */}
              <View className="mt-6 space-y-4">
                {/* Profile Information */}
                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Users size={20} color="#6B7280" />
                    <Text className="text-gray-700 ml-3">Full Name</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">
                    {userInfo?.data?.profile?.firstName} {userInfo?.data?.profile?.lastName}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Banknote size={20} color="#6B7280" />
                    <Text className="text-gray-700 ml-3">Profession</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">
                    {userInfo?.data?.kyc?.profession || 'Not specified'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <ShieldCheck size={20} color="#6B7280" />
                    <Text className="text-gray-700 ml-3">KYC Status</Text>
                  </View>
                  <Text className={`font-semibold ${userInfo?.data?.profile?.kycStatus ? 'text-green-600' : 'text-red-600'}`}>
                    {userInfo?.data?.profile?.kycStatus ? 'Verified' : 'Not Verified'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Calendar size={20} color="#6B7280" />
                    <Text className="text-gray-700 ml-3">Membership Date</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">
                    {userInfo?.data?.profile?.createdAt 
                      ? new Date(userInfo.data.profile.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </View>

                {/* API Eligibility Results - Show when we have data */}
                {eligibilityData?.apiData && (
                  <View className="mt-4 pt-4 border-t border-gray-200">
                    <Text className="text-gray-700 font-semibold mb-3">Eligibility Results</Text>
                    
                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <CheckCircle size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Eligibility Status</Text>
                      </View>
                      <Text className={`font-semibold ${eligibilityData.apiData.pass ? 'text-green-600' : 'text-red-600'}`}>
                        {eligibilityData.apiData.pass ? 'Eligible' : 'Not Eligible'}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <DollarSign size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Max Loan Amount</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        ${eligibilityData.apiData.maxAmount?.toLocaleString() || 0}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <TrendingUp size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Interest Rate</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        {eligibilityData.apiData.interestRate}%
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <Banknote size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Rating Status</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        {eligibilityData.apiData.ratingStatus || 'No rating'}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3">
                      <View className="flex-row items-center">
                        <Clock size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Stage</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        Stage {eligibilityData.apiData.stage}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Eligibility Result Card */}
              {eligibilityResult && (
                <View className={`mt-6 p-4 rounded-xl ${eligibilityResult.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <View className="flex-row items-center">
                    {eligibilityResult.eligible ? (
                      <CheckCircle size={24} color="#059669" />
                    ) : (
                      <AlertCircle size={24} color="#DC2626" />
                    )}
                    <Text className={`ml-2 font-bold ${eligibilityResult.eligible ? 'text-green-800' : 'text-red-800'}`}>
                      {eligibilityResult.message}
                    </Text>
                  </View>
                  
                  {eligibilityResult.eligible && (
                    <View className="mt-4">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Maximum Amount</Text>
                        <Text className="font-bold text-gray-900">
                          ${eligibilityResult.maxAmount?.toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Interest Rate</Text>
                        <Text className="font-bold text-gray-900">{eligibilityResult.interestRate}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                onPress={checkEligibilityData}
                disabled={isLoading}
                className={`mt-6 bg-green-600 rounded-xl py-4 items-center ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? (
                  <Text className="text-white font-semibold">Checking...</Text>
                ) : (
                  <Text className="text-white font-semibold text-lg">Check Eligibility</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Quick Apply Cards */}
            <Text className="text-xl font-bold text-gray-900 mt-8 mb-4">
              Quick Apply
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {[
                { amount: "5000 - ₦50,000 ", term: '14 days', rate: '1.2%',  },
                { amount: "50,000 - ₦500,00", term: '30 days', rate: '1.2%', },
              ].map((loan, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setShowLoanModal(true);
                  }}
                  className="bg-white rounded-xl p-5 mr-4 w-72 shadow-sm border border-gray-100"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900">₦{loan.amount}</Text>
                    <ArrowRight size={20} color="#6B7280" />
                  </View>
                  <View className="flex-row justify-between mt-4">
                    <View>
                      <Text className="text-gray-500 text-sm">Term</Text>
                      <Text className="text-gray-900 font-medium">{loan.term}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm">Rate</Text>
                      <Text className="text-gray-900 font-medium">{loan.rate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : activeTab === 'active' ? (
          // Active Loans Section
          <View className="px-6 py-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Active Loans ({activeLoans.length})
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Filter size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-2">Filter</Text>
              </TouchableOpacity>
            </View>

            {activeLoans.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Banknote size={64} color="#D1D5DB" />
                <Text className="text-gray-500 text-lg mt-4">No active loans</Text>
              </View>
            ) : (
              activeLoans.map((loan) => (
                <View key={loan.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-lg font-bold text-gray-900">{loan.loanName}</Text>
                      <Text className="text-gray-600 text-sm mt-1">Disbursed on {loan.disbursedDate}</Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${loan.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <Text className={`font-medium ${loan.status === 'active' ? 'text-green-800' : 'text-yellow-800'}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-6 grid grid-cols-2 gap-4">
                    <View>
                      <Text className="text-gray-500 text-sm">Loan Amount</Text>
                      <Text className="text-xl font-bold text-gray-900 mt-1">${loan.amount}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm">Interest Rate</Text>
                      <Text className="text-xl font-bold text-gray-900 mt-1">{loan.interestRate}%</Text>
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm">Remaining</Text>
                      <Text className="text-xl font-bold text-gray-900 mt-1">${loan.remainingAmount}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm">Term</Text>
                      <Text className="text-xl font-bold text-gray-900 mt-1">{loan.term}</Text>
                    </View>
                  </View>

                  <View className="mt-6 pt-6 border-t border-gray-100">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-gray-500 text-sm">Next Payment</Text>
                        <Text className="text-lg font-bold text-gray-900">${loan.nextPaymentAmount}</Text>
                        <Text className="text-gray-600 text-sm mt-1">Due {loan.nextPaymentDate}</Text>
                      </View>
                      <TouchableOpacity className="bg-indigo-50 px-4 py-2 rounded-lg">
                        <Text className="text-indigo-700 font-semibold">Pay Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={() => setShowLoanModal(true)}
              className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center mt-4"
            >
              <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
                <Plus size={24} color="#4F46E5" />
              </View>
              <Text className="text-indigo-600 font-semibold text-lg mt-3">
                Apply for New Loan
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Get instant approval with competitive rates
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // History Tab
          <View className="px-6 py-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Loan History</Text>
            <View className="items-center justify-center py-12">
              <Clock size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg mt-4">No loan history yet</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Apply for Loan Modal - FIXED VERSION */}
      <Modal
        visible={showLoanModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="max-h-[90%]"
              >
                <ScrollView 
                  className="bg-white rounded-t-3xl"
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View className="pt-6 px-6 pb-8">
                    {/* Header with close button */}
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="w-12 h-1 bg-gray-300 rounded-full" />
                      <TouchableOpacity 
                        onPress={closeModal}
                        className="p-2"
                      >
                        <X size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text className="text-2xl font-bold text-gray-900">Apply for Loan</Text>
                    <Text className="text-gray-600 mt-2">Enter loan details to see your EMI</Text>

                    <View className="mt-8 ">
                        <Text className="text-gray-700 font-medium mb-2">Loan title</Text>

                        <View className=' border border-gray-300 rounded-xl px-4 py-3 mb-3  mt-2'>
                          <TextInput
                            className="flex-1 ml-2 text-lg text-black"
                            placeholder="Enter loan title"
                            keyboardType="default"
                            value={loanTitle}
                            placeholderTextColor="black"
                            onChangeText={setLoanTitle}
                            returnKeyType="done"
                          />
                        </View>
                      <View>
                        
                        <Text className="text-gray-700 font-medium mb-2">Loan amount</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
                          <Text className="text-gray-500">₦</Text>
                          <TextInput
                            className="flex-1 ml-2 text-lg"
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={loanAmount}
                            onChangeText={setLoanAmount}
                            returnKeyType="done"
                          />
                          <TouchableOpacity 
                            onPress={() => setLoanAmount(currentEligibilityData.maxLoanAmount.toString())}
                            className="bg-gray-100 px-3 py-1 rounded-lg"
                          >
                            <Text className="text-gray-700">Max</Text>
                          </TouchableOpacity>
                        </View>
                      

                        <Text className="text-gray-500 text-sm mt-2">
                          Available limit: ₦{currentEligibilityData.maxLoanAmount.toLocaleString()}
                        </Text>
                      </View>

                      <View>
                        <Text className="text-gray-700 font-medium mb-2">Loan duration</Text>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          className="flex-row"
                        >
                          {[
                { amount: "5000 - ₦50,000 ", term: '14 days', rate: '1.2%',  },
                { amount: "50,000 - ₦500,00", term: '30 days', rate: '1.2%', },
              ].map((duration, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => setLoanDuration(duration.term)}
                              className={`px-4 py-3 rounded-lg mr-2 ${loanDuration === duration.term ? 'bg-green-500 border border-indigo-300' : 'bg-gray-100'}`}
                            >
                              <Text className={`font-medium ${loanDuration === duration.term ? 'text-white' : 'text-gray-700'}`}>
                                {duration.term} days
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      {/* EMI Calculation Preview */}
                      {loanAmount && parseFloat(loanAmount) > 0 && (
                        <View className="bg-green-200 mt-2 mb-2 rounded-xl p-4">
                          <Text className="text-red-800 font-semibold mb-3">Loan default</Text>
                          <View className="flex-row justify-between">
                            <View>
                              <Text className="text-red-800 text-lg">Loan increase</Text>
                              <Text className="text-2xl font-bold text-red-800">
                                ₦100 daily
                                {/* {calculateEMI(parseFloat(loanAmount), 1.2, parseInt(loanDuration))} */}
                              </Text>
                            </View>
                            <View>
                              <Text className=" text-lg">Total Payable</Text>
                              <Text className="text-2xl font-bold ">
                                ₦{(parseFloat(loanAmount) * 1.2).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                          <Text className=" text-sm mt-3">
                            Interest Rate: 1.2% • Processing Fee: 1%
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={applyForLoan}
                        disabled={isLoading || !loanAmount}
                        className={`rounded-xl py-4 items-center ${isLoading || !loanAmount ? 'bg-green-200 mt-2' : 'bg-green-600'}`}
                      >
                        {isLoading ? (
                          <Text className="text-white font-semibold">Processing...</Text>
                        ) : (
                          <Text className="text-white font-semibold text-lg">Apply Now</Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={closeModal}
                        className="items-center py-3"
                      >
                        <Text className="text-red-600">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default LoanScreen;