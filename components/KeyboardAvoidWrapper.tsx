import { KeyboardAvoidingView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function KeyboardAvoidingWrapper({ children }) {
  if (Platform.OS === "android") {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          alignItems: "flex-end",
          flexGrow: 1,
        }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        horizontal
      >
        {children}
      </KeyboardAwareScrollView>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          margin: 0,
          borderWidth: 0,
          width: "100%",
        }}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }
}
