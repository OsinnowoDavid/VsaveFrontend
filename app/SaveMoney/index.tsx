import React, { Component } from 'react'
import { Text, View ,TouchableOpacity} from 'react-native'
import SavingsCard from '../../components/Savings'
import HomeScreenWrapper from '../../components/HomeScreenWrapper'
import { ArrowRight } from "lucide-react-native"; 
import { router } from 'expo-router';
export class index extends Component {
  render() {
    return (
      <View>
        <HomeScreenWrapper>

        <SavingsCard />
          <View className="absolute top-[215px]  w-[320px] h-[76px] p-4 flex-col space-y-2 mt-5 justify-center" >
      {/* Inner Card */}
      <View className="w-[330px] h-[44px] flex-row items-center justify-between px-4 py-1.5 bg-white rounded shadow">
        {/* Left Section */}
        <View className="flex-row items-center space-x-2">
          {/* Icon Placeholder */}
          <View className="w-8 h-8 rounded-full bg-gradient-to-b from-[#5D8A1B52] to-[#18240770] flex items-center justify-center">
            {/* replace with actual icon/gradient illustration */}
            <View className="w-6 h-6 rounded-full bg-pink-400" />
          </View>

          {/* Texts */}
          <View>
            <Text className="text-[12px] font-medium text-[#212121]">
              Active Plan
            </Text>
            <Text className="text-[10px] text-[#5C5A5A]">
              6 Ongoing plans
            </Text>
          </View>
        </View>

        {/* Right Section */}
        <TouchableOpacity className="flex-row items-center space-x-1" onPress={()=> router.push('/activeSavingsPlan')}>
          <Text className="text-[10px] text-[#1B8A52]">View all</Text>
          <ArrowRight size={16} color="#1B8A52" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
        </HomeScreenWrapper>
        

      </View>
    )
  }
}

export default index
