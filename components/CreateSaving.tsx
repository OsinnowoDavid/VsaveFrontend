import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React from 'react'
import FormField from './FormField'
import { useState } from 'react'
import PickFutureDate from './PickFutureDate'
import { CreateSavings } from '../services/CreateSavings'

const CreateSaving = () => {
    const [selectedFrequency, setSelectedFrequency] = useState('DAILY')
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // For weekly: selected days of week (array)
    const [selectedWeekDays, setSelectedWeekDays] = useState([])
    // For monthly: selected day of month (single number)
    const [selectedMonthDay, setSelectedMonthDay] = useState(1)

    const [formData, setFormData] = useState({
        startDate: new Date(),
        savingsTitle: '',
        targetAmount: '',
        duration: '', // Duration in frequency units (days/weeks/months)
    })

    const frequencies = [
        { label: 'Daily', value: 'DAILY' },
        { label: 'Weekly', value: 'WEEKLY' }, 
        { label: 'Monthly', value: 'MONTHLY' }
    ]

    const weekDays = [
        { label: 'Mon', value: 'MONDAY', full: 'Monday' },
        { label: 'Tue', value: 'TUESDAY', full: 'Tuesday' },
        { label: 'Wed', value: 'WEDNESDAY', full: 'Wednesday' },
        { label: 'Thu', value: 'THURSDAY', full: 'Thursday' },
        { label: 'Fri', value: 'FRIDAY', full: 'Friday' },
        { label: 'Sat', value: 'SATURDAY', full: 'Saturday' },
        { label: 'Sun', value: 'SUNDAY', full: 'Sunday' }
    ]

    const monthDays = Array.from({ length: 28 }, (_, i) => i + 1) // 1st to 28th

    const handleChange = (field, value) => {
        console.log(`Field changed: ${field}`, value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFrequencyChange = (frequency) => {
        console.log('Frequency changed:', frequency);
        setSelectedFrequency(frequency);
        // Reset deduction selections when frequency changes
        setSelectedWeekDays([])
        setSelectedMonthDay(1)
    }

    const handleWeekDayToggle = (dayValue) => {
        setSelectedWeekDays(prev => {
            const newSelection = prev.includes(dayValue)
                ? prev.filter(d => d !== dayValue)
                : [...prev, dayValue]
            console.log('Selected week days updated:', newSelection);
            return newSelection
        })
    }

    const handleMonthDaySelect = (day) => {
        console.log('Month day selected:', day);
        setSelectedMonthDay(day)
    }

    const getDurationLabel = () => {
        switch(selectedFrequency) {
            case 'DAILY':
                return 'Duration (in days)'
            case 'WEEKLY':
                return 'Duration (in weeks)'
            case 'MONTHLY':
                return 'Duration (in months)'
            default:
                return 'Duration'
        }
    }

    const getDurationPlaceholder = () => {
        switch(selectedFrequency) {
            case 'DAILY':
                return 'e.g., 30 for 30 days'
            case 'WEEKLY':
                return 'e.g., 12 for 12 weeks'
            case 'MONTHLY':
                return 'e.g., 6 for 6 months'
            default:
                return 'Enter duration'
        }
    }

    const getDurationUnit = () => {
        switch(selectedFrequency) {
            case 'DAILY':
                return 'days'
            case 'WEEKLY':
                return 'weeks'
            case 'MONTHLY':
                return 'months'
            default:
                return ''
        }
    }

    const getDeductionPeriodText = () => {
        switch(selectedFrequency) {
            case 'WEEKLY':
                if (selectedWeekDays.length === 0) return 'Select days'
                const selectedDays = weekDays
                    .filter(day => selectedWeekDays.includes(day.value))
                    .map(day => day.label)
                    .join(', ')
                return selectedDays.length > 20 ? selectedDays.substring(0, 20) + '...' : selectedDays
            case 'MONTHLY':
                return `Day ${selectedMonthDay} of each month`
            default:
                return ''
        }
    }

    const validateForm = () => {
        console.log('Validating form with data:', formData);
        console.log('Selected frequency:', selectedFrequency);

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
            Alert.alert('Error', `Please enter savings duration in ${getDurationUnit()}`)
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
            Alert.alert('Error', `Please enter a valid duration (minimum 1 ${getDurationUnit().slice(0, -1)})`)
            return false
        }

        // Set maximum durations
        if (selectedFrequency === 'WEEKLY' && duration > 52) {
            Alert.alert('Error', 'Weekly savings cannot exceed 52 weeks (1 year)')
            return false
        }

        if (selectedFrequency === 'MONTHLY' && duration > 12) {
            Alert.alert('Error', 'Monthly savings cannot exceed 12 months (1 year)')
            return false
        }

        // Validate deduction days for WEEKLY and MONTHLY
        if (selectedFrequency === 'WEEKLY') {
            if (selectedWeekDays.length === 0) {
                Alert.alert('Error', 'Please select at least one day of the week for deductions')
                return false
            }
        }

        if (selectedFrequency === 'MONTHLY') {
            if (!selectedMonthDay || selectedMonthDay < 1 || selectedMonthDay > 28) {
                Alert.alert('Error', 'Please select a valid day of the month (1st to 28th)')
                return false
            }
        }

        // Only validate start date for WEEKLY and MONTHLY frequencies
        if (selectedFrequency !== 'DAILY') {
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
        if (!formData.duration) return null
        
        // For daily, start from today; for others, use selected start date
        const start = selectedFrequency === 'DAILY' ? new Date() : new Date(formData.startDate)
        const duration = parseInt(formData.duration)
        const endDate = new Date(start)
        
        switch(selectedFrequency) {
            case 'DAILY':
                endDate.setDate(start.getDate() + duration)
                break
            case 'WEEKLY':
                endDate.setDate(start.getDate() + (duration * 7))
                break
            case 'MONTHLY':
                endDate.setMonth(start.getMonth() + duration)
                break
            default:
                break
        }
        
        return endDate
    }

    const calculateTotalDays = () => {
        if (!formData.duration) return 0
        
        const duration = parseInt(formData.duration)
        
        switch(selectedFrequency) {
            case 'DAILY':
                return duration
            case 'WEEKLY':
                return duration * 7
            case 'MONTHLY':
                // Approximate months to days (30 days per month)
                return duration * 30
            default:
                return duration
        }
    }

    const handleSubmission = async () => {
        console.log('=== FORM SUBMISSION STARTED ===');
        console.log('Current form data:', formData);
        console.log('Selected frequency:', selectedFrequency);
        console.log('Selected week days:', selectedWeekDays);
        console.log('Selected month day:', selectedMonthDay);
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

            // For daily frequency, use today's date
            const isDaily = selectedFrequency === 'DAILY'
            
            // Calculate total days for backend (convert weeks/months to days)
            const totalDays = calculateTotalDays()
            
            // Format deduction period for backend
            let deductionPeriod = ''
            if (selectedFrequency === 'WEEKLY') {
                deductionPeriod = selectedWeekDays.join(',') // e.g., "MONDAY,TUESDAY"
            } else if (selectedFrequency === 'MONTHLY') {
                deductionPeriod = selectedMonthDay.toString() // e.g., "15"
            }
            
            // Log the deduction period value
            console.log('=== DEDUCTION PERIOD VALUE ===');
            console.log('deductionPeriod:', deductionPeriod);
            console.log('Type:', typeof deductionPeriod);
            console.log('Length:', deductionPeriod.length);
            
            const submissionData = {
                savingsTitle: formData.savingsTitle.trim(),
                frequency: selectedFrequency,
                duration: totalDays, // Send total days to backend
                deductionPeriod: deductionPeriod,
                savingsAmount: parsedAmount,
                startDate: isDaily ? formatDateForBackend(new Date()) : formatDateForBackend(formData.startDate),
                autoRestartEnabled: false
            }

            console.log('=== FINAL SUBMISSION DATA FOR BACKEND ===');
            console.log('Submitting savings goal:', JSON.stringify(submissionData, null, 2));
            console.log('Formatted start date:', submissionData.startDate);
            console.log('Duration in days:', totalDays);
            console.log('Deduction period being sent:', submissionData.deductionPeriod);
            console.log('Deduction period value check:', submissionData.deductionPeriod === '' ? 'Empty string' : submissionData.deductionPeriod);

            // API call
            console.log('Calling CreateSavings service with data:', submissionData);
            const response = await CreateSavings(submissionData)
            console.log("SAVINGS RESPONSE", response);

            console.log('Submission successful!');
            
            // Create success message with deduction info
            let deductionInfo = ''
            if (selectedFrequency === 'WEEKLY') {
                const dayNames = weekDays
                    .filter(day => selectedWeekDays.includes(day.value))
                    .map(day => day.full)
                    .join(', ')
                deductionInfo = `\nDeduction Days: ${dayNames}`
            } else if (selectedFrequency === 'MONTHLY') {
                const suffix = selectedMonthDay === 1 ? 'st' : 
                              selectedMonthDay === 2 ? 'nd' : 
                              selectedMonthDay === 3 ? 'rd' : 'th'
                deductionInfo = `\nDeduction Day: ${selectedMonthDay}${suffix} of each month`
            }
            
            Alert.alert(
                'Success!',
                `Your savings goal has been created successfully!\n\n${formData.savingsTitle}\nAmount: ₦${parsedAmount.toLocaleString()}\nFrequency: ${selectedFrequency}\nDuration: ${duration} ${getDurationUnit()}${deductionInfo}${!isDaily ? `\nStart Date: ${formatDateForBackend(formData.startDate)}` : ''}`,
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
            setSelectedFrequency('DAILY')
            setSelectedWeekDays([])
            setSelectedMonthDay(1)
            console.log('Form reset complete');

        } catch (error) {
            console.error('Submission error:', error)
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            })
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
    const isDaily = selectedFrequency === 'DAILY'
    const totalDays = calculateTotalDays()
    const deductionPeriodText = getDeductionPeriodText()

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-6 pt-10 pb-6">
                <Text className="text-3xl font-bold text-center text-[#1B8A52] mb-2">
                    Create Savings Plan
                </Text>
                <Text className="text-gray-600 text-center">
                    Set up your personalized savings goal
                </Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-5">
                {/* White Form Card */}
                <View className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
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
                            label="Savings Amount (₦)"
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

                    {/* Duration - Dynamic based on frequency */}
                    <View className="mt-6">
                        <FormField
                            label={getDurationLabel()}
                            placeholder={getDurationPlaceholder()}
                            onChangeText={(text) => handleChange('duration', text)}
                            value={formData.duration}
                            type="text"
                            keyboardType="numeric"
                        />
                        <Text className="text-sm text-gray-500 mt-2 ml-1">
                            {selectedFrequency === 'DAILY' && 'How many days will you be saving?'}
                            {selectedFrequency === 'WEEKLY' && 'How many weeks will you be saving?'}
                            {selectedFrequency === 'MONTHLY' && 'How many months will you be saving?'}
                        </Text>
                    </View>
                </View>

                {/* Green Frequency Card */}
                <View className="bg-[#1B8A52] rounded-2xl p-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-6">
                        Savings Frequency
                    </Text>
                    
                    {/* Frequency Buttons */}
                    <View className="flex-row justify-between mb-8">
                        {frequencies.map((frequency) => (
                            <TouchableOpacity
                                key={frequency.value}
                                className={`flex-1 mx-1 py-4 rounded-xl ${isSubmitting ? 'opacity-50' : ''} ${
                                    selectedFrequency === frequency.value
                                        ? 'bg-white'
                                        : 'bg-white/10 border border-white/20'
                                }`}
                                onPress={() => handleFrequencyChange(frequency.value)}
                                disabled={isSubmitting}
                            >
                                <Text
                                    className={`text-center font-semibold ${
                                        selectedFrequency === frequency.value
                                            ? 'text-[#1B8A52]'
                                            : 'text-white'
                                    }`}
                                >
                                    {frequency.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Deduction Period - Only show for WEEKLY and MONTHLY */}
                    {!isDaily && (
                        <View className="mb-8">
                            <Text className="text-white text-lg font-semibold mb-4">
                                Deduction Period
                            </Text>
                            <Text className="text-white/80 text-sm mb-3">
                                {selectedFrequency === 'WEEKLY' 
                                    ? 'Select which days of the week to deduct savings'
                                    : 'Select which day of the month to deduct savings'}
                            </Text>
                            
                            {selectedFrequency === 'WEEKLY' ? (
                                // Weekly: Days of week selection
                                <View className="flex-row justify-between mb-2">
                                    {weekDays.map((day) => (
                                        <TouchableOpacity
                                            key={day.value}
                                            className={`w-10 h-10 rounded-full justify-center items-center ${isSubmitting ? 'opacity-50' : ''} ${
                                                selectedWeekDays.includes(day.value)
                                                    ? 'bg-white'
                                                    : 'bg-white/10 border border-white/20'
                                            }`}
                                            onPress={() => handleWeekDayToggle(day.value)}
                                            disabled={isSubmitting}
                                        >
                                            <Text
                                                className={`font-medium ${
                                                    selectedWeekDays.includes(day.value)
                                                        ? 'text-[#1B8A52]'
                                                        : 'text-white'
                                                }`}
                                            >
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                // Monthly: Days of month selection (1st to 28th)
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    className="mb-2"
                                >
                                    <View className="flex-row flex-wrap gap-2 justify-center">
                                        {monthDays.map((day) => (
                                            <TouchableOpacity
                                                key={day}
                                                className={`w-12 h-12 rounded-lg justify-center items-center ${isSubmitting ? 'opacity-50' : ''} ${
                                                    selectedMonthDay === day
                                                        ? 'bg-white'
                                                        : 'bg-white/10 border border-white/20'
                                                }`}
                                                onPress={() => handleMonthDaySelect(day)}
                                                disabled={isSubmitting}
                                            >
                                                <Text
                                                    className={`font-medium ${
                                                        selectedMonthDay === day
                                                            ? 'text-[#1B8A52]'
                                                            : 'text-white'
                                                    }`}
                                                >
                                                    {day}
                                                </Text>
                                                <Text className={`text-xs ${
                                                    selectedMonthDay === day
                                                        ? 'text-[#1B8A52]'
                                                        : 'text-white/70'
                                                }`}>
                                                    {day === 1 ? 'st' : 
                                                     day === 2 ? 'nd' : 
                                                     day === 3 ? 'rd' : 'th'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            )}
                            
                            {/* Selected deduction period summary */}
                            {deductionPeriodText && (
                                <View className="bg-white/10 rounded-lg p-3 mt-3">
                                    <Text className="text-white text-center text-sm">
                                        {deductionPeriodText}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Start Date Section - Only show for WEEKLY and MONTHLY */}
                    {!isDaily ? (
                        <View className="space-y-4">
                            {/* Start Date Picker */}
                            <View>
                                <Text className="text-white text-lg font-semibold mb-2">Start Date</Text>
                                <Text className="text-white/80 text-sm mb-3">
                                    When would you like to start saving?
                                </Text>
                                
                                <PickFutureDate
                                    label='Select start date'
                                    value={formData.startDate}
                                    onChange={(date) => {
                                        console.log('Date selected from picker:', date);
                                        handleChange('startDate', date);
                                    }}
                                    minimumDate={new Date()}
                                />
                            </View>

                            {/* Timeline Display */}
                            {endDate && formData.duration && (
                                <View className="bg-white/10 rounded-xl p-4 mt-4">
                                    <Text className="text-white font-bold text-center mb-3">
                                        Savings Timeline
                                    </Text>
                                    <View className="flex-row justify-between">
                                        <View className="items-center">
                                            <Text className="text-white/80 text-xs mb-1">Start Date</Text>
                                            <Text className="text-white font-semibold">
                                                {formData.startDate.toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View className="items-center justify-center">
                                            <Text className="text-white text-lg">→</Text>
                                        </View>
                                        <View className="items-center">
                                            <Text className="text-white/80 text-xs mb-1">End Date</Text>
                                            <Text className="text-white font-semibold">
                                                {endDate.toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-white/80 text-xs text-center mt-3">
                                        Total Duration: {formData.duration} {getDurationUnit()} ({totalDays} days)
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        // Daily Frequency Info
                        formData.duration && (
                            <View className="bg-white/10 rounded-xl p-4 mt-4">
                                <Text className="text-white font-bold text-center mb-2">
                                    Daily Savings Plan
                                </Text>
                                <Text className="text-white/90 text-center text-sm">
                                    Your savings will start immediately and continue for {formData.duration} days
                                </Text>
                                {endDate && (
                                    <Text className="text-white/80 text-xs text-center mt-2">
                                        Savings will be completed on: {endDate.toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        )
                    )}
                </View>

                {/* Create Button */}
                <TouchableOpacity 
                    className={`rounded-xl py-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#1B8A52]'}`}
                    onPress={handleSubmission}
                    disabled={isSubmitting}
                    style={{
                        shadowColor: '#1B8A52',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                    }}
                >
                    <Text className="text-white text-center text-lg font-bold">
                        {isSubmitting ? 'Creating...' : 'Create Savings Plan'}
                    </Text>
                </TouchableOpacity>

                {/* Info Note */}
                {/* <View className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
                    <Text className="text-blue-800 text-sm font-semibold mb-1">
                        💡 How it works:
                    </Text>
                    <Text className="text-blue-700 text-xs">
                        {isDaily 
                            ? "For daily savings, your plan starts immediately with automatic daily deductions at noon."
                            : selectedFrequency === 'WEEKLY'
                            ? "For weekly savings, select which days of the week you want deductions to occur. You can select multiple days."
                            : "For monthly savings, select which day of the month (1st to 28th) you want deductions to occur."
                        }
                    </Text>
                </View> */}
            </View>
        </ScrollView>
    )
}

export default CreateSaving