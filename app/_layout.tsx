import { Stack } from "expo-router";
import '../global.css';


export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} >


    <Stack.Screen name="airtime" options={{ headerShown: false }} />\
    <Stack.Screen name="data" options={{ headerShown: false }} />
  </Stack>;
}
