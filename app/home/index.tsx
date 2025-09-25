import { Bell, Send, UserCircleIcon } from "lucide-react-native";
import { Image, StatusBar, Text, View } from "react-native";
import HomeScreenWrapper from "../../components/HomeScreenWrapper";
import NavButton from "../../components/NavButton";

export default function Home() {
  return (
    <HomeScreenWrapper bgColor="bg-[#f5f5f5]">
      <StatusBar barStyle="dark-content" />
      <View className="mt-6 w-[95%] mx-auto bg-[#f5f5f5]">
        <View className="flex flex-row justify-between pe-3">
          <Text className="font-meduim text-2xl px-2">Welcome, David</Text>
          <View className="flex flex-row gap-5">
            <UserCircleIcon color={"#1B8A52"} />
            <Bell color={"#1B8A52"} />
          </View>
        </View>
        <View
          className="border-[0.01px] mt-5 h-36 rounded-2xl relative overflow-hidden"
          style={{
            backgroundColor: "rgba(27, 138, 82, 0.7)",
          }}
        >
          <View className="w-56 h-56 flex items-center justify-center rounded-full bg-[#f8f8f8] absolute -right-12 -top-6 z-0">
            <Image
              source={require("../../assets/images/transparent-logo.png")}
              className="w-24 h-24 opacity-40"
            />
          </View>
          <View
            className="mt-5 w-full h-40 rounded-2xl absolute -top-9 z-10 py-6 px-4 flex flex-col justify-between"
            style={{
              backgroundColor: "rgba(27, 138, 82, 0.7)",
            }}
          >
            <View>
              <Text className="text-white text-lg">Available Balance</Text>
            </View>
            <View>
              <Text className="text-white text-4xl tracking-tighter">
                N5000,000,000
              </Text>
            </View>
            <View>
              <Text className="text-[#EFEFEF] text-[16px]">
                Pending Balance N2,500,000
              </Text>
            </View>
          </View>
        </View>
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
              onPress={() => {}}
              icon
              iconType="component"
              iconComponent={<Send />}
              width="w-[30%]"
            />
            <NavButton
              border="border-[0.01px]"
              bg="bg-[rgba(27,138,82,0.2)]"
              input="Terminal"
              onPress={() => {}}
              icon
              iconType="component"
              iconComponent={<Send />}
              width="w-[30%]"
            />
            <NavButton
              border="border-[0.01px]"
              bg="bg-[rgba(27,138,82,0.2)]"
              input="Airtime"
              onPress={() => {}}
              icon
              iconType="component"
              iconComponent={<Send />}
              width="w-[30%]"
            />
            <NavButton
              border="border-[0.01px]"
              bg="bg-[rgba(27,138,82,0.2)]"
              input="Data"
              onPress={() => {}}
              icon
              iconType="component"
              iconComponent={<Send />}
              width="w-[30%]"
            />
            <NavButton
              border="border-[0.01px]"
              bg="bg-[rgba(27,138,82,0.2)]"
              input="Quick Loan"
              onPress={() => {}}
              icon
              iconType="component"
              iconComponent={<Send />}
              width="w-[30%]"
            />
          </View>
        </View>
        <View className="mt-8">
          <View className="mb-4 flex flex-row justify-between">
            <Text className="text-xl font-semibold">Recent transactions</Text>
            <Text className="text-[#1B8A52] text-[16px]">See all</Text>
          </View>
          <View className="bg-white h-44 rounded-xl"></View>
        </View>
      </View>
    </HomeScreenWrapper>
  );
}
