import { Image, StyleSheet } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />
      <ThemedText type="title" style={styles.text}>
        Welcome to Vsave!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});
