import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export function MisVehiculos() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Mis vehiculos</Text>
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
