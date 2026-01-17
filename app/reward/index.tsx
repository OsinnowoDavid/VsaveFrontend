import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState , useEffect} from 'react'
import HomeScreenWrapper from '../../components/HomeScreenWrapper'
import * as Clipboard from 'expo-clipboard'
import { CheckCircle, Copy, Gift, Users, Calendar, Wallet } from 'lucide-react-native'
import { getReward } from '../../services/profileService'
import useProfileStore from '../../store/useProfileStore'

const RewardAndReferralScreen = () => {
  const { profile } = useProfileStore();
  const [copied, setCopied] = useState(false)
  const [rewardData, setRewardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRewardData()
  }, [])
const handleCopyReferralCode = async () => {
  const referralCode = rewardData?.referralCode || profile?.profile?.referralCode;
  
  if (!referralCode || referralCode === 'N/A') {
    Alert.alert('Error', 'Referral code not available');
    return;
  }
  
  await Clipboard.setStringAsync(referralCode);
  setCopied(true);
  Alert.alert('Copied!', 'Referral code copied to clipboard');
  
  setTimeout(() => {
    setCopied(false);
  }, 2000);
}
 const fetchRewardData = async () => {
  try {
    setLoading(true);
    setError(null);
    const id = profile?.profile?._id;
    
    if (!id) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    console.log("Fetching reward data for ID:", id);
    const response = await getReward(id); // Now gets only data part
    
    console.log("API Response:", response.data);
    
    // Check if we have a successful response
    if (response?.status === "Success") {
      if (response.data) {
        // User has a referral record
        setRewardData({
          ...response.data,
          // Ensure all expected properties exist
          bonusAmount: response.data.bonusAmount || 0,
          referralCode: response.data.referralCode || profile?.profile?.referralCode || 'N/A',
          status: response.data.status || 'pending',
          depositedToAvaliableBalnace: response.data.depositedToAvaliableBalnace || false,
          referredUserTask: response.data.referredUserTask || {
            fundVSaveWallet: false,
            createSavingsPlan: false,
            complete5SuccessfulSavingsCircle: false
          },
          referredUser: response.data.referredUser || null,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt
        });
      } else {
        // User has no referral record yet (data is null or empty)
        setRewardData({
          bonusAmount: 0,
          status: 'pending',
          referralCode: profile?.profile?.referralCode || 'N/A',
          depositedToAvaliableBalnace: false,
          referredUserTask: {
            fundVSaveWallet: false,
            createSavingsPlan: false,
            complete5SuccessfulSavingsCircle: false
          },
          referredUser: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } else {
      // Handle API error response
      setError(response?.message || 'Failed to fetch reward data');
      // Set default data even on API error
      setRewardData({
        bonusAmount: 0,
        status: 'pending',
        referralCode: profile?.profile?.referralCode || 'N/A',
        depositedToAvaliableBalnace: false,
        referredUserTask: {
          fundVSaveWallet: false,
          createSavingsPlan: false,
          complete5SuccessfulSavingsCircle: false
        },
        referredUser: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.log("Error fetching reward:", error);
    setError(error.message || 'Failed to fetch reward data');
    // Set default data on error
    setRewardData({
      bonusAmount: 0,
      status: 'pending',
      referralCode: profile?.profile?.referralCode || 'N/A',
      depositedToAvaliableBalnace: false,
      referredUserTask: {
        fundVSaveWallet: false,
        createSavingsPlan: false,
        complete5SuccessfulSavingsCircle: false
      },
      referredUser: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } finally {
    setLoading(false);
  }
} 
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }
  
  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  // Handle loading state
  if (loading) {
    return (
      <HomeScreenWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-4 text-gray-600">Loading reward data...</Text>
        </View>
      </HomeScreenWrapper>
    )
  }

  // Handle error state
  if (error) {
    return (
      <HomeScreenWrapper>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-lg mb-4">Error: {error}</Text>
          <TouchableOpacity 
            onPress={fetchRewardData}
            className="bg-green-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </HomeScreenWrapper>
    )
  }

  // Handle no data state
  if (!rewardData) {
    return (
      <HomeScreenWrapper>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-600 text-lg mb-4">No reward data available</Text>
          <TouchableOpacity 
            onPress={fetchRewardData}
            className="bg-green-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Refresh</Text>
          </TouchableOpacity>
        </View>
      </HomeScreenWrapper>
    )
  }

  return (
    <HomeScreenWrapper>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Reward Card */}
        <View className="mx-4 mt-4">
          <View className="bg-green-600 h-48 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between">
              <View className='flex-1'>
                <Text className="text-sm font-medium text-white">Total Bonus Earned</Text>
                <Text className="text-4xl font-bold mt-2 text-white">
                  ₦{(rewardData.bonusAmount || 0).toLocaleString()}
                </Text>
                <Text className="text-white text-sm mt-2">
                  Status: <Text className="font-semibold">{getStatusText(rewardData.status)}</Text>
                </Text>
              </View>
              <Gift size={60} color="white" />
            </View>
            
            <View className="mt-6 flex-row items-center">
              <View className={`w-3 h-3 rounded-full ${getStatusColor(rewardData.status)} mr-2`} />
              <Text className="text-sm text-white">
                {rewardData.depositedToAvaliableBalnace 
                  ? 'Bonus deposited to available balance' 
                  : 'Bonus pending deposit'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Referral Section */}
        <View className="mx-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Your Referral Code</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-gray-500 text-sm">Share this code with friends</Text>
                <Text className="text-2xl font-bold text-gray-800 mt-1">
                  {rewardData.referralCode || 'N/A'}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={handleCopyReferralCode}
                className={`flex-row items-center px-4 py-3 rounded-lg ${copied ? 'bg-green-100' : 'bg-gray-100'}`}
                disabled={!rewardData.referralCode}
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} color="#10b981" />
                    <Text className="text-green-600 font-medium ml-2">Copied</Text>
                  </>
                ) : (
                  <>
                    <Copy size={18} color="#6b7280" />
                    <Text className="text-gray-600 font-medium ml-2">Copy</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-500 text-sm mt-4">
              Both you and your friend get ₦{(rewardData.bonusAmount || 0)} bonus when they complete all tasks
            </Text>
          </View>
        </View>

        {/* Tasks Completion Section */}
        <View className="mx-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Tasks for Bonus</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-gray-600 mb-4">Your referred friend needs to complete these tasks:</Text>
            
            {/* Task 1 - Fund VSave Wallet */}
            <View className="flex-row items-center mb-4">
              <View className={`w-8 h-8 rounded-full ${rewardData.referredUserTask?.fundVSaveWallet ? 'bg-green-100' : 'bg-gray-100'} items-center justify-center mr-3`}>
                {rewardData.referredUserTask?.fundVSaveWallet ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : (
                  <Wallet size={20} color="#9ca3af" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Fund VSave Wallet</Text>
                <Text className="text-gray-500 text-sm">Deposit money into VSave wallet</Text>
              </View>
              <Text className={`text-sm font-medium ${rewardData.referredUserTask?.fundVSaveWallet ? 'text-green-600' : 'text-yellow-600'}`}>
                {rewardData.referredUserTask?.fundVSaveWallet ? 'Completed' : 'Pending'}
              </Text>
            </View>
            
            {/* Task 2 - Create Savings Plan */}
            <View className="flex-row items-center mb-4">
              <View className={`w-8 h-8 rounded-full ${rewardData.referredUserTask?.createSavingsPlan ? 'bg-green-100' : 'bg-gray-100'} items-center justify-center mr-3`}>
                <Users size={20} color={rewardData.referredUserTask?.createSavingsPlan ? "#10b981" : "#9ca3af"} />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Create Savings Plan</Text>
                <Text className="text-gray-500 text-sm">Set up a new savings plan</Text>
              </View>
              <Text className={`text-sm font-medium ${rewardData.referredUserTask?.createSavingsPlan ? 'text-green-600' : 'text-yellow-600'}`}>
                {rewardData.referredUserTask?.createSavingsPlan ? 'Completed' : 'Pending'}
              </Text>
            </View>
            
            {/* Task 3 - Complete 5 Savings Circles */}
            <View className="flex-row items-center">
              <View className={`w-8 h-8 rounded-full ${rewardData.referredUserTask?.complete5SuccessfulSavingsCircle ? 'bg-green-100' : 'bg-gray-100'} items-center justify-center mr-3`}>
                <Calendar size={20} color={rewardData.referredUserTask?.complete5SuccessfulSavingsCircle ? "#10b981" : "#9ca3af"} />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Complete 5 Savings Circles</Text>
                <Text className="text-gray-500 text-sm">Finish 5 successful savings cycles</Text>
              </View>
              <Text className={`text-sm font-medium ${rewardData.referredUserTask?.complete5SuccessfulSavingsCircle ? 'text-green-600' : 'text-yellow-600'}`}>
                {rewardData.referredUserTask?.complete5SuccessfulSavingsCircle ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Referral Details */}
        <View className="mx-4 mt-6 mb-10">
          <Text className="text-xl font-bold text-gray-800 mb-4">Referral Details</Text>
          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <View className="mb-3">
              <Text className="text-gray-500 text-sm">Referred User ID</Text>
              <Text className="font-medium text-gray-800">{rewardData.referredUser || 'Not referred yet'}</Text>
            </View>
            <View className="mb-3">
              <Text className="text-gray-500 text-sm">Created Date</Text>
              <Text className="font-medium text-gray-800">{formatDate(rewardData.createdAt)}</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Last Updated</Text>
              <Text className="font-medium text-gray-800">{formatDate(rewardData.updatedAt)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </HomeScreenWrapper>
  )
}

export default RewardAndReferralScreen