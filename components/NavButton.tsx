import { ReactNode } from "react";
import { Image, ImageSourcePropType, Pressable, Text } from "react-native";

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
}: NavButtonProps) {
  return (
    <Pressable
      className={`${width} px-4 py-3 rounded-xl ${bg} ${border} flex flex-col justify-center items-center`}
      onPress={onPress}
    >
      {icon && (
        <>
          {iconType === "image" ? (
            <Image source={source} alt={alt} />
          ) : (
            iconComponent
          )}
        </>
      )}
      <Text className={`text-center font-semibold ${color}`}>{input}</Text>
    </Pressable>
  );
}
