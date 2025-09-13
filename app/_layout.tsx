import { Stack } from "expo-router";
import "../src/global.css";
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
