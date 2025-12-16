import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'

const { width: screenWidth } = Dimensions.get('window')
const ITEM_WIDTH = screenWidth * 0.8 // 80% of screen width
const ITEM_SPACING = 10

const CompactCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // Sample data - replace with your actual data
  const carouselData = [
    { id: '1', image: require("../assets/images/save.jpg"), title: "Save and meet your financial goals " },
    { id: '2', image: require("../assets/images/loan.jpg"), title: "Easy access to loan" },
    { id: '3', image: require("../assets/images/Lottery.jpg"), title: "Pay for lottery terminal" },
    { id: '4', image: require("../assets/images/airtime.jpg"), title: "Buy airtime and data bundle " },
    // { id: '5', image: require("../assets/images/coin.jpg"), title: "Polkadot" },
  ]

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <View 
        className="relative overflow-hidden rounded-xl "
        style={{
          width: ITEM_WIDTH,
          marginHorizontal: ITEM_SPACING / 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginBottom:5
        }}
      >
        <Image 
          source={item.image} 
          resizeMode="stretch"
          className="w-full h-36"
        />
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20" />
        
        {/* Number Overlay */}
      
        
        {/* Title Overlay */}
        <View className="absolute bottom-4 left-4">
          <Text className="text-white text-xl font-bold">{item.title}</Text>
        </View>
      </View>
    )
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / (ITEM_WIDTH + ITEM_SPACING))
    setActiveIndex(index)
  }

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
    setActiveIndex(index)
  }

  return (
    <View className="mb-11">
      {/* Main Carousel */}
      <FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2 - ITEM_SPACING,
        }}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-4">
        {carouselData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            className={`mx-1 rounded-full ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
            style={{ width: activeIndex === index ? 20 : 8, height: 8 }}
          />
        ))}
      </View>

      {/* Active Slide Indicator */}
      <View className="mt-2">
        <Text className="text-center text-gray-600">
          {activeIndex + 1} of {carouselData.length}
        </Text>
      </View>
    </View>
  )
}

export default CompactCarousel