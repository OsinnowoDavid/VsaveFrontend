import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsAndPoliciesScreen() {
    const lastUpdated = "January 1st, 2026";
    const effectiveDate = "January 1st, 2026";

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View className="px-6 py-5 border-b border-gray-100 bg-white shadow-sm">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 -ml-2"
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-gray-900 ml-2">
                            Terms and Conditions
                        </Text>
                    </View>
                    <Text className="text-xl text-center font-medium text-green-600 mt-3">
                        VSAVE
                    </Text>
                </View>

                {/* Main Content */}
                <View className="px-6 pt-6">
                    {/* Updated Dates */}
                    <View className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100">
                        <Text className="text-sm font-medium text-green-800 mb-1">
                            Last Updated: {lastUpdated}
                        </Text>
                        <Text className="text-sm font-medium text-green-800">
                            Effective Date: {effectiveDate}
                        </Text>
                    </View>

                    {/* Introduction */}
                    <Text className="text-base text-gray-700 leading-relaxed mb-6">
                        <Text className="font-semibold">Vaultspring Technologies Limited</Text>, 
                        its parents, subsidiaries, successors, assignees, and affiliates 
                        ("Vaultspring", "we", "our", or "us") provides access to and use of 
                        VSave, a digital savings and financial services platform operated via 
                        the VSave mobile application and associated websites (collectively, 
                        the "VSave App" or "Services").
                    </Text>
                    
                    <Text className="text-base text-gray-700 leading-relaxed mb-8">
                        Vsave operates as a mobile savings and loan platform licensed by the 
                        Lagos State Cooperative Society and complies with all applicable 
                        Nigerian financial, cooperative, and data protection regulations.
                    </Text>

                    <Text className="text-base text-gray-700 leading-relaxed mb-8">
                        These Terms and Conditions ("Terms") govern your access to and use 
                        of the VSave App and Services.
                    </Text>

                    {/* Important Notice */}
                    <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
                        <Text className="text-red-800 font-bold text-base mb-2">
                            IMPORTANT NOTICE
                        </Text>
                        <Text className="text-red-700 text-sm leading-relaxed">
                            BY REGISTERING, USING THE VSAVE APP, OR PROVIDING YOUR OTP TO 
                            AN AGENT, YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND 
                            AGREED TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY.
                        </Text>
                    </View>

                    {/* Section 1: Definitions */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            1. DEFINITIONS
                        </Text>
                        
                        {[
                            {term: "1.1", definition: '"VSave" means the digital savings, wallet, loan, and bill payment platform operated by Vaultspring.'},
                            {term: "1.2", definition: '"User" means any individual who registers and uses the VSave App.'},
                            {term: "1.3", definition: '"Agent" means an authorised representative of Vaultspring who assists users with onboarding or transactions.'},
                            {term: "1.4", definition: '"OTP" means a one-time password used to authorise actions.'},
                            {term: "1.5", definition: '"VSave Wallet" means the electronic wallet linked to your VSave account.'},
                            {term: "1.6", definition: '"Savings Account" means the structured digital savings account provided within VSave.'},
                            {term: "1.7", definition: '"Virtual Account" means a system-generated account number assigned for inbound transfers.'},
                            {term: "1.8", definition: '"KYC" means Know-Your-Customer verification requirements.'},
                        ].map((item, index) => (
                            <View key={index} className="mb-3">
                                <Text className="text-base font-semibold text-gray-800">
                                    {item.term}
                                </Text>
                                <Text className="text-base text-gray-600 ml-4 leading-relaxed">
                                    {item.definition}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Section 2: Consent to Terms */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            2. CONSENT TO TERMS
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            By accessing or using VSave, you agree to:
                        </Text>
                        <View className="ml-4">
                            {[
                                "These Terms and Conditions",
                                "Our Privacy Policy",
                                "Any additional product-specific terms communicated within the app"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-blue-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 mt-4 leading-relaxed">
                            You also consent to the collection, processing, and sharing of your 
                            data for regulatory, operational, and fraud-prevention purposes.
                        </Text>
                    </View>

                    {/* Section 3: Services Provided */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            3. SERVICES PROVIDED
                        </Text>
                        
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            3.1 VSave Wallet Services
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Users may:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Fund their wallet via virtual accounts, bank transfers, or approved offline deposits",
                                "Transfer funds",
                                "Withdraw funds (subject to limits and approvals)",
                                "Pay for airtime, data, utilities, and bills"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            3.2 Savings Services
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            VSave provides structured digital savings products designed to 
                            promote disciplined savings habits.
                        </Text>

                        {/* Important Savings Authorization */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                            <Text className="text-lg font-bold text-yellow-800 mb-3">
                                3.3 COMPULSORY SAVINGS AUTHORIZATION
                            </Text>
                            
                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.1
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                VSave operates as a structured digital savings platform. 
                                Savings is a compulsory feature of the VSave App.
                            </Text>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.2
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                By registering on VSave, you expressly authorize Vaultspring to:
                            </Text>
                            <View className="ml-4 mb-3">
                                <View className="flex-row items-start mb-1">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Create and manage savings plans on your behalf; and
                                    </Text>
                                </View>
                                <View className="flex-row items-start">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Automatically fund your savings from your VSave Wallet based on your selected savings schedule.
                                    </Text>
                                </View>
                            </View>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.3
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                Where you fail to meet a scheduled savings contribution due to 
                                insufficient wallet balance or any other reason, you authorize 
                                VSave to automatically deduct outstanding savings amounts from 
                                your wallet once funds become available.
                            </Text>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.4
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                Such deductions may include:
                            </Text>
                            <View className="ml-4 mb-3">
                                <View className="flex-row items-start mb-1">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Missed daily, weekly, or monthly savings contributions; or
                                    </Text>
                                </View>
                                <View className="flex-row items-start">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Any amount required to complete or regularize your active savings plan.
                                    </Text>
                                </View>
                            </View>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.5
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                These deductions shall be applied without further notice or OTP, 
                                as they constitute a standing instruction given by you upon 
                                acceptance of these Terms.
                            </Text>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.6
                            </Text>
                            <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                                Funds deducted under this clause:
                            </Text>
                            <View className="ml-4 mb-3">
                                <View className="flex-row items-start mb-1">
                                    <Text className="text-green-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Are credited directly into your personal savings account; and
                                    </Text>
                                </View>
                                <View className="flex-row items-start">
                                    <Text className="text-green-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        Do not constitute fees, penalties, or charges.
                                    </Text>
                                </View>
                            </View>

                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                3.3.7
                            </Text>
                            <Text className="text-base text-gray-700 leading-relaxed">
                                You acknowledge that this mechanism is intended to promote 
                                financial discipline and agree that Vaultspring shall not be 
                                liable for any authorized automatic savings deductions executed 
                                in line with this clause.
                            </Text>
                        </View>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            3.4 Loan Services
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Eligible users may apply for loans subject to:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Credit assessment",
                                "Risk evaluation",
                                "Applicable interest rates and repayment terms"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Vaultspring reserves the right to approve, reject, or modify loan terms.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            3.5 Airtime, Data & Bill Payment Services
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            Users may purchase airtime, data, and pay utility bills via the 
                            VSave App. Applicable service fees may apply and will be 
                            disclosed prior to confirmation.
                        </Text>
                    </View>

                    {/* Section 4: Conditions for Using VSave */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            4. CONDITIONS FOR USING VSAVE
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            To use VSave, you must:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Be at least 18 years old",
                                "Provide accurate personal and KYC information",
                                "Not use the platform for fraudulent or illegal activities",
                                "Use the Services strictly for personal purposes"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            You authorize Vaultspring to verify your BVN and share required 
                            information with regulators and licensed partners.
                        </Text>
                    </View>

                    {/* Section 5: Funding & Transactions */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            5. FUNDING & TRANSACTIONS
                        </Text>
                        <View className="ml-4">
                            {[
                                {num: "5.1", text: "All transactions are processed in Nigerian Naira."},
                                {num: "5.2", text: "Some transactions may attract fees, which will be disclosed before confirmation."},
                                {num: "5.3", text: "Offline (manual) deposits and withdrawals require admin approval before settlement."},
                                {num: "5.4", text: "Virtual account deposits are processed automatically."},
                            ].map((item, index) => (
                                <View key={index} className="mb-3">
                                    <Text className="text-base font-semibold text-gray-800">
                                        {item.num}
                                    </Text>
                                    <Text className="text-base text-gray-700 ml-4 leading-relaxed">
                                        {item.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Section 6: KYC Levels & Limits */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            6. KYC LEVELS & LIMITS
                        </Text>
                        <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                            VSave applies tiered KYC levels in line with regulatory requirements. 
                            Transaction limits may vary by verification level and risk assessment.
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            Vaultspring may adjust limits in compliance with regulatory directives.
                        </Text>
                    </View>

                    {/* Section 7: Security & User Responsibilities */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            7. SECURITY & USER RESPONSIBILITIES
                        </Text>
                        <View className="ml-4">
                            {[
                                "You are responsible for protecting your PIN and OTP",
                                "Do not share login credentials",
                                "Report suspected fraud immediately"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 mt-4 leading-relaxed">
                            Vaultspring will investigate reported issues in line with applicable regulations.
                        </Text>
                    </View>

                    {/* Section 8: Suspension & Termination */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            8. SUSPENSION & TERMINATION
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Vaultspring reserves the right to suspend or terminate accounts where:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Fraud is suspected",
                                "Regulatory obligations require it",
                                "These Terms are breached"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            Funds may be held pending investigation or regulatory instruction.
                        </Text>
                    </View>

                    {/* Section 9: Data Protection */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            9. DATA PROTECTION
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            User data is handled in accordance with the Nigeria Data Protection 
                            Act (NDPA) and VSave's Privacy Policy.
                        </Text>
                    </View>

                    {/* Section 10: Amendments */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            10. AMENDMENTS
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            Vaultspring may update these Terms from time to time. Continued 
                            use of the VSave App constitutes acceptance of updated Terms.
                        </Text>
                    </View>

                    {/* Section 11: Governing Law */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            11. GOVERNING LAW
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            These Terms are governed by the laws of the Federal Republic of Nigeria.
                        </Text>
                    </View>

                    {/* Acceptance Footer */}
                    <View className="mt-8 pt-6 border-t border-gray-200">
                        <Text className="text-center text-sm text-gray-500">
                            By using VSave, you acknowledge that you have read,
                            understood, and agree to be bound by these Terms and Conditions.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 