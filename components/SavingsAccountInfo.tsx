import { Text, View } from "react-native";
import Button from "./Button";
import useProfileStore from "../store/useProfileStore";


export default function SavingsAccountInfo() {
        const { profile } = useProfileStore(); // profile is { profile: ProfileDetails, kyc: KycDetails }

    return (
        <View className="mt-24 w-[90%] mx-auto">
            <Text className="text-3xl text-center mb-6 font-semibold">
                Vsave Information
            </Text>
            <View className="bg-[rgba(27,138,82,0.1)] p-6 flex justify-center items-center rounded-lg mb-8">
                <Text className="text-3xl text-gray-700 py-3">GT Bank</Text>
                <View>
                    <Text className="text-3xl font-semibold py-3">

                                                {profile?.profile?.virtualAccountNumber ?? "account number is  not  ready"}
                        
                    </Text>
                </View>
                <Text className="text-base text-gray-700 py-3">
GTBank is the bank linked to your account number. Kindly copy your account number, search for GTBank, and your name will appear                </Text>
            
            </View>

        </View>
    );
}
