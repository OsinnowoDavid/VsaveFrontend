import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
    const lastUpdated = "December 14, 2025";

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
                            Privacy & Cookie Policy
                        </Text>
                    </View>
                    <Text className="text-xl text-center font-medium text-green-600 mt-3">
                        VSAVE
                    </Text>
                </View>

                {/* Main Content */}
                <View className="px-6 pt-6">
                    {/* Updated Date */}
                    <View className="bg-purple-50 p-4 rounded-lg mb-8 border border-purple-100">
                        <Text className="text-sm font-medium text-green-800">
                            Last Updated: {lastUpdated}
                        </Text>
                    </View>

                    {/* Important Notice */}
                    <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
                        <Text className="text-red-800 font-bold text-base mb-2">
                            PLEASE READ THIS PRIVACY POLICY CAREFULLY
                        </Text>
                        <Text className="text-red-700 text-sm leading-relaxed">
                            BY CLICKING "SIGN UP," OR OTHERWISE USING ANY VSAVE SERVICES, 
                            YOU ARE CONFIRMING THAT YOU HAVE READ, UNDERSTOOD, AND AGREED 
                            TO THIS POLICY. THIS DOCUMENT EXPLAINS HOW WE COLLECT, USE, 
                            AND PROTECT YOUR PERSONAL DATA.
                        </Text>
                    </View>

                    {/* Section 1: Overview */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            1. Overview
                        </Text>
                        
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            1.1 Introduction
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            This Privacy and Cookies Policy is intended to meet our 
                            obligations under the Nigerian Data Protection Act (NDPA) 2023, 
                            the General Application and Implementation Directive (GAID) 2025, 
                            and other applicable data protection laws and regulations. It sets 
                            out guidelines for protecting and processing personal information 
                            of individuals in Nigeria or of Nigerian descent.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            1.2 Personal Data
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Personal Data refers to any information relating to an identifiable 
                            natural person, including Customer Information or any data that 
                            enables us to identify you personally.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            1.3 Who We Are and How to Contact Us
                        </Text>
                        <Text className="text-base text-gray-700 mb-3 leading-relaxed">
                            VSave is a licensed savings and loan cooperative society providing 
                            secure savings, loans, and financial services. Services are offered 
                            through the VSave App, web portal, and other platforms ("Platform").
                        </Text>
                        <Text className="text-base font-semibold text-gray-800 mb-2">
                            For questions or complaints about your personal data, contact:
                        </Text>
                        <View className="ml-4 space-y-2">
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Email:</Text> dpo@vsave.coop
                                </Text>
                            </View>
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Phone:</Text> 01-800-VSAVE (01-800-87283)
                                </Text>
                            </View>
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Address:</Text> 14 Adebola Adebayo, By Afolabi Bus stop, Igando-Iyana Iba road
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 2: Your Rights */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            2. Your Rights
                        </Text>
                        
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            2.1 Rights Relating to Personal Data
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            You have the following rights:
                        </Text>
                        
                        <View className="ml-4 space-y-3">
                            {[
                                {number: "1.", right: "Be Informed – Know what personal data we collect and why."},
                                {number: "2.", right: "Access – Obtain a copy of your personal data."},
                                {number: "3.", right: "Correction – Correct inaccurate or incomplete data."},
                                {number: "4.", right: "Erasure – Request deletion of data when not legally required to retain."},
                                {number: "5.", right: "Object to Processing – Object to processing, including for marketing purposes."},
                                {number: "6.", right: "Restrict Processing – Temporarily suspend processing while verifying accuracy."},
                                {number: "7.", right: "Data Portability – Receive your data in a structured, machine-readable format."},
                                {number: "8.", right: "Withdraw Consent – Revoke consent for processing, which may affect certain services."},
                            ].map((item, index) => (
                                <View key={index} className="flex-row">
                                    <Text className="text-base font-semibold text-gray-800 w-8">
                                        {item.number}
                                    </Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item.right}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text className="text-lg font-semibold text-gray-800 mb-2 mt-6">
                            2.2 How to Exercise Your Rights
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Contact us via the details in Section 1.3. Verification may be 
                            required to ensure data protection. Responses are typically 
                            within one month, extended if requests are complex.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            2.3 Grievance Resolution – SNAG Process
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            User may submit a Standard Notice to Address Grievance (SNAG) 
                            to VSave to resolve concerns before escalation to the Nigeria 
                            Data Protection Commission (NDPC) or legal action.
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            Contact: dpo@vsave.coop | 01-800-VSAVE
                        </Text>
                    </View>

                    {/* Section 3: Basis for Data Processing */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            3. Basis for Data Processing
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            We collect and process personal data for:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Operating and providing our cooperative services",
                                "Legal and regulatory compliance",
                                "Customer support and personalized services",
                                "Security and fraud prevention"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base font-semibold text-gray-800 mb-2">
                            We ensure:
                        </Text>
                        <View className="ml-4">
                            {[
                                "Fair, lawful, and transparent processing",
                                "Data collection is for specific, legitimate purposes only",
                                "Data is adequate, relevant, and limited to necessity",
                                "Accuracy and up-to-date data",
                                "Retention only as long as necessary",
                                "Security against unauthorized access, loss, or breach"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-green-600 mr-2">✓</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-base text-gray-700 mt-4 leading-relaxed">
                            Consent is sought where necessary, and withdrawal does not 
                            affect lawful prior processing.
                        </Text>
                    </View>

                    {/* Section 4: Personal Data We Collect */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            4. Personal Data We Collect
                        </Text>
                        
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            4.1 User information
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Full name, phone number, email, VSave PIN, address, date of birth, occupation, gender",
                                "Bank account details, transaction history, BVN/NIN",
                                "Biometric data (face recognition) for authentication",
                                "Additional information may be requested for promotions, surveys, or problem reporting"
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
                            4.2 Device Information
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Device identifiers, SIM card info, operating system, browser type",
                                "Contact list information, with consent"
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
                            4.3 Location Information
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed ml-4">
                            • GPS location for certain services, collected with consent
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            4.4 Analytics and Cookies
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "In-app analytics to improve Platform functionality",
                                "Cookies track usage and preferences; disabling may affect service"
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-gray-600 mr-2">•</Text>
                                    <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Data Categories Table */}
                        <Text className="text-lg font-semibold text-gray-800 mb-3">
                            4.5 Categories of Data
                        </Text>
                        
                        {/* Table Header */}
                        <View className="border border-gray-300 rounded-lg overflow-hidden mb-8">
                            <View className="bg-gray-100 border-b border-gray-300">
                                <View className="flex-row">
                                    <View className="flex-1 p-3 border-r border-gray-300">
                                        <Text className="font-semibold text-gray-800">Category</Text>
                                    </View>
                                    <View className="flex-1 p-3 border-r border-gray-300">
                                        <Text className="font-semibold text-gray-800">Examples</Text>
                                    </View>
                                    <View className="flex-1 p-3">
                                        <Text className="font-semibold text-gray-800">Legal Basis</Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Table Rows */}
                            {[
                                {
                                    category: "Identity",
                                    examples: "Name, DOB, photo, ID docs, biometrics",
                                    basis: "Legal obligation, contract, legitimate interest"
                                },
                                {
                                    category: "Contact",
                                    examples: "Phone, email, address",
                                    basis: "Legal obligation"
                                },
                                {
                                    category: "Financial",
                                    examples: "Bank account, savings, loan records",
                                    basis: "Contract, legal obligation"
                                },
                                {
                                    category: "Transaction",
                                    examples: "Deposits, withdrawals, loans",
                                    basis: "Contract, legal obligation"
                                },
                                {
                                    category: "Content",
                                    examples: "Messages, survey responses, profile info",
                                    basis: "Consent, legitimate interest"
                                },
                                {
                                    category: "Marketing",
                                    examples: "Marketing Preferences",
                                    basis: "Consent, legitimate interest"
                                },
                                {
                                    category: "Behavioral",
                                    examples: "Usage patterns, inferred behavior",
                                    basis: "Consent, legitimate interest"
                                },
                                {
                                    category: "Technical",
                                    examples: "Login, IP, device type",
                                    basis: "Legitimate interest, legal obligation"
                                },
                                {
                                    category: "Device",
                                    examples: "Contact sync, device identifiers",
                                    basis: "Consent, legitimate interest"
                                }
                            ].map((row, index) => (
                                <View 
                                    key={index} 
                                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <View className="flex-row">
                                        <View className="flex-1 p-3 border-r border-gray-200">
                                            <Text className="font-medium text-gray-800">{row.category}</Text>
                                        </View>
                                        <View className="flex-1 p-3 border-r border-gray-200">
                                            <Text className="text-sm text-gray-700">{row.examples}</Text>
                                        </View>
                                        <View className="flex-1 p-3">
                                            <Text className="text-sm text-gray-700">{row.basis}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Section 5: How We Use Your Personal Data */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            5. How We Use Your Personal Data
                        </Text>
                        
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            5.1 Payment Processing
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Used to process transactions, including deposits, withdrawals, 
                            loans, and transfers. Sensitive data (bank account or card numbers) 
                            is never exposed without your consent.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            5.2 Identity Verification
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            Used to authenticate members, prevent fraud, and comply with 
                            KYC/AML regulations. Third-party verification may be used with consent.
                        </Text>

                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            5.3 Marketing Communication
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            You can opt out or modify marketing preferences anytime through 
                            the app or by contacting support.
                        </Text>
                    </View>

                    {/* Section 6: Data Sharing */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            6. Data Sharing
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            We may share your personal data with:
                        </Text>
                        <View className="ml-4 mb-4">
                            {[
                                "Regulatory authorities for legal compliance",
                                "Partner banks and financial institutions for transaction processing",
                                "Third-party service providers for operational or technical services",
                                "Law enforcement when required by law"
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
                            We ensure that all third parties adhere to privacy and security standards.
                        </Text>
                    </View>

                    {/* Section 7: Data Retention */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            7. Data Retention
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            • Personal data is retained only as long as necessary for the 
                            purposes collected or as required by law.
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            • Transaction history, identity verification, and financial 
                            records may be retained for regulatory and auditing purposes.
                        </Text>
                    </View>

                    {/* Section 8: Data Security */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            8. Data Security
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            We implement industry-standard security measures including 
                            encryption, access control, and secure storage. All personal 
                            data is protected against unauthorized access, alteration, 
                            disclosure, or destruction.
                        </Text>
                    </View>

                    {/* Section 9: Cookies Policy */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            9. Cookies Policy
                        </Text>
                        <View className="ml-4">
                            <View className="flex-row items-start mb-2">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                    Cookies may be used to improve Platform functionality and track user behavior.
                                </Text>
                            </View>
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1 leading-relaxed">
                                    Users may disable cookies via browser settings, though some services may be limited.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 10: Changes to this Privacy Policy */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            10. Changes to this Privacy Policy
                        </Text>
                        <Text className="text-base text-gray-700 leading-relaxed">
                            VSave may update this Privacy Policy. Updates will be posted on 
                            this page and, where applicable, notified through email or in-app 
                            notifications. Continued use after changes constitutes acceptance.
                        </Text>
                    </View>

                    {/* Section 11: Contact Us */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-4">
                            11. Contact Us
                        </Text>
                        <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                            For any questions about this Privacy Policy:
                        </Text>
                        <View className="ml-4 space-y-2">
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Email:</Text> dpo@vsave.coop
                                </Text>
                            </View>
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Phone:</Text> 01-800-VSAVE (01-800-87283)
                                </Text>
                            </View>
                            <View className="flex-row items-start">
                                <Text className="text-gray-600 mr-2">•</Text>
                                <Text className="text-base text-gray-700 flex-1">
                                    <Text className="font-semibold">Address:</Text> 14 Adebola Adebayo, By Afolabi Bus stop, Igando-Iyana Iba, Lagos, Nigeria
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Acceptance Footer */}
                    <View className="mt-8 pt-6 border-t border-gray-200">
                        <Text className="text-center text-sm text-gray-500">
                            By using VSave, you acknowledge that you have read,
                            understood, and agree to be bound by this Privacy & Cookie Policy.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}