import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function KeyboardAvoidingWrapper({
    children,
    modal = false,
}: {
    children: React.ReactNode;
    modal?: boolean;
}) {
    if (Platform.OS === "android") {
        if (!modal) {
            return (
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </KeyboardAwareScrollView>
            );
        } else {
            // Use KeyboardAvoidingView for modal-like forms that stick to the bottom
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
        }
    } else {
        // Use KeyboardAwareScrollView for full-page scrollable forms
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </KeyboardAwareScrollView>
        );
    }
}
