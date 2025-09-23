import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  DimensionValue,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PickerItem {
  label: string;
  value: string;
}

export interface ScrollPickerHandle {
  getValue: () => string;
}

interface ScrollPickerProps {
  list: PickerItem[];
  value?: string; // optional initial value
  onItemPress: (value: string) => void;
  itemHeight?: number;
  labelColor?: string;
  selectedColor?: string;
  separatorColor?: string;
  height?: number;
  width?: DimensionValue;
}

const ScrollPicker = forwardRef<ScrollPickerHandle, ScrollPickerProps>(
  (
    {
      list,
      onItemPress,
      itemHeight = 50,
      labelColor = "#444",
      selectedColor = "#000",
      separatorColor = "#ccc",
      height = 50,
      width = "100%",
      value,
    },
    ref
  ) => {
    const scrollRef = useRef<ScrollView>(null);
    const [currentValue, setCurrentValue] = useState(
      value ?? list[0]?.value ?? ""
    );

    useImperativeHandle(ref, () => ({
      getValue: () => currentValue,
    }));

    useEffect(() => {
      const index = list.findIndex((item) => item.value === currentValue);
      if (scrollRef.current && index >= 0) {
        scrollRef.current.scrollTo({
          y: index * itemHeight,
          animated: false,
        });
      }
    }, []);

    const handleMomentumScrollEnd = (
      e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      const selectedItem = list[index];
      if (selectedItem) {
        setCurrentValue(selectedItem.value);
        onItemPress(selectedItem.value);
      }
    };

    return (
      <View
        style={{
          height,
          width,
          position: "relative",
          overflow: "hidden",
          borderWidth: 0.01,
        }}
      >
        {/* Selection Highlight */}
        <View
          style={{
            position: "absolute",
            top: height / 2 - itemHeight / 2,
            height: itemHeight,
            width: "100%",
            borderColor: separatorColor,
            zIndex: 1,
          }}
        />

        <ScrollView
          ref={scrollRef}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={{ zIndex: 999 }}
        >
          {list.map((item, index) => {
            const isSelected = item.value === currentValue;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.row, { height: itemHeight }]}
                onPress={() => {
                  setCurrentValue(item.value);
                  onItemPress(item.value);
                  scrollRef.current?.scrollTo({
                    y: index * itemHeight,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={[
                    styles.rowText,
                    {
                      color: isSelected ? selectedColor : labelColor,
                      opacity: isSelected ? 1 : 0.4,
                      fontWeight: isSelected ? "500" : "400",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    fontSize: 17,
    textAlign: "center",
  },
});

export default ScrollPicker;
