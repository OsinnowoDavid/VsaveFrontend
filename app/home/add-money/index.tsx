import { Send } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import HomeScreenWrapper from "../../../components/HomeScreenWrapper";
import NavButton from "../../../components/NavButton";
import SavingsAccountInfo from "../../../components/SavingsAccountInfo";

export default function AddMoney() {
    const ACTIVEBORDERSTYLE = "border-[1.5px] border-[#1B8A52]";
    const dedicatedAccount = {
        label: "Dedicated Account",
        component: <SavingsAccountInfo />,
    };
    const cashFunding = {
        label: "Cash Funding",
        component: <View />,
    };
    const companyAccountFunding = {
        label: "Company Account Funding",
        component: <View />,
    };
    const [activeTab, setActiveTab] = useState(dedicatedAccount);
    return (
        <HomeScreenWrapper showFooter={false}>
            <View className="mt-7 flex flex-row justify-around">
                {/* <NavButton
                    input="Dedicated Account"
                    onPress={() => {
                        setActiveTab(dedicatedAccount);
                    }}
                    iconComponent={<Send color="#1B8A52" />}
                    color="text-gray-700"
                    width="w-[30%]"
                    border={
                        activeTab.label === dedicatedAccount.label
                            ? ACTIVEBORDERSTYLE
                            : ""
                    }
                    bg="bg-[rgba(27,138,82,0.1)]"
                />
                <NavButton
                    input="Cash Funding"
                    onPress={() => {
                        setActiveTab(cashFunding);
                    }}
                    iconType="image"
                    source={require("../../../assets/icons/money-add.png")}
                    alt="add money via cash"
                    color="text-gray-700"
                    width="w-[30%]"
                    border={
                        activeTab.label === cashFunding.label
                            ? ACTIVEBORDERSTYLE
                            : ""
                    }
                    bg="bg-[rgba(27,138,82,0.1)]"
                />
                <NavButton
                    input="Company Account Funding"
                    onPress={() => {
                        setActiveTab(companyAccountFunding);
                    }}
                    iconType="image"
                    source={require("../../../assets/icons/money-bunch.png")}
                    alt="add money via company account"
                    color="text-gray-700"
                    width="w-[30%]"
                    border={
                        activeTab.label === companyAccountFunding.label
                            ? ACTIVEBORDERSTYLE
                            : ""
                    }
                    bg="bg-[rgba(27,138,82,0.1)]"
                /> */}
            </View>
            {activeTab.component}
        </HomeScreenWrapper>
    );
}
