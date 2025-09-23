import React from "react";
import { View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { IconProps } from "../../types/icon";

export default function HomeIcon({
  isActive = false,
  width = "32",
  height = "32",
}: IconProps): React.JSX.Element {
  const viewHeight = (parseFloat(height) * 1.6).toString();
  const viewWidth = (parseFloat(width) * 1.2).toString();
  return (
    <View className="flex justify-center items-center">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        fill="none"
      >
        <Path
          d="M44.3334 40.6667V18C44.3334 17.5861 44.237 17.1778 44.0518 16.8075C43.8667 16.4372 43.5979 16.1151 43.2667 15.8667L24.6 1.86671C24.1384 1.52051 23.577 1.33337 23 1.33337C22.423 1.33337 21.8616 1.52051 21.4 1.86671L2.73335 15.8667C2.40216 16.1151 2.13335 16.4372 1.94821 16.8075C1.76307 17.1778 1.66669 17.5861 1.66669 18V40.6667C1.66669 41.374 1.94764 42.0522 2.44774 42.5523C2.94783 43.0524 3.62611 43.3334 4.33335 43.3334H15C15.7073 43.3334 16.3855 43.0524 16.8856 42.5523C17.3857 42.0522 17.6667 41.374 17.6667 40.6667V32.6667C17.6667 31.9595 17.9476 31.2812 18.4477 30.7811C18.9478 30.281 19.6261 30 20.3334 30H25.6667C26.3739 30 27.0522 30.281 27.5523 30.7811C28.0524 31.2812 28.3334 31.9595 28.3334 32.6667V40.6667C28.3334 41.374 28.6143 42.0522 29.1144 42.5523C29.6145 43.0524 30.2928 43.3334 31 43.3334H41.6667C42.3739 43.3334 43.0522 43.0524 43.5523 42.5523C44.0524 42.0522 44.3334 41.374 44.3334 40.6667Z"
          fill={isActive ? "#1B8A52" : "#9EA2AE"}
          stroke={isActive ? "#1B8A52" : "#9EA2AE"}
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
}
