import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React from 'react'
import FormField from './FormField'
import { useState } from 'react'
import DatePickerField from './DatePickerField'
import PickFutureDate from './PickFutureDate'
import { CreateSavings } from '../services/CreateSavings'

const CreateSaving = () => {
    // FIXED: Changed from array to single string
    const [selectedFrequency, setSelectedFrequency] = useState('DAILY') // Now a single string
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deductionTime, setDeductionTime] = useState('12:00')

    const [formData, setFormData] = useState({
        startDate: new Date(),
        savingsTitle: '',
        targetAmount: '',
        duration: '', // in days
    })

    const frequencies = [
        { label: 'Daily', value: 'DAILY' },
        { label: 'Weekly', value: 'WEEKLY' }, 
        { label: 'Monthly', value: 'MONTHLY' }
    ]

    const deductionTimes = ['06:00', '09:00', '12:00', '15:00', '18:00']

    const handleChange = (field, value) => {
        console.log(`Field changed: ${field}`, value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFrequencyChange = (frequency) => {
        console.log('Frequency changed:', frequency);
        setSelectedFrequency(frequency); // Now setting a single string value
    }

    const handleDeductionTimeChange = (time) => {
        console.log('Deduction time changed:', time);
        setDeductionTime(time);
    }

    const validateForm = () => {
        console.log('Validating form with data:', formData);
        console.log('Selected frequency:', selectedFrequency);
        console.log('Deduction time:', deductionTime);

        // Check required fields
        if (!formData.savingsTitle || !formData.savingsTitle.trim()) {
            Alert.alert('Error', 'Please enter a savings title')
            return false
        }

        if (!formData.targetAmount) {
            Alert.alert('Error', 'Please enter a target amount')
            return false
        }

        if (!formData.duration) {
            Alert.alert('Error', 'Please enter savings duration in days')
            return false
        }

        // Validate amount format and range
        const cleanAmount = formData.targetAmount.replace(/,/g, '')
        const amount = parseFloat(cleanAmount)
        
        console.log('Cleaned amount string:', cleanAmount);
        console.log('Parsed amount:', amount);
        
        if (isNaN(amount) || !isFinite(amount)) {
            Alert.alert('Error', 'Please enter a valid amount')
            return false
        }

        if (amount < 1000 || amount > 5000000) {
            Alert.alert('Error', 'Amount must be between 1,000 and 5,000,000')
            return false
        }

        // Validate duration
        const duration = parseInt(formData.duration)
        if (isNaN(duration) || duration < 1) {
            Alert.alert('Error', 'Please enter a valid duration (minimum 1 day)')
            return false
        }

        // Validate start date - Allow today and future dates
        if (!formData.startDate || !(formData.startDate instanceof Date) || isNaN(formData.startDate.getTime())) {
            Alert.alert('Error', 'Please select a valid start date')
            return false
        }

        // Allow today's date and future dates, only block past dates
        const start = new Date(formData.startDate)
        const today = new Date()
        
        // Reset both dates to midnight for accurate day comparison
        const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        
        console.log('Start date (midnight):', startMidnight);
        console.log('Today (midnight):', todayMidnight);

        // Only block if start date is before today (past dates)
        if (startMidnight < todayMidnight) {
            Alert.alert('Error', 'Start date cannot be in the past')
            return false
        }

        console.log('Form validation passed');
        return true
    }

    const formatDateForBackend = (date) => {
        // Format as MM/DD/YYYY as per backend requirement
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
    }

    const calculateEndDate = () => {
        if (!formData.startDate || !formData.duration) return null
        
        const start = new Date(formData.startDate)
        const duration = parseInt(formData.duration)
        const endDate = new Date(start)
        endDate.setDate(start.getDate() + duration)
        return endDate
    }

    const handleSubmission = async () => {
        console.log('=== FORM SUBMISSION STARTED ===');
        console.log('Current form data:', formData);
        console.log('Selected frequency:', selectedFrequency);
        console.log('Deduction time:', deductionTime);
        console.log('Is submitting:', isSubmitting);

        if (isSubmitting) {
            console.log('Already submitting, returning...');
            return
        }

        if (!validateForm()) {
            console.log('Form validation failed');
            return
        }

        setIsSubmitting(true)
        console.log('Set isSubmitting to true');

        try {
            // Prepare data for backend submission
            const cleanAmount = formData.targetAmount.replace(/,/g, '')
            const parsedAmount = parseFloat(cleanAmount)
            const duration = parseInt(formData.duration)
            
            if (isNaN(parsedAmount) || !isFinite(parsedAmount)) {
                throw new Error('Invalid amount format')
            }

            if (isNaN(duration)) {
                throw new Error('Invalid duration format')
            }

            // FIXED: Now selectedFrequency is a single string, not an array
            const submissionData = {
                savingsTitle: formData.savingsTitle.trim(),
                frequency: selectedFrequency, // Now this is a single string value
                duration: duration,
                deductionPeriod: deductionTime,
                savingsAmount: parsedAmount,
                startDate: formatDateForBackend(formData.startDate),
                autoRestartEnabled: false
            }

            console.log('=== FINAL SUBMISSION DATA FOR BACKEND ===');
            console.log('Submitting savings goal:', JSON.stringify(submissionData, null, 2));
            console.log('Formatted start date:', submissionData.startDate);

            // API call
            const response = await CreateSavings(submissionData)
            console.log("SAVINGS RESPONSE",response);

            console.log('Submission successful!');
            Alert.alert(
                'Success!',
                `Your savings goal has been created successfully!\n\n${formData.savingsTitle}\nAmount: ₦${parsedAmount.toLocaleString()}\nFrequency: ${selectedFrequency}\nDuration: ${duration} days\nStart Date: ${formatDateForBackend(formData.startDate)}`,
                [{ text: 'OK' }]
            )

            // Reset form after successful submission
            console.log('Resetting form...');
            setFormData({
                savingsTitle: '',
                targetAmount: '',
                duration: '',
                startDate: new Date(),
            })
            setSelectedFrequency('DAILY') // Reset to single string
            setDeductionTime('12:00')
            console.log('Form reset complete');

        } catch (error) {
            console.error('Submission error:', error)
            Alert.alert(
                'Error',
                error.message || 'Failed to create savings goal. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
            console.log('Set isSubmitting to false');
        }
    }

    const endDate = calculateEndDate()

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-6 pt-10 pb-6">
                <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Create Savings Plan
                </Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-5">
                {/* White Form Card */}
                <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    {/* Savings Title */}
                    <FormField
                        label="Savings Title"
                        placeholder="Daily savings towards camp"
                        onChangeText={(text) => handleChange('savingsTitle', text)}
                        value={formData.savingsTitle}
                        type="text"
                    />

                    {/* Target Amount */}
                    <View className="mt-6">
                        <FormField
                            label="Savings Amount"
                            placeholder="Min: 1,000.00 - Max: 5,000,000.00"
                            onChangeText={(text) => handleChange('targetAmount', text)}
                            value={formData.targetAmount}
                            type="text"
                            keyboardType="numeric"
                        />
                        <Text className="text-sm text-gray-500 mt-2 ml-1">
                            How much do you want to save?
                        </Text>
                    </View>

                    {/* Duration in Days */}
                    <View className="mt-6">
                        <FormField
                            label="Duration (in days)"
                            placeholder="e.g., 30 for 30 days"
                            onChangeText={(text) => handleChange('duration', text)}
                            value={formData.duration}
                            type="text"
                            keyboardType="numeric"
                        />
                        <Text className="text-sm text-gray-500 mt-2 ml-1">
                            How many days will you be saving?
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
                                key={frequency.value}
                                className={`flex-1 mx-1 py-3 rounded-lg border ${
                                    selectedFrequency === frequency.value // Now comparing string to string
                                        ? 'bg-white border-white'
                                        : 'bg-transparent border-white'
                                }`}
                                onPress={() => handleFrequencyChange(frequency.value)}
                                disabled={isSubmitting}
                            >
                                <Text
                                    className={`text-center font-medium ${
                                        selectedFrequency === frequency.value
                                            ? 'text-black'
                                            : 'text-white'
                                    }`}
                                >
                                    {frequency.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Deduction Time */}
                    <View className="mb-6">
                        <Text className="text-white text-lg font-semibold mb-4">
                            Deduction Time
                        </Text>
                        <View className="flex-row justify-between">
                            {deductionTimes.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    className={`flex-1 mx-1 py-3 rounded-lg border ${
                                        deductionTime === time
                                            ? 'bg-white border-white'
                                            : 'bg-transparent border-white'
                                    }`}
                                    onPress={() => handleDeductionTimeChange(time)}
                                    disabled={isSubmitting}
                                >
                                    <Text
                                        className={`text-center font-medium ${
                                            deductionTime === time
                                                ? 'text-black'
                                                : 'text-white'
                                        }`}
                                    >
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date Section */}
                    <View className="space-y-4">
                        {/* Start Date Section */}
                        <View>
                            <Text className="text-white text-sm mb-1">Start Date</Text>
                            <Text className="text-gray-300 text-sm mb-2">
                                When would you like to start saving? (Today or future dates)
                            </Text>
                            
                            {/* Start Date Picker */}
                            <PickFutureDate
                                label='Select start date'
                                value={formData.startDate}
                                onChange={(date) => {
                                    console.log('Date selected from picker:', date);
                                    handleChange('startDate', date);
                                }}
                                minimumDate={new Date()} // This allows today and future dates
                            />
                            
                            {/* Display selected date for confirmation */}
                            <Text className="text-gray-300 text-xs mt-2 text-center">
                                Selected: {formData.startDate.toLocaleDateString()}
                            </Text>
                        </View>

                        {/* End Date Display */}
                        {endDate && (
                            <View className="bg-white/10 rounded-lg p-4 mt-4">
                                <Text className="text-white font-semibold text-center mb-2">
                                    Savings Timeline
                                </Text>
                                <Text className="text-white text-sm text-center">
                                    Start: {formData.startDate.toLocaleDateString()}
                                </Text>
                                <Text className="text-white text-sm text-center">
                                    End: {endDate.toLocaleDateString()}
                                </Text>
                                <Text className="text-gray-300 text-xs text-center mt-1">
                                    Duration: {formData.duration} days
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity 
                    className={`rounded-2xl py-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#1B8A52]'}`}
                    onPress={handleSubmission}
                    disabled={isSubmitting}
                >
                    <Text className="text-white text-center text-lg font-semibold">
                        {isSubmitting ? 'Creating...' : 'Create Savings Plan'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default CreateSaving