import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
type Props = {
    children: React.ReactNode;
    bg?: string;
}

const ScreenWrapper = ({children,bg}:Props) => {
    const {top} = useSafeAreaInsets();
  const paddingTop = top>0? top+5:30;
  return (
    <View style={[styles.wrapper, { backgroundColor: bg, paddingTop }]}>
    {children}
  </View>
    
  )
}
const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 16, // Ensure padding is defined
      
    },
  })
export default ScreenWrapper