import {
    Bell,
    FileText,
    Fingerprint,
    HelpCircle,
    Lock,
    Shield,
    User,
} from "lucide-react-native";
import { MenuItem } from "../components/MenuListItem";

export const accountItems: MenuItem[] = [
    {
        label: "Account",
        icon: User,
        type: "navigation",
        screen: "/menu/account",
    },
    {
        label: "Reset Password",
        icon: Lock,
        type: "navigation",
        screen: "/menu/reset-password",
    },
    {
        label: "Biometrics",
        icon: Fingerprint,
        type: "switch",
    },
    {
        label: "Notifications",
        icon: Bell,
        type: "navigation",
        screen: "/menu/notifications",
    },
];

export const supportItems: MenuItem[] = [
    {
        label: "Privacy",
        icon: Shield,
        type: "navigation",
        screen: "/menu/privacy",
    },
    {
        label: "Help & Support",
        icon: HelpCircle,
        type: "navigation",
        screen: "/menu",
    },
    {
        label: "Terms and Policies",
        icon: FileText,
        type: "navigation",
        screen: "/menu/terms&policies",
    },
];
