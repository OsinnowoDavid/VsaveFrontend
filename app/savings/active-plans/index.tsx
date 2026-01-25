import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    View,
    FlatList,
    TouchableOpacity as RNTouchableOpacity,
} from "react-native";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import PlanCard from "../../../components/PlanCard";
import useSavingsStore from "../../../store/useSavingsStore";
import { TouchableOpacity } from "react-native";
import { ArrowLeft, Calendar, DollarSign, Clock, TrendingUp, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ActivePlansScreen() {
    const {
        activePlans,
        fetchActivePlans,
        isLoadingActive,
        availablePlans,
        fetchAvailablePlans,
    } = useSavingsStore();
    
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const router = useRouter();

    console.log("ACTIVE-PLANS RAW DATA:", JSON.stringify(activePlans, null, 2));

    const onRefresh = useCallback(async () => {
        await Promise.all([fetchActivePlans(), fetchAvailablePlans()]);
    }, [fetchActivePlans, fetchAvailablePlans]);

    useEffect(() => {
        if (!activePlans?.data?.data || activePlans.data.data.length === 0) {
            fetchActivePlans();
        }
        if (availablePlans.length === 0) {
            fetchAvailablePlans();
        }
    }, [fetchActivePlans, activePlans, fetchAvailablePlans, availablePlans.length]);

    // Extract all savings records from API response
    const savingsRecords = useMemo(() => {
        console.log("Extracting savings records from API...");
        
        if (!activePlans?.success) {
            console.log("API call not successful");
            return [];
        }
        
        if (!activePlans?.data?.data || !Array.isArray(activePlans.data.data)) {
            console.log("No data array in response");
            return [];
        }
        
        console.log("Found", activePlans.data.data.length, "savings records");
        
        // Directly extract savingsRecord and contributionRecord from each item
        return activePlans.data.data.map((item) => ({
            savingsRecord: item.savingsRecord,
            contributionRecord: item.contributionRecord,
            // Flatten the structure for easier access
            ...item.savingsRecord,
            contributionDetails: item.contributionRecord,
            savingsCircleId: item.savingsRecord?.savingsCircleId,
            // Calculate additional fields
            currentAmountSaved: item.contributionRecord?.currentAmountSaved || 0,
            totalContributions: item.contributionRecord?.record?.length || 0,
        }));
    }, [activePlans]);

    console.log("SAVINGS RECORDS EXTRACTED:", savingsRecords.length);
    console.log("First record details:", savingsRecords[0]?.savingsRecord);

    // Filter for active plans only
    const activePlansOnly = useMemo(() => {
        return savingsRecords.filter(plan => plan.savingsRecord?.status === "ACTIVE");
    }, [savingsRecords]);

    // Create a map for available plan details
    const availablePlansMap = useMemo(() => {
        let plansArray = availablePlans;
        if (availablePlans?.data?.data && Array.isArray(availablePlans.data.data)) {
            plansArray = availablePlans.data.data;
        } else if (Array.isArray(availablePlans)) {
            plansArray = availablePlans;
        } else {
            plansArray = [];
        }
        
        return new Map(plansArray.map((plan) => [plan._id, plan]));
    }, [availablePlans]);

    // Calculate statistics
    const calculateStatistics = useMemo(() => {
        const stats = {
            totalSavings: 0,
            totalTarget: 0,
            totalContributions: 0,
            activeCount: 0,
            pausedCount: 0,
        };

        savingsRecords.forEach(plan => {
            const savings = plan.savingsRecord;
            const contributions = plan.contributionRecord;
            
            if (savings) {
                stats.totalTarget += savings.maturityAmount || 0;
                
                if (savings.status === "ACTIVE") {
                    stats.activeCount++;
                } else if (savings.status === "PAUSED") {
                    stats.pausedCount++;
                }
            }
            
            if (contributions) {
                stats.totalSavings += contributions.currentAmountSaved || 0;
                stats.totalContributions += contributions.record?.length || 0;
            }
        });

        return stats;
    }, [savingsRecords]);

    // Helper functions
    const calculateProgress = (plan: any) => {
        try {
            const savings = plan.savingsRecord;
            const contributions = plan.contributionRecord;
            
            if (!savings || !contributions) return 0;
            
            const currentAmount = contributions.currentAmountSaved || 0;
            const targetAmount = savings.maturityAmount || 1;
            
            return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
        } catch (error) {
            console.error("Error calculating progress:", error);
            return 0;
        }
    };

    const calculateDaysRemaining = (endDate: string) => {
        try {
            const end = new Date(endDate);
            const now = new Date();
            const diffTime = end.getTime() - now.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch (error) {
            return 0;
        }
    };

    const calculateDaysElapsed = (startDate: string) => {
        try {
            const start = new Date(startDate);
            const now = new Date();
            const diffTime = now.getTime() - start.getTime();
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } catch (error) {
            return 0;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-GB", {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const toggleExpandPlan = (planId: string) => {
        setExpandedPlanId(expandedPlanId === planId ? null : planId);
    };

    // Render contribution item
    const renderContributionItem = ({ item }: { item: any }) => (
        <View className="bg-green-600 rounded-lg p-3 mb-2">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-white font-medium">
                        Period {item.periodIndex}
                    </Text>
                    <Text className=" text-xs">
                        Status: <Text className={`font-semibold ${item.status === 'paid' ? 'text-white' : 'text-red-600'}`}>
                            {item.status?.toUpperCase()}
                        </Text>
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-white font-bold">
                        ₦{item.amount?.toLocaleString()}
                    </Text>
                    <Text className="text-white text-xs">
                        ID: {item._id?.substring(0, 8)}...
                    </Text>
                </View>
            </View>
        </View>
    );

    // Render savings record details
    const renderSavingsRecordDetails = (savingsRecord: any) => {
        if (!savingsRecord) return null;

        return (
            <View className="bg-blue-50 rounded-lg p-4 mt-3 border border-blue-100">
                <Text className="text-blue-800 font-bold mb-3">Savings Record Details</Text>
                
                <View className="space-y-3">
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Record ID:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {savingsRecord._id?.substring(0, 16)}...
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Status:</Text>
                        <View className={`px-2 py-1 rounded-full ${savingsRecord.status === 'ACTIVE' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            <Text className={`text-xs font-bold ${savingsRecord.status === 'ACTIVE' ? 'text-green-800' : 'text-yellow-800'}`}>
                                {savingsRecord.status}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Period:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {savingsRecord.period} / {savingsRecord.duration}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Auto Restart:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {savingsRecord.autoRestartEnabled ? "Enabled" : "Disabled"}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Payout Status:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {savingsRecord.payOutStatus ? "Paid" : "Not Paid"}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Created:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {formatDate(savingsRecord.createdAt)}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-blue-700 text-sm">Updated:</Text>
                        <Text className="text-blue-900 font-medium text-sm">
                            {formatDate(savingsRecord.updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // Render contribution record details
    const renderContributionRecordDetails = (contributionRecord: any) => {
        if (!contributionRecord) return null;

        return (
            <View className="bg-green-50 rounded-lg p-4 mt-3 border border-green-100">
                <Text className="text-green-800 font-bold mb-3">Contribution Record Details</Text>
                
                <View className="space-y-3">
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Record ID:</Text>
                        <Text className="text-green-900 font-medium text-sm">
                            {contributionRecord._id?.substring(0, 16)}...
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Total Saved:</Text>
                        <Text className="text-green-900 font-bold text-sm">
                            ₦{(contributionRecord.currentAmountSaved || 0).toLocaleString()}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Admin Fee:</Text>
                        <Text className="text-green-900 font-medium text-sm">
                            ₦{(contributionRecord.adminFirstTimeFee || 0).toLocaleString()}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Total Contributions:</Text>
                        <Text className="text-green-900 font-bold text-sm">
                            {contributionRecord.record?.length || 0}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Created:</Text>
                        <Text className="text-green-900 font-medium text-sm">
                            {formatDate(contributionRecord.createdAt)}
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <Text className="text-green-700 text-sm">Updated:</Text>
                        <Text className="text-green-900 font-medium text-sm">
                            {formatDate(contributionRecord.updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoadingActive && savingsRecords.length === 0) {
        return (
            <HomeScreenWrapper showFooter={false}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1B8A52" />
                    <Text className="mt-4 text-gray-600">Loading your savings plans...</Text>
                </View>
            </HomeScreenWrapper>
        );
    }

    return (
        <HomeScreenWrapper showFooter={false}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingActive}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 80,
                    flexGrow: 1,
                }}
            >
                {/* Header */}
                <View className="mb-6">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="flex-row items-center mb-6"
                        activeOpacity={0.7}
                    >
                        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                            <ArrowLeft size={20} color="#374151" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-800">Back</Text>
                    </TouchableOpacity>
                    
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        My Savings Plans
                    </Text>
                    <Text className="text-gray-500">
                        {savingsRecords.length} total plans • {activePlansOnly.length} active
                    </Text>
                </View>

                {/* Statistics Overview */}
                <View className="bg-green-600 rounded-2xl p-5 mb-6 shadow-lg">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-white text-lg font-semibold">
                                Total Savings
                            </Text>
                            <Text className="text-white/80 text-sm">
                                Across all plans
                            </Text>
                        </View>
                        <DollarSign size={24} color="white" />
                    </View>
                    
                    <View className="flex-row justify-between mb-6">
                        <View className="items-center">
                            <Text className="text-white/80 text-sm">Saved</Text>
                            <Text className="text-white text-2xl font-bold">
                                ₦{calculateStatistics.totalSavings.toLocaleString()}
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white/80 text-sm">Target</Text>
                            <Text className="text-white text-2xl font-bold">
                                ₦{calculateStatistics.totalTarget.toLocaleString()}
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white/80 text-sm">Contributions</Text>
                            <Text className="text-white text-2xl font-bold">
                                {calculateStatistics.totalContributions}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Progress Bar */}
                    <View className="mt-2">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-white/80 text-sm">Overall Progress</Text>
                            <Text className="text-white text-sm font-medium">
                                {calculateStatistics.totalTarget > 0 
                                    ? Math.round((calculateStatistics.totalSavings / calculateStatistics.totalTarget) * 100) 
                                    : 0}%
                            </Text>
                        </View>
                        <View className="h-3 bg-white/30 rounded-full overflow-hidden">
                            <View 
                                className="h-full bg-white rounded-full"
                                style={{ 
                                    width: `${calculateStatistics.totalTarget > 0 
                                        ? Math.min(100, (calculateStatistics.totalSavings / calculateStatistics.totalTarget) * 100) 
                                        : 0}%` 
                                }}
                            />
                        </View>
                    </View>
                </View>

                {/* Plans Status Summary */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm border border-gray-100">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                                <TrendingUp size={20} color="#1B8A52" />
                            </View>
                            <View>
                                <Text className="text-gray-500 text-sm">Active Plans</Text>
                                <Text className="text-2xl font-bold text-gray-900">
                                    {calculateStatistics.activeCount}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm border border-gray-100">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mr-3">
                                <Clock size={20} color="#D97706" />
                            </View>
                            <View>
                                <Text className="text-gray-500 text-sm">Paused Plans</Text>
                                <Text className="text-2xl font-bold text-gray-900">
                                    {calculateStatistics.pausedCount}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Plans List */}
                <Text className="text-lg font-bold text-gray-800 mb-4">
                    All Savings Plans ({savingsRecords.length})
                </Text>

                {!isLoadingActive && savingsRecords.length === 0 && (
                    <View className="flex-1 justify-center items-center mt-10 py-10">
                        <View className="bg-gray-100 rounded-full p-6 mb-4">
                            <Text className="text-4xl">💰</Text>
                        </View>
                        <Text className="text-lg text-gray-500 mb-2 font-semibold">
                            No savings plans found
                        </Text>
                        <Text className="text-gray-400 text-center text-sm mb-6">
                            Start your savings journey by creating a new plan
                        </Text>
                        <TouchableOpacity 
                            className="bg-[#1B8A52] px-6 py-3 rounded-full"
                            onPress={() => router.push('/savings/create')}
                        >
                            <Text className="text-white font-semibold">
                                Create Savings Plan
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {savingsRecords.map((plan, index) => {
                    const savingsRecord = plan.savingsRecord;
                    const contributionRecord = plan.contributionRecord;
                    
                    if (!savingsRecord) return null;

                    const isExpanded = expandedPlanId === savingsRecord._id;
                    const progress = calculateProgress(plan);
                    const daysRemaining = calculateDaysRemaining(savingsRecord.endDate);
                    const daysElapsed = calculateDaysElapsed(savingsRecord.startDate);
                    const planDetails = availablePlansMap.get(savingsRecord.savingsCircleId);
                    const planTitle = planDetails?.savingsTitle || `Savings Plan ${index + 1}`;

                    return (
                        <View key={savingsRecord._id} className="mb-6">
                            {/* Plan Card */}
                            <TouchableOpacity 
                                onPress={() => toggleExpandPlan(savingsRecord._id)}
                                activeOpacity={0.9}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
                            >
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-2">
                                            <View className={`w-3 h-3 rounded-full mr-2 ${savingsRecord.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <Text className="text-gray-900 font-bold text-lg">
                                                {planTitle}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-500 text-sm">
                                            ID: {savingsRecord._id?.substring(0, 10)}...
                                        </Text>
                                    </View>
                                    <ChevronRight 
                                        size={20} 
                                        color="#6B7280" 
                                        style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                                    />
                                </View>

                                {/* Plan Stats */}
                                <View className="flex-row justify-between mb-4">
                                    <View className="items-center">
                                        <Text className="text-gray-500 text-sm">Saved</Text>
                                        <Text className="text-gray-900 font-bold text-lg">
                                            ₦{contributionRecord?.currentAmountSaved?.toLocaleString() || '0'}
                                        </Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-gray-500 text-sm">Target</Text>
                                        <Text className="text-gray-900 font-bold text-lg">
                                            ₦{savingsRecord.maturityAmount?.toLocaleString() || '0'}
                                        </Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-gray-500 text-sm">Progress</Text>
                                        <Text className="text-gray-900 font-bold text-lg">
                                            {progress}%
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="mb-4">
                                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <View 
                                            className="h-full bg-[#1B8A52] rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </View>
                                </View>

                                {/* Plan Details */}
                                <View className="flex-row justify-between">
                                    <View className="flex-row items-center">
                                        <Calendar size={14} color="#6B7280" />
                                        <Text className="text-gray-500 text-sm ml-1">
                                            {daysElapsed} / {savingsRecord.duration} days
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Clock size={14} color="#6B7280" />
                                        <Text className="text-gray-500 text-sm ml-1">
                                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <View className="mt-3 space-y-3">
                                    {/* Savings Record Details */}
                                    {renderSavingsRecordDetails(savingsRecord)}
                                    
                                    {/* Contribution Record Details */}
                                    {renderContributionRecordDetails(contributionRecord)}
                                    
                                    {/* Contributions List */}
                                    {contributionRecord?.record && contributionRecord.record.length > 0 && (
                                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                                            <Text className="text-gray-800 font-bold mb-3">
                                                All Contributions ({contributionRecord.record.length})
                                            </Text>
                                            <FlatList
                                                data={contributionRecord.record}
                                                renderItem={renderContributionItem}
                                                keyExtractor={(item, index) => item._id || index.toString()}
                                                scrollEnabled={false}
                                                initialNumToRender={10}
                                                maxToRenderPerBatch={10}
                                                windowSize={5}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}

                {/* API Data Summary (for debugging) */}
                <View className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-200">
                    <Text className="text-gray-800 font-bold mb-2">API Data Summary</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600 text-sm">Total Records from API:</Text>
                            <Text className="text-gray-800 font-medium text-sm">
                                {savingsRecords.length}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600 text-sm">API Response Status:</Text>
                            <Text className="text-green-600 font-medium text-sm">
                                {activePlans?.success ? 'Success' : 'Failed'}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600 text-sm">Last Updated:</Text>
                            <Text className="text-gray-800 font-medium text-sm">
                                {new Date().toLocaleTimeString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </HomeScreenWrapper>
    );
}