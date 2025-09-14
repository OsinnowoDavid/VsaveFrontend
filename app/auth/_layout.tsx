import { Stack } from "expo-router";
import '../../global.css';


export default function RootLayout() {
  return <Stack>

    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="onBoarding" options={{ headerShown: false }} />
    <Stack.Screen name="loginOrSign" options={{ headerShown: false }} />
  </Stack>
}
