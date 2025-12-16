import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../../components/Balance";
import Button from "../../../components/Button";
import ConfirmTransactionModal from "../../../components/ConfirmTransactionModal";
import FormField from "../../../components/FormField";
import KeyboardAvoidWrapper from "../../../components/KeyboardAvoidWrapper";
import { dataPlans } from "../../../constants/networks";
import { verifyPin } from "../../../services/pinService";
import { buyData, getDataPlans } from "../../../services/vending";
import useAuthStore from "../../../store/useAuthStore";
import useProfileStore from "../../../store/useProfileStore";
import { CheckCircle, X, Smartphone, Calendar, Hash, Wifi } from "lucide-react-native";

// Define interface for API data plan
interface ApiDataPlan {
    plan_name: string;
    bundle_value: string;
    bundle_validity: string;
    bundle_description: string;
    bundle_price: string;
    plan_code: string;
    network: string;
}

interface ApiResponse {
    status: string;
    message: string;
    data: ApiDataPlan[];
}

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

// Success Overlay Component
const SuccessOverlay = ({ 
    isVisible, 
    onClose, 
    transactionDetails 
}: { 
    isVisible: boolean; 
    onClose: () => void; 
    transactionDetails: TransactionDetails | null;
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
                                <Wifi size={40} color="#10B981" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Data Bundle Sent Successfully
                            </Text>
                            <Text className="text-gray-600 text-center">
                                Your data bundle has been processed
                            </Text>
                        </View>

                        {/* Transaction Details */}
                        <View className="bg-gray-50 rounded-xl p-4 mb-6">
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</Text>
                            
                            {transactionDetails ? (
                                <>
                                    <View className="flex-row items-center mb-3">
                                        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                                            <Wifi size={16} color="#3B82F6" />
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
                                                {transactionDetails.receiver || transactionDetails.phoneNumber || "N/A"}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Data Bundle Details */}
                                    {transactionDetails.dataSize && (
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                                                <Wifi size={16} color="#6366F1" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Data Bundle</Text>
                                                <Text className="text-base font-medium text-gray-900">
                                                    {transactionDetails.dataSize}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {transactionDetails.validity && (
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                                                <Calendar size={16} color="#F59E0B" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xs text-gray-500">Validity</Text>
                                                <Text className="text-base font-medium text-gray-900">
                                                    {transactionDetails.validity}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    <View className="flex-row items-center mb-3">
                                        <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                                            <Smartphone size={16} color="#10B981" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs text-gray-500">Network</Text>
                                            <Text className="text-base font-medium text-gray-900">
                                                {transactionDetails.network || "N/A"}
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
                                                    {transactionDetails.transactionReference || "N/A"}
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
                                ✓ The data bundle has been credited to the recipient's number.
                                It may take a few moments to reflect.
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 py-3 rounded-lg border border-green-700 items-center justify-center"
                            >
                                <Text className="text-green-700 font-semibold">Make Another</Text>
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

const Index = () => {
    const { profile } = useProfileStore();
    const { token } = useAuthStore();
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [amountData, setAmount] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pin, setPin] = useState("");
    const [fetchedPlans, setFetchedPlans] = useState<ApiDataPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    
    // FIXED: Match backend expected values (MTN, GLO, AIRTEL, 9MOBILE)
    const networks = [
        { id: "MTN", Icon: require("../../../assets/icons/mtn.png") },
        { id: "AIRTEL", Icon: require("../../../assets/icons/airtel.png") },
        { id: "GLO", Icon: require("../../../assets/icons/glo.png") },
        { id: "9MOBILE", Icon: require("../../../assets/icons/etisalat.png") },
    ];

    // Handle plan selection from API data
    const handlePlanChange = (planCode: string) => {
        setSelectedPlan(planCode);
        
        // Find the selected plan and set the amount
        const selected = fetchedPlans.find(plan => plan.plan_code === planCode);
        if (selected) {
            setAmount(selected.bundle_price);
        }
    };

    // Fetch data plans from API
    const getDatacodeDetails = useCallback(async () => {
        if (!token || !selectedNetwork) {
            console.log("Missing token or network");
            return;
        }
        
        setIsLoadingPlans(true);
        try {
            // Get data plans from API
            const response: ApiResponse = await getDataPlans(selectedNetwork, token);
            console.log("API Response data:", response.data);
            
            if (response.status === "Success" && response.data && Array.isArray(response.data)) {
                // Store the fetched plans
                setFetchedPlans(response.data);
                console.log(`Loaded ${response.data.length} data plans for ${selectedNetwork}`);
            } else {
                console.log("Unexpected response format:", response);
                setFetchedPlans([]); // Clear plans if response is invalid
            }
        } catch (error: any) {
            console.error("Error fetching data plans:", error.message);
            setFetchedPlans([]); // Clear plans on error
        } finally {
            setIsLoadingPlans(false);
        }
    }, [token, selectedNetwork]);

    useEffect(() => {
        getDatacodeDetails();
    }, [getDatacodeDetails]);

    // Create options from fetched API plans
    const getPlanOptions = () => {
        if (!selectedNetwork || fetchedPlans.length === 0) {
            // Fall back to static plans if API plans are not available
            const staticPlans = dataPlans[selectedNetwork as keyof typeof dataPlans];
            if (!staticPlans) return [];
            
            return staticPlans.map((plan) => ({
                label: `${plan.label} — ₦${plan.price}`,
                value: plan.id,
            }));
        }
        
        // Create options from API data
        return fetchedPlans.map((plan) => ({
            label: `${plan.bundle_value} - ${plan.bundle_validity.trim()} (₦${plan.bundle_price})`,
            value: plan.plan_code,
            // Store the plan object for later use if needed
            planData: plan,
        }));
    };

    // Get the selected plan details
    const getSelectedPlanDetails = () => {
        if (!selectedPlan) return null;
        
        // Find in fetched plans
        const apiPlan = fetchedPlans.find(plan => plan.plan_code === selectedPlan);
        if (apiPlan) return apiPlan;
        
        // Fall back to static plans
        if (selectedNetwork) {
            const staticPlans = dataPlans[selectedNetwork as keyof typeof dataPlans];
            if (staticPlans) {
                const staticPlan = staticPlans.find(p => p.id === selectedPlan);
                return staticPlan;
            }
        }
        
        return null;
    };

    const handleProceed = () => {
        if (!selectedNetwork) {
            Alert.alert("Validation Error", "Please select a network.");
            return;
        }
        
        const planOptions = getPlanOptions();
        if (planOptions.length === 0) {
            Alert.alert("Error", "No data plans available for this network.");
            return;
        }
        
        if (!selectedPlan) {
            Alert.alert("Validation Error", "Please select a data plan.");
            return;
        }
        
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert(
                "Validation Error",
                "Please enter a valid phone number."
            );
            return;
        }
        
        if (!amountData || isNaN(Number(amountData)) || Number(amountData) <= 0) {
            Alert.alert("Validation Error", "Please enter a valid amount.");
            return;
        }

        // All validations passed, show the confirmation modal
        setIsModalVisible(true);
    };

    const handleConfirmPurchase = async () => {
        if (!token) {
            Alert.alert("Authentication Error", "Please log in and try again.");
            return;
        }
        
        if (pin.length !== 4) {
            Alert.alert("Error", "Please enter your 4-digit transaction PIN.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Verify PIN first (uncomment when ready)
            // const pinVerified = await verifyPin(pin, token);
            // if (!pinVerified) {
            //     Alert.alert("Error", "Invalid PIN. Please try again.");
            //     setIsLoading(false);
            //     return;
            // }

            // 2. If PIN is correct, proceed with data purchase
            const amount = Number(amountData);
            
            // Get the selected plan details
            const planDetails = getSelectedPlanDetails();
            
            // Make the purchase
            const result = await buyData(
                pin,
                phoneNumber,
                amount,
                selectedPlan!,
                token,
                selectedNetwork!
            );

            console.log("Data Purchase Result:", result);

            if (result?.status?.toLowerCase() === "success") {
                // Set transaction details for success overlay
                setTransactionDetails({
                    amount: amount,
                    receiver: phoneNumber,
                    phoneNumber: phoneNumber,
                    network: selectedNetwork,
                    dataSize: planDetails?.bundle_value,
                    validity: planDetails?.bundle_validity,
                    transactionReference: result.data?.transactionId || result.reference || result.data?.reference,
                    createdAt: new Date().toISOString(),
                    planName: planDetails?.plan_name
                });
                setSuccess(true);
            } else {
                Alert.alert(
                    "Error",
                    result?.message || "Purchase failed. Please try again."
                );
            }
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message || "An unexpected error occurred."
            );
        } finally {
            setIsLoading(false);
            setIsModalVisible(false);
            setPin(""); // Clear PIN after attempt
        }
    };

    const handleTopupMyNumber = () => {
        if (profile?.profile?.phoneNumber) {
            setPhone(profile.profile.phoneNumber);
            Alert.alert(
                "Phone Number Pre-filled",
                "Your number has been added."
            );
        } else {
            Alert.alert(
                "Error",
                "Your phone number is not available in your profile."
            );
        }
    };

    const handleCloseSuccess = () => {
        setSuccess(false);
        setTransactionDetails(null);
        // Optionally reset form
        setAmount("");
        setSelectedPlan(null);
        setPhone("");
    };

    // Get plan label for confirmation modal
    const getPlanLabel = () => {
        const planDetails = getSelectedPlanDetails();
        
        if (planDetails) {
            if ('bundle_value' in planDetails) {
                // API plan
                return `${planDetails.bundle_value} - ${planDetails.bundle_validity.trim()}`;
            } else {
                // Static plan
                return planDetails.label;
            }
        }
        
        return "Custom";
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB] w-[95%] mx-auto">
            <KeyboardAvoidWrapper>
                <View className="mt-3 w-full mx-auto bg-transparent flex gap-3">
                    <Balance />
                    <Button
                        input="Topup my number"
                        onPress={handleTopupMyNumber}
                        variant="outline"
                    />
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm mt-8 mb-4">
                    {/* Title */}
                    <Text className="text-base font-medium text-gray-700 mb-2">
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
                                    setAmount("");
                                    setFetchedPlans([]); // Clear plans when network changes
                                }}
                                className={`w-14 h-14 rounded-lg border-2 p-1 items-center justify-center ${
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
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Show loading when fetching plans */}
                    {isLoadingPlans && (
                        <Text className="text-center text-gray-500 py-4">
                            Loading data plans...
                        </Text>
                    )}

                    {/* Data Plans Dropdown */}
                    {selectedNetwork && getPlanOptions().length > 0 && (
                        <FormField
                            label="Select Data Plan"
                            type="select"
                            value={selectedPlan || ""}
                            onChangeText={handlePlanChange}
                            options={getPlanOptions()}
                        />
                    )}

                    {/* Selected Plan Amount Display */}
                    <View className="mt-4 mb-6">
                        <Text className="text-sm font-medium text-gray-800 mb-1">
                            Amount
                        </Text>
                        <TextInput
                            value={amountData}
                            onChangeText={setAmount}
                            placeholder="Amount will be auto-filled when you select a plan"
                            keyboardType="numeric"
                            className="w-full h-11 px-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-800"
                            editable={false} // Make read-only since amount is auto-filled
                        />
                        {selectedPlan && (
                            <Text className="text-xs text-gray-500 mt-1">
                                This amount is based on your selected plan
                            </Text>
                        )}
                    </View>

                    {/* Phone Number Input */}
                    <FormField
                        label="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                    <View className="mt-10">
                        <Button 
                            input="Proceed" 
                            onPress={handleProceed}
                            disabled={isLoadingPlans}
                        />
                    </View>
                </View>
            </KeyboardAvoidWrapper>

            {/* Confirmation Modal */}
            <ConfirmTransactionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmPurchase}
                title="Confirm Data Purchase"
                amount={amountData}
                isLoading={isLoading}
                pin={pin}
                onPinChange={setPin}
                details={[
                    {
                        label: "Network",
                        value: selectedNetwork || "N/A",
                    },
                    { label: "Phone Number", value: phoneNumber },
                    {
                        label: "Plan",
                        value: getPlanLabel(),
                    },
                    {
                        label: "Plan Code",
                        value: selectedPlan || "N/A",
                    },
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