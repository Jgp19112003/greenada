import { Stack, useSegments } from "expo-router";
import { StyleSheet, View, Image } from "react-native";
import "../global.css";
import { auth } from "../FirebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const isRegistro = segments.includes("registro");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      {!isRegistro && isAuthenticated && (
        <View
          style={{
            backgroundColor: "black",
            height: 55,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Pressable onPress={handleLogout}>
            <Text style={{ color: "white", fontSize: 20 }}>Cerrar sesión</Text>
          </Pressable>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 50, height: 50, padding: 5, borderRadius: 5 }}
          />
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />
    </SafeAreaView>
  );
}
