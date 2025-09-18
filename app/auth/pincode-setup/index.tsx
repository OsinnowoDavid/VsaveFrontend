import { Text, View } from "react-native";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidWrapper";
import PinInput from "../../../components/PinInput";

export default function PinCodeSetupScreen() {
  return (
    <ScreenWrapper>
      <KeyboardAvoidingWrapper>
        <View className="px-6 py-8 bg-white w-full rounded-t-3xl">
          <Text className="text-2xl font-bold pb-4 mb-8 text-center border-b-[0.3px] border-gray-500">
            Pin Code
          </Text>
          <PinInput label="Enter Pin Code" textPosition="text-left" />
          <PinInput label="Confirm Pin Code" textPosition="text-left" />
          <Button input="Login" onPress={() => {}} />
        </View>
      </KeyboardAvoidingWrapper>
    </ScreenWrapper>
  );
}
