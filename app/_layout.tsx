import { Stack } from "expo-router";
import '../global.css';


export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} >


    <Stack.Screen name="airtime" options={{ headerShown: false }} />
    <Stack.Screen name="auth/login" options={{ headerShown: false }} />
    <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
    <Stack.Screen name="home" options={{ headerShown: false }} />
    <Stack.Screen name="SendMoney" options={{ headerShown: false }} />
    <Stack.Screen name="data" options={{ headerShown: false }} />
    <Stack.Screen name="SaveMoney" options={{ headerShown: false }} />
    <Stack.Screen name="activeSavingsPlan/index" options={{ headerShown: false }} />
  </Stack>;
}
