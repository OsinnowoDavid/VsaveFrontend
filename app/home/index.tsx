import { useRouter } from "expo-router";
import { Bell, Send, UserCircleIcon } from "lucide-react-native";
import { Image, StatusBar, Text, View, ScrollView } from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import NavButton from "../../components/NavButton";
import Ballance from "../../components/Ballance";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <HomeScreenWrapper bgColor="bg-[#f5f5f5]">
      <StatusBar barStyle="dark-content" />

      {/* 👇 Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }} // so last item isn't cut off
      >
        <View className="mt-6 w-[95%] mx-auto bg-[#f5f5f5]">
          {/* Header */}
          <View className="flex flex-row justify-between pe-3">
            <Text className="font-medium text-2xl px-2">Welcome, David</Text>
            <View className="flex flex-row gap-5">
              <UserCircleIcon color={"#1B8A52"} />
              <Bell color={"#1B8A52"} />
            </View>
          </View>

          <Ballance />

          {/* Quick Actions */}
          <View className="mt-8">
            <Text className="text-2xl font-semibold mb-4">Quick Actions</Text>
            <View className="flex flex-row flex-wrap justify-between gap-y-4">
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="Send"
                onPress={() => {}}
                icon
                iconType="component"
                iconComponent={<Send color="#1B8A52" />}
                width="w-[30%]"
              />
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="Add Money"
                onPress={() => router.push("/sendMoney")}
                icon
                iconType="component"
                iconComponent={<Send />}
                width="w-[30%]"
              />
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="save"
                onPress={() => router.push("/SaveMoney")}
                icon
                iconType="component"
                iconComponent={<Send />}
                width="w-[30%]"
              />
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="Airtime"
                onPress={() => router.push("/airtime")}
                icon
                iconType="component"
                iconComponent={<Send />}
                width="w-[30%]"
              />
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="Data"
                onPress={() => router.push("/data")}
                icon
                iconType="component"
                iconComponent={<Send />}
                width="w-[30%]"
              />
              <NavButton
                border="border-[0.01px]"
                bg="bg-[rgba(27,138,82,0.2)]"
                input="Quick Loan"
                onPress={() => router.push("/sendMoney")}
                icon
                iconType="component"
                iconComponent={<Send />}
                width="w-[30%]"
              />
            </View>
          </View>

          {/* Recent Transactions */}
          <View className="mt-8">
            <View className="mb-4 flex flex-row justify-between">
              <Text className="text-xl font-semibold">Recent transactions</Text>
              <Text className="text-[#1B8A52] text-[16px]">See all</Text>
            </View>
            <View className="bg-white h-44 rounded-xl"></View>
          </View>
        </View>
      </ScrollView>
    </HomeScreenWrapper>
  );
}
