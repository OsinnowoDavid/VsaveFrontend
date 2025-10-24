import {
    Bell,
    FileText,
    Fingerprint,
    HelpCircle,
    Lock,
    Shield,
    User,
} from "lucide-react-native";

export const accountItems = [
    {
        icon: User,
        label: "Account",
        screen: "/menu/account",
        type: "navigation",
    },
    {
        icon: Lock,
        label: "Reset Password",
        screen: "/menu/reset-password",
        type: "navigation",
    },
    {
        icon: Fingerprint,
        label: "Biometrics",
        type: "switch",
    },
    {
        icon: Bell,
        label: "Notifications",
        screen: "/menu/notifications",
        type: "navigation",
    },
];

export const supportItems = [
    {
        icon: Shield,
        label: "Privacy",
        screen: "/menu/privacy",
        type: "navigation",
    },
    {
        icon: HelpCircle,
        label: "Help & Support",
        screen: "/menu",
        type: "navigation",
    },
    {
        icon: FileText,
        label: "Terms and Policies",
        screen: "/menu/terms&policies",
        type: "navigation",
    },
];
