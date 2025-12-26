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
  FlatList,
  ActivityIndicator,
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
  Filter,
  Plus,
  X,
  FileText,
  AlertTriangle,
  History,
} from 'lucide-react-native';
import useProfileStore from '../../../store/useProfileStore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkEligibility, loanApplication } from '../../../services/loan';
import { useRouter } from 'expo-router';
import { getAllLoanRecord } from '../../../services/loan';
import { payLoan } from '../../../services/loan';
import { number } from 'zod';

const LoanScreen = () => {
  const [activeTab, setActiveTab] = useState('eligibility');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState();
  const [loanDuration, setLoanDuration] = useState('14');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [creditScore, setCreditScore] = useState(750);
  const [userInfo, setUserInfo] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loanTitle, setLoanTitle] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [completedLoans, setCompletedLoans] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loanResult, setLoanResult] = useState(null);
  const [modalType, setModalType] = useState('');
  const [openPayLoan, setOpenPayLoan] = useState(false);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const { fetchProfile } = useProfileStore();
  const router = useRouter();

  const userDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Session expired. Please log in with your password.");
      }
      const profileResponse = await fetchProfile(token);
      setUserInfo(profileResponse);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const checkEligibilityData = async () => {
    setIsLoading(true);
    try {
      const response = await checkEligibility();
      
      if (response && response.status === "Success") {
        const apiData = response.data;
        
        const transformedResult = {
          eligible: apiData?.pass || false,
          maxAmount: apiData?.maxAmount || 0,
          interestRate: `${apiData?.interestRate || 0}%`,
          message: response?.message || 'Eligibility check completed',
          rawData: apiData
        };
        
        setEligibilityResult(transformedResult);
        
        setEligibilityData({
          monthlyIncome: userInfo?.data?.profile?.monthlyIncome || 3500,
          employmentStatus: 'employed',
          creditScore: 750,
          existingLoans: 2,
          maxLoanAmount: apiData?.maxAmount || 0,
          eligibleAmount: apiData?.maxAmount || 0,
          interestRateRange: `${apiData?.interestRate || 0}%`,
          apiData: apiData
        });
        
        if (apiData?.maxAmount) {
          const newScore = Math.min(750 + Math.floor(apiData.maxAmount / 1000), 850);
          setCreditScore(newScore);
        }
      } else {
        Alert.alert("Not Eligible", "You might be on a loan plan");
      }
      
    } catch (error) {
      console.error("Error checking eligibility:", error);
      Alert.alert("Error", "Failed to check eligibility. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveLoan = async() => {
    try {
      setLoadingLoans(true);
      const response = await getAllLoanRecord();
      console.log("ALL-LOAN", response);
      
      if (response && response.data && Array.isArray(response.data)) {
        // REMOVED FILTER: Just display all data if available
        console.log("ALL LOANS (NO FILTER):", response.data.length, response.data);
        setActiveLoans(response.data);
        
        // For history tab, still show all data (or you can keep the completed filter)
        setCompletedLoans(response.data);
      } else {
        setActiveLoans([]);
        setCompletedLoans([]);
      }
    } catch (error) {
      console.log("Error fetching loans:", error);
      Alert.alert("Error", "Failed to load loans");
      setActiveLoans([]);
      setCompletedLoans([]);
    } finally {
      setLoadingLoans(false);
    }
  };

  const handleRepayLoan = async()=>{
try {
  const response = await payLoan(loanAmount)

  console.log("REPAY-LOAN", response.data)

} catch (error) {
  console.log(error)
  
}


  }

  const passData = eligibilityData;
  const pass = passData?.apiData?.pass;
  const maxAmount = passData?.apiData?.maxAmount;
  const ratingStatus = passData?.apiData?.ratingStatus;
  const interestRate = passData?.apiData?.interestRate;
  const stage = passData?.apiData?.stage;
  const loanElegibility = {
    stage,
    maxAmount,
    ratingStatus,
    interestRate,
    pass
  };

  const applyForLoan = async () => {
    if (!loanTitle.trim()) {
      Alert.alert('Error', 'Please enter a loan title');
      return;
    }

    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid loan amount');
      return;
    }

    const maxAmount = eligibilityData?.apiData?.maxAmount || 
                     eligibilityResult?.maxAmount || 
                     eligibilityData?.maxLoanAmount || 
                     0;
    
    if (parseFloat(loanAmount) > maxAmount) {
      Alert.alert('Limit Exceeded', `Maximum loan amount is ₦${maxAmount.toLocaleString()}`);
      return;
    }

    setIsLoading(true);

    try {
      const loanResponse = await loanApplication(loanAmount, loanTitle, loanElegibility);

      if (loanResponse) {
        setLoanResult(loanResponse);
        
        if (loanResponse.status === "Success" && loanResponse.data?.status === "approved") {
          setModalType('success');
          getActiveLoan(); // Refresh loans after successful application
        } else {
          setModalType('error');
        }
        
        setShowResultModal(true);
        setShowLoanModal(false);
        setLoanAmount('');
        setLoanTitle('');
        setSelectedLoanType(null);
      }

    } catch (error) {
      console.error("Error applying for loan:", error);
      Alert.alert("Error", error.message || "Failed to apply for loan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick apply loan types
  const quickApplyLoans = [
    { id: '1', amountRange: "₦5,000 - ₦50,000", min: 5000, max: 50000, term: '14', rate: '1.2%', label: 'Short-term Loan' },
    // { id: '2', amountRange: "₦50,000 - ₦500,000", min: 50000, max: 500000, term: '30', rate: '1.2%', label: 'Medium-term Loan' },
  ];

  const handleQuickApply = (loan) => {
    setSelectedLoanType(loan);
    setLoanDuration(loan.term);
    setShowLoanModal(true);
  };

  const calculateDailyIncrease = (amount) => {
    const interestRate = eligibilityData?.apiData?.interestRate || 1.2;
    return (parseFloat(amount || 0) * (interestRate / 100)).toFixed(2);
  };

  const calculateTotalPayable = (amount, days) => {
    const dailyIncrease = calculateDailyIncrease(amount);
    return (parseFloat(amount || 0) + (parseFloat(dailyIncrease) * parseInt(days || 0))).toFixed(2);
  };

  useEffect(() => {
    userDetails();
    getActiveLoan();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([
      checkEligibilityData(),
      getActiveLoan()
    ]).finally(() => {
      setRefreshing(false);
    });
  };

  const closeModal = () => {
    setShowLoanModal(false);
    setLoanAmount('');
    setLoanTitle('');
    setSelectedLoanType(null);
    Keyboard.dismiss();
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setLoanResult(null);
    setModalType('');
  };

  const handleMakeAnotherLoan = () => {
    closeResultModal();
    setShowLoanModal(true);
  };

  const currentEligibilityData = eligibilityData || {
    monthlyIncome: 3500,
    employmentStatus: 'employed',
    creditScore: 750,
    existingLoans: 2,
    maxLoanAmount: 0,
    eligibleAmount: 0,
    interestRateRange: '0%',
    apiData: null
  };

  // Render Active Loan Item
  const renderActiveLoanItem = ({ item }) => {
    const totalAmount = (item.amount || 0) + (item.interest || 0);
    const totalRepaid = item.repayments?.reduce((sum, repayment) => 
      sum + (repayment.amount || 0), 0
    ) || 0;
    const remainingAmount = totalAmount - totalRepaid;
    
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    const getStatusColor = (status) => {
      switch(status) {
        case 'active': return { bg: 'bg-green-100', text: 'text-green-800' };
        case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
        case 'approved': return { bg: 'bg-blue-100', text: 'text-blue-800' };
        case 'processing': return { bg: 'bg-purple-100', text: 'text-purple-800' };
        case 'completed': return { bg: 'bg-gray-100', text: 'text-gray-800' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
      }
    };
    
    const statusColor = getStatusColor(item.status);

    return (
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-lg font-bold text-gray-900">{item.loanTitle}</Text>
            <Text className="text-gray-600 text-sm mt-1">
              Started: {new Date(item.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusColor.bg}`}>
            <Text className={`font-medium ${statusColor.text}`}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </Text>
          </View>
        </View>

        <View className="mt-6 grid grid-cols-2 gap-4">
          <View>
            <Text className="text-gray-500 text-sm">Loan Amount</Text>
            <Text className="text-xl font-bold text-gray-900 mt-1">
              ₦{(item.amount || 0).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Interest ({item.interestPercentage || 0}%)</Text>
            <Text className="text-xl font-bold text-gray-900 mt-1">
              ₦{(item.interest || 0).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Remaining</Text>
            <Text className="text-xl font-bold text-gray-900 mt-1">
              ₦{remainingAmount.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Days Left</Text>
            <Text className={`text-xl font-bold mt-1 ${
              daysRemaining < 0 ? 'text-red-600' : 
              daysRemaining < 7 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {daysRemaining > 0 ? daysRemaining : 'Overdue'}
            </Text>
          </View>
        </View>

        {totalAmount > 0 && (
          <View className="mt-4">
            <Text className="text-gray-500 text-sm mb-1">Repayment Progress</Text>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-green-500 rounded-full"
                style={{ 
                  width: `${totalRepaid > 0 ? Math.min((totalRepaid / totalAmount) * 100, 100) : 0}%` 
                }}
              />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-600 text-xs">
                Paid: ₦{totalRepaid.toLocaleString()}
              </Text>
              <Text className="text-gray-600 text-xs">
                Total: ₦{totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        <View className="mt-6 pt-6 border-t border-gray-100">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-500 text-sm">Due Date</Text>
              <Text className="text-lg font-bold text-gray-900">
                {new Date(item.dueDate).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {daysRemaining > 0 
                  ? `${daysRemaining} days remaining` 
                  : 'Past due date'}
              </Text>
            </View>
            <TouchableOpacity 
              className="bg-green-50 px-4 py-2 rounded-lg" 
              onPress={() => setOpenPayLoan(true)}
            >
              <Text className="text-green-700 font-semibold">Repay Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.remark && (
          <View className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Text className="text-blue-800 text-sm">{item.remark}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render Completed Loan Item for History
  const renderCompletedLoanItem = ({ item }) => {
    const totalAmount = (item.amount || 0) + (item.interest || 0);
    const totalRepaid = item.repayments?.reduce((sum, repayment) => 
      sum + (repayment.amount || 0), 0
    ) || totalAmount;

    return (
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-lg font-bold text-gray-900">{item.loanTitle}</Text>
            <Text className="text-gray-600 text-sm mt-1">
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View className="px-3 py-1 rounded-full bg-green-100">
            <Text className="font-medium text-green-800">
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </Text>
          </View>
        </View>

        <View className="mt-4 grid grid-cols-2 gap-4">
          <View>
            <Text className="text-gray-500 text-sm">Loan Amount</Text>
            <Text className="text-lg font-bold text-gray-900 mt-1">
              ₦{(item.amount || 0).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Interest ({item.interestPercentage || 0}%)</Text>
            <Text className="text-lg font-bold text-gray-900 mt-1">
              ₦{(item.interest || 0).toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Total Repaid</Text>
            <Text className="text-lg font-bold text-gray-900 mt-1">
              ₦{totalRepaid.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Completion Date</Text>
            <Text className="text-lg font-bold text-gray-900 mt-1">
              {item.repaymentCompletedDate 
                ? new Date(item.repaymentCompletedDate).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        </View>

        <View className="mt-4 pt-4 border-t border-gray-100">
          <View className="flex-row items-center">
            <CheckCircle size={16} color="#059669" />
            <Text className="text-green-600 text-sm ml-2">Loan fully settled</Text>
          </View>
          {item.remark && (
            <Text className="text-gray-600 text-sm mt-2">{item.remark}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyActiveLoans = () => (
    <View className="items-center justify-center py-12 px-6">
      <Banknote size={64} color="#D1D5DB" />
      <Text className="text-gray-700 text-lg font-medium mt-4">No Loans Found</Text>
      <Text className="text-gray-500 text-sm mt-2 text-center">
        You don't have any loans at the moment
      </Text>
      <TouchableOpacity
        onPress={() => setShowLoanModal(true)}
        className="mt-6 bg-green-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Apply for New Loan</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyHistory = () => (
    <View className="items-center justify-center py-12 px-6">
      <History size={64} color="#D1D5DB" />
      <Text className="text-gray-700 text-lg font-medium mt-4">No Loan History</Text>
      <Text className="text-gray-500 text-sm mt-2 text-center">
        You haven't completed any loans yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200 mt-5">
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
              Max Loan: ₦{currentEligibilityData.maxLoanAmount.toLocaleString()}
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
               tab === 'active' ? 'All Loans' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'eligibility' ? (
        // Eligibility Check Section
        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
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
                    {userInfo?.data?.profile?.firstName} {userInfo?.data?.profile?.lastName || 'N/A'}
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

                {/* API Eligibility Results */}
                {currentEligibilityData.apiData && (
                  <View className="mt-4 pt-4 border-t border-gray-200">
                    <Text className="text-gray-700 font-semibold mb-3">Eligibility Results</Text>
                    
                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <CheckCircle size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Eligibility Status</Text>
                      </View>
                      <Text className={`font-semibold ${currentEligibilityData.apiData.pass ? 'text-green-600' : 'text-red-600'}`}>
                        {currentEligibilityData.apiData.pass ? 'Eligible' : 'Not Eligible'}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <DollarSign size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Max Loan Amount</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        ₦{currentEligibilityData.apiData.maxAmount?.toLocaleString() || 0}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <TrendingUp size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Interest Rate</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        {currentEligibilityData.apiData.interestRate}%
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <Banknote size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Rating Status</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        {currentEligibilityData.apiData.ratingStatus || 'No rating'}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between py-3">
                      <View className="flex-row items-center">
                        <Clock size={20} color="#6B7280" />
                        <Text className="text-gray-700 ml-3">Stage</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        Stage {currentEligibilityData.apiData.stage}
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
                          ₦{eligibilityResult.maxAmount?.toLocaleString()}
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
              {quickApplyLoans.map((loan) => (
                <TouchableOpacity
                  key={loan.id}
                  onPress={() => handleQuickApply(loan)}
                  className="bg-white rounded-xl p-5 mr-4 w-72 shadow-sm border border-gray-100"
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-lg font-bold text-gray-900">{loan.label}</Text>
                      <Text className="text-2xl font-bold text-gray-900 mt-1">{loan.amountRange}</Text>
                    </View>
                    <ArrowRight size={20} color="#6B7280" />
                  </View>
                  <View className="flex-row justify-between mt-4">
                    <View>
                      <Text className="text-gray-500 text-sm">Term</Text>
                      <Text className="text-gray-900 font-medium">{loan.term} days</Text>
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm">Daily Rate</Text>
                      <Text className="text-gray-900 font-medium">{loan.rate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : activeTab === 'active' ? (
        // All Loans Section with FlatList (NO FILTER)
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                All Loans ({activeLoans.length})
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Filter size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-2">Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Loading State */}
          {loadingLoans ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="text-gray-600 mt-4">Loading loans...</Text>
            </View>
          ) : (
            <FlatList
              data={activeLoans}
              keyExtractor={(item) => item._id}
              renderItem={renderActiveLoanItem}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 24,
              }}
              ListEmptyComponent={renderEmptyActiveLoans}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={['#059669']}
                  tintColor="#059669"
                />
              }
              ListFooterComponent={
                activeLoans.length > 0 ? (
                  <View className="py-4">
                    <Text className="text-center text-gray-500">
                      {activeLoans.length} loan{activeLoans.length !== 1 ? 's' : ''} found
                    </Text>
                  </View>
                ) : null
              }
            />
          )}

          {/* Apply for New Loan Button */}
          <TouchableOpacity
            onPress={() => setShowLoanModal(true)}
            className="mx-6 my-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center"
          >
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
              <Plus size={24} color="#059669" />
            </View>
            <Text className="text-green-600 font-semibold text-lg mt-3">
              Apply for New Loan
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Get instant approval with competitive rates
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // History Tab with All Loans (NO FILTER)
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Loan History ({completedLoans.length})
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Filter size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-2">Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Loading State */}
          {loadingLoans ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="text-gray-600 mt-4">Loading history...</Text>
            </View>
          ) : (
            <FlatList
              data={completedLoans}
              keyExtractor={(item) => item._id}
              renderItem={renderCompletedLoanItem}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 24,
              }}
              ListEmptyComponent={renderEmptyHistory}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={['#059669']}
                  tintColor="#059669"
                />
              }
              ListFooterComponent={
                completedLoans.length > 0 ? (
                  <View className="py-4">
                    <Text className="text-center text-gray-500">
                      {completedLoans.length} loan{completedLoans.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
        </View>
      )}

      {/* Result Modal (Success/Error) */}
      <Modal
        visible={showResultModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeResultModal}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-5">
          <View className="bg-white rounded-2xl w-full max-w-md">
            {/* Header with Close Button */}
            <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full ${modalType === 'success' ? 'bg-green-100' : 'bg-red-100'} items-center justify-center mr-3`}>
                  {modalType === 'success' ? (
                    <CheckCircle size={24} color="#10B981" />
                  ) : (
                    <AlertTriangle size={24} color="#DC2626" />
                  )}
                </View>
                <Text className={`text-xl font-bold ${modalType === 'success' ? 'text-gray-900' : 'text-red-900'}`}>
                  {modalType === 'success' ? 'Loan Approved!' : 'Application Failed'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={closeResultModal}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="p-5">
              {/* Message */}
              <View className="items-center mb-6">
                <View className={`w-20 h-20 rounded-full ${modalType === 'success' ? 'bg-green-50' : 'bg-red-50'} items-center justify-center mb-4`}>
                  {modalType === 'success' ? (
                    <CheckCircle size={40} color="#10B981" />
                  ) : (
                    <AlertTriangle size={40} color="#DC2626" />
                  )}
                </View>
                <Text className={`text-lg font-semibold ${modalType === 'success' ? 'text-gray-900' : 'text-red-900'} text-center mb-2`}>
                  {modalType === 'success' ? 'Loan Application Successful' : 'Loan Application Failed'}
                </Text>
                <Text className="text-gray-600 text-center">
                  {loanResult?.message || (modalType === 'success' ? 'Your loan has been approved and disbursed' : 'Unable to process your loan application')}
                </Text>
              </View>

              {/* Loan Details */}
              {loanResult?.data && (
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">Loan Details</Text>
                  
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Banknote size={16} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">Loan Amount</Text>
                      <Text className="text-lg font-bold text-gray-900">
                        ₦{loanResult.data.amount?.toLocaleString() || "0"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-3">
                      <FileText size={16} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">Loan Title</Text>
                      <Text className="text-base font-semibold text-gray-900">
                        {loanResult.data.loanTitle || "N/A"}
                      </Text>
                    </View>
                  </View>

                  {loanResult.data.interest !== undefined && (
                    <View className="flex-row items-center mb-3">
                      <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                        <TrendingUp size={16} color="#10B981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500">Interest</Text>
                        <Text className="text-base font-medium text-gray-900">
                          ₦{loanResult.data.interest?.toLocaleString() || "0"}
                        </Text>
                      </View>
                    </View>
                  )}

                  {loanResult.data.dueDate && (
                    <View className="flex-row items-center mb-3">
                      <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                        <Calendar size={16} color="#F59E0B" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500">Due Date</Text>
                        <Text className="text-base font-medium text-gray-900">
                          {new Date(loanResult.data.dueDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {loanResult.data.status && (
                    <View className="flex-row items-center">
                      <View className={`w-8 h-8 rounded-full ${loanResult.data.status === 'approved' ? 'bg-green-100' : 'bg-red-100'} items-center justify-center mr-3`}>
                        {loanResult.data.status === 'completed' ? (
                          <CheckCircle size={16} color="#10B981" />
                        ) : (
                          <AlertCircle size={16} color="#DC2626" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500">Status</Text>
                        <Text className={`text-sm font-medium ${loanResult.data.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                          {loanResult.data.status?.charAt(0).toUpperCase() + loanResult.data.status?.slice(1) || "N/A"}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Info Box */}
              <View className={`${modalType === 'success' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'} rounded-lg p-3 mb-6`}>
                <Text className={`${modalType === 'success' ? 'text-green-800' : 'text-red-800'} text-sm text-center`}>
                  {modalType === 'success' 
                    ? '✓ The loan has been disbursed to your account. Please ensure timely repayment to maintain your credit score.'
                    : '✗ Unable to process your loan application. Please check your eligibility and try again.'
                  }
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                {modalType === 'success' ? (
                  <>
                    <TouchableOpacity
                      onPress={handleMakeAnotherLoan}
                      className="flex-1 py-3 rounded-lg border border-green-700 items-center justify-center"
                    >
                      <Text className="text-green-700 font-semibold">Make Another</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        closeResultModal();
                        router.replace("/home");
                      }}
                      className="flex-1 py-3 rounded-lg bg-green-700 items-center justify-center"
                    >
                      <Text className="text-white font-semibold">Go Home</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={closeResultModal}
                      className="flex-1 py-3 rounded-lg border border-red-700 items-center justify-center"
                    >
                      <Text className="text-red-700 font-semibold">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        closeResultModal();
                        router.replace("/home");
                      }}
                      className="flex-1 py-3 rounded-lg bg-red-700 items-center justify-center"
                    >
                      <Text className="text-white font-semibold">Go Home</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Apply for Loan Modal */}
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
                        <X size={24} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text className="text-2xl font-bold text-gray-900">Apply for Loan</Text>
                    <Text className="text-gray-600 mt-2">Enter loan details to see your terms</Text>

                    <View className="mt-8 space-y-6">
                      {/* Loan Title */}
                      <View>
                        <Text className="text-gray-700 font-medium mb-2">Loan title</Text>
                        <View className='border border-gray-300 rounded-xl px-4 py-3'>
                          <TextInput
                            className="text-lg text-black"
                            placeholder="Enter loan title (e.g., Emergency Funds)"
                            value={loanTitle}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setLoanTitle}
                            returnKeyType="done"
                          />
                        </View>
                      </View>

                      {/* Loan Amount */}
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
                            onPress={() => {
                              const maxAmount = currentEligibilityData.maxLoanAmount;
                              setLoanAmount(maxAmount.toString());
                            }}
                            className="bg-gray-100 px-3 py-1 rounded-lg"
                          >
                            <Text className="text-gray-700">Max</Text>
                          </TouchableOpacity>
                        </View>
                        <Text className="text-gray-500 text-sm mt-2">
                          Available limit: ₦{currentEligibilityData.maxLoanAmount.toLocaleString()}
                        </Text>
                      </View>

                      {/* Loan Duration */}
                      <View>
                        <Text className="text-gray-700 font-medium mb-2">Loan duration</Text>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          className="flex-row"
                        >
                          {quickApplyLoans.map((duration) => (
                            <TouchableOpacity
                              key={duration.id}
                              onPress={() => {
                                setLoanDuration(duration.term);
                                setSelectedLoanType(duration);
                                if (!loanAmount) {
                                  setLoanAmount(duration.min.toString());
                                }
                              }}
                              className={`px-4 py-3 mb-3 rounded-lg mr-2 ${loanDuration === duration.term ? 'bg-green-500' : 'bg-gray-100'}`}
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
                        <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <Text className="text-green-800 font-semibold mb-3">Loan Terms Preview</Text>
                          <View className="space-y-3">
                            <View className="flex-row justify-between">
                              <Text className="text-gray-700">Daily Increase</Text>
                              <Text className="text-lg font-bold text-green-800">
                                ₦{calculateDailyIncrease(loanAmount)} daily
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-gray-700">Total Payable ({loanDuration} days)</Text>
                              <Text className="text-lg font-bold text-gray-900">
                                ₦{calculateTotalPayable(loanAmount, loanDuration)}
                              </Text>
                            </View>
                            <View className="flex-row justify-between">
                              <Text className="text-gray-700">Interest Rate</Text>
                              <Text className="font-semibold">
                                {currentEligibilityData.interestRateRange}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Apply Button */}
                      <TouchableOpacity
                        onPress={applyForLoan}
                        disabled={isLoading || !loanAmount || !loanTitle.trim()}
                        className={`rounded-xl py-4 items-center ${isLoading || !loanAmount || !loanTitle.trim() ? 'bg-green-200' : 'bg-green-600'}`}
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
                        <Text className="text-red-600 font-medium">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Pay Loan Modal */}
      <Modal
        visible={openPayLoan}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpenPayLoan(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpenPayLoan(false)}>
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
                        onPress={() => setOpenPayLoan(false)}
                        className="p-2"
                      >
                        <X size={24} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text className="text-2xl font-bold text-gray-900">Pay Loan</Text>
                    <Text className="text-gray-600 mt-2">Repay your loan before due date to increase your credit score</Text>

                    <View className="mt-8 space-y-6">
                      {/* Loan Amount */}
                      <View>
                        <Text className="text-gray-700 font-medium mb-5">Enter amount to repay</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 mb-10">
                          <Text className="text-gray-500">₦</Text>
                          <TextInput
                            className="flex-1 ml-2 text-lg"
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={loanAmount}
                            onChangeText={setLoanAmount}
                            returnKeyType="done"
                          />
                        </View>
                      </View>

                      {/* Pay Button */}
                      <TouchableOpacity
                        onPress={() => {
                          handleRepayLoan()
                        }}
                        disabled={!loanAmount}
                        className={`rounded-xl py-4 items-center ${!loanAmount ? 'bg-green-200' : 'bg-green-600'}`}
                      >
                        <Text className="text-white font-semibold text-lg">Pay Now</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setOpenPayLoan(false)}
                        className="items-center py-3"
                      >
                        <Text className="text-red-600 font-medium">Cancel</Text>
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