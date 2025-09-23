import { useRouter } from "expo-router";
import ScreenWrapper from "../../../components/AuthScreenWrapper";
import Button from "../../../components/Button";
import FormWrapper from "../../../components/FormWrapper";
import PinInput from "../../../components/PinInput";

export default function PinCodeSetupScreen() {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <FormWrapper heading="Pin Code">
        <PinInput label="Enter Pin Code" textPosition="text-left" />
        <PinInput label="Confirm Pin Code" textPosition="text-left" />
        <Button
          input="Login"
          onPress={() => {
            router.push("/home");
          }}
        />
      </FormWrapper>
    </ScreenWrapper>
  );
}
