import { Pressable, Text } from "react-native";

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
}: ButtonProps) {
    const variants = {
        classic: "bg-green-700 text-white",
        outline: "bg-transparent border border-green-700 text-green-700",
        glass: "bg-green-100 text-green-800",
    };

    const baseStyle = "w-full py-3 rounded-xl";
    const variantStyle = variants[variant];

    return (
        <Pressable
            className={`${baseStyle} ${
                !bg && !border && !color
                    ? variantStyle
                          .split(" ")
                          .filter(
                              (s) =>
                                  s.startsWith("bg-") || s.startsWith("border")
                          )
                          .join(" ")
                    : `${bg} ${border}`
            }`}
            onPress={onPress}
            disabled={disabled}
        >
            {children ? (
                children
            ) : (
                <Text
                    className={`text-center font-semibold ${
                        color
                            ? color
                            : variantStyle
                                  .split(" ")
                                  .find((s) => s.startsWith("text-"))
                    }`}
                >
                    {input}
                </Text>
            )}
        </Pressable>
    );
}
