import { StyleSheet, Text, View } from "react-native";
import React from "react";

export function Mapa() {
  return (
    <View style={styles.container}>
      <Text>Mapa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
