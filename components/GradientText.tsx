import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";

interface GradientTextProps {
  children: React.ReactNode;
  fontSize?: number;
  colors?: [string, string]; // Exactly two hex colors
  style?: TextStyle;
}

export default function GradientText({
  children,
  style,
  colors = ["#008E4C", "#224C38"],
  fontSize = 20,
}: GradientTextProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  return (
    <View style={styles.wrapper}>
      <Text
        style={[styles.measureText, style, { fontSize: fontSize }]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setLayout({ width, height });
        }}
      >
        {children}
      </Text>

      {layout.width > 0 && layout.height > 0 && (
        <MaskedView
          style={{ width: layout.width, height: layout.height }}
          maskElement={
            <Text style={[styles.maskText, style, { fontSize: fontSize }]}>
              {children}
            </Text>
          }
        >
          <LinearGradient
            colors={colors}
            locations={[0.31, 0.92]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: layout.width, height: layout.height }}
          />
        </MaskedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  measureText: {
    position: "absolute",
    opacity: 0,
    fontWeight: "bold",
  },
  maskText: {
    fontWeight: "bold",
    color: "black",
  },
});
