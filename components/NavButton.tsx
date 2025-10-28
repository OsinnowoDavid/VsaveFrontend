import { ReactNode } from "react";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    Text,
    View,
} from "react-native";

interface NavButtonProps {
    onPress: () => void;
    bg?: string;
    border?: string;
    color?: string;
    input: string;
    icon?: boolean;
    iconType?: "image" | "component";
    iconComponent?: ReactNode;
    source?: ImageSourcePropType;
    alt?: string;
    width?: string;
    padding?: string;
    imageHeight?: number;
    imageWidth?: number;
}

export default function NavButton({
    onPress,
    bg = "bg-white",
    border = "",
    color = "text-gray-700",
    input = "",
    source,
    icon = true,
    iconType = "component",
    iconComponent,
    alt = "",
    width = "w-max",
    padding = "p-1",
    imageWidth = 35,
    imageHeight = 35,
}: NavButtonProps) {
    return (
        <View className={`flex flex-col ${width}`}>
            <Pressable
                className={`${padding} ${bg} rounded-xl ${border} flex flex-col justify-center items-center`}
                onPress={onPress}
            >
                {icon && (
                    <>
                        {iconType === "image" ? (
                            <Image
                                source={source}
                                alt={alt}
                                width={imageWidth}
                                height={imageHeight}
                            />
                        ) : (
                            iconComponent
                        )}
                    </>
                )}
            </Pressable>
            <Text className={`text-center text-sm font-semibold ${color}`}>
                {input}
            </Text>
        </View>
    );
}
