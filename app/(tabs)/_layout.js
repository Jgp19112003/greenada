import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

export default function TabsLayour() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Orden de izquierda a derecha: buscar, misVehiculos, mapa, sanciones */}
      <Tabs.Screen
        name="buscar"
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="misVehiculos"
        options={{
          tabBarLabel: "Mis Vehiculos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          tabBarLabel: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sanciones"
        options={{
          tabBarLabel: "Sanciones",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="exclamation" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
