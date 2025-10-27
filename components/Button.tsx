import { ActivityIndicator, Pressable, Text } from "react-native";

interface ButtonProps {
    onPress: () => void;
    input?: string;
    variant?: "classic" | "outline" | "glass";
    // Allow overriding for specific cases
    children?: React.ReactNode;
    bg?: string;
    border?: string;
    color?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function Button({
    onPress,
    input = "",
    variant = "classic",
    children,
    bg,
    border,
    color,
    disabled = false,
    isLoading = false,
}: ButtonProps) {
    const variants = {
        classic: "bg-green-700 text-white",
        outline: "bg-transparent border border-green-700 text-green-700",
        glass: "bg-green-100 text-green-800",
    };

    const isButtonDisabled = disabled || isLoading;

    const baseStyle = "w-full py-3 rounded-xl flex items-center justify-center";
    const variantStyle = variants[variant];

    const pressableClasses = [
        baseStyle,
        !bg && !border && !color
            ? variantStyle
                  .split(" ")
                  .filter((s) => s.startsWith("bg-") || s.startsWith("border"))
                  .join(" ")
            : `${bg} ${border}`,
        isButtonDisabled ? "opacity-50" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const textClasses = [
        "text-center font-semibold",
        color
            ? color
            : variantStyle.split(" ").find((s) => s.startsWith("text-")),
    ]
        .filter(Boolean)
        .join(" ");

    const loadingColor =
        variant === "classic" || (bg && bg.includes("green"))
            ? "white"
            : "#1B8A52";

    return (
        <Pressable
            className={pressableClasses}
            onPress={onPress}
            disabled={isButtonDisabled}
        >
            {isLoading ? (
                <ActivityIndicator color={loadingColor} />
            ) : children ? (
                children
            ) : (
                <Text className={textClasses}>{input}</Text>
            )}
        </Pressable>
    );
}
