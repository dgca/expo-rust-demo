import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { hello, rustAdd } from "./modules/my-rust-module";
import { useEffect, useState } from "react";

export default function App() {
  const [value, setValue] = useState<null | number>(null);
  useEffect(() => {
    async function doFetch() {
      const result = await rustAdd(40, 12);
      setValue(result);
    }
    doFetch();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{hello()}</Text>
      <Text style={styles.text}>
        {value === null ? "Loading..." : `The value is: ${value}`}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 42,
  },
});
