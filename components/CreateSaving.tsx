import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import FormField from './FormField'
import { useState } from 'react'

const CreateSaving = () => {
    const [selectedFrequency, setSelectedFrequency] = useState('Monthly')
    const [startDate, setStartDate] = useState('Nov 07, 2025')
    const [endDate, setEndDate] = useState('')

    const submit = async () => {
        // Submit logic
    }

    const handleChange = async () => {
        // Handle change logic
    }

    const frequencies = ['Daily', 'Weekly', 'Monthly']

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-6 pt-10 pb-6">
                <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Reach your finance goals with ease
                </Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-5">
                {/* White Form Card */}
                <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    {/* Target Name */}
                    <FormField
                        label="Target Name"
                        placeholder="My Savings Goal"
                        onChangeText={handleChange}
                        type="text"
                    />

                    {/* Target Category */}
                    <View className="mt-6">
                        <FormField
                            label="Target Category"
                            placeholder="Accommodation"
                            onChangeText={handleChange}
                            type="select"
                        />
                    </View>

                    {/* Target Amount */}
                    <View className="mt-6">
                        <FormField
                            label="Target Amount"
                            placeholder="Min: 1,000.00 - Max: 5,000,000.00"
                            onChangeText={handleChange}
                            type="text"
                        />
                        <Text className="text-sm text-gray-500 mt-2 ml-1">
                            What is the total amount you aim to save by the end of your target?
                        </Text>
                    </View>
                </View>

                {/* Black Frequency Card */}
                <View className="bg-[#1B8A52] rounded-2xl p-6 mb-6">
                    <Text className="text-white text-lg font-semibold mb-4">
                        Savings Frequency
                    </Text>
                    
                    {/* Frequency Buttons */}
                    <View className="flex-row justify-between mb-6">
                        {frequencies.map((frequency) => (
                            <TouchableOpacity
                                key={frequency}
                                className={`flex-1 mx-1 py-3 rounded-lg border ${
                                    selectedFrequency === frequency
                                        ? 'bg-white border-white'
                                        : 'bg-transparent border-gray-600'
                                }`}
                                onPress={() => setSelectedFrequency(frequency)}
                            >
                                <Text
                                    className={`text-center font-medium ${
                                        selectedFrequency === frequency
                                            ? 'text-black'
                                            : 'text-white'
                                    }`}
                                >
                                    {frequency}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Date Section */}
                    <View className="space-y-4">
                        {/* Start Date */}
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white text-sm mb-1">Set Start Date</Text>
                                <TouchableOpacity className="bg-gray-800 rounded-lg py-3 px-4">
                                    <Text className="text-white text-base">{startDate}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Start Today Button */}
                            <TouchableOpacity className="ml-3 bg-gray-700 rounded-lg py-3 px-4">
                                <Text className="text-white text-base">Start Today</Text>
                            </TouchableOpacity>
                        </View>

                        {/* End Date */}
                        <View>
                            <Text className="text-white text-sm mb-1">Set End Date</Text>
                            <Text className="text-gray-400 text-sm mb-2">
                                When is your savings target due?
                            </Text>
                            <TouchableOpacity className="bg-[#001B8A52] rounded-lg py-3 px-4">
                                <Text className="text-white text-base">
                                    {endDate || 'Select end date'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity 
                    className="bg-black rounded-2xl py-4 mb-8"
                    onPress={submit}
                >
                    <Text className="text-white text-center text-lg font-semibold">
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default CreateSaving