import { Stack, useSegments } from "expo-router";
import { StyleSheet, View, Image } from "react-native";
import "../global.css";
import { auth } from "../FirebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext, useContext } from "react";
import { Pressable, Text, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Importa Ionicons para los íconos
import { ThemeProvider } from "../ThemeContext"; // Importa el proveedor del tema
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage

// Contexto para el tema
export const ThemeContext = createContext();

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const isRegistro = segments.includes("registro");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para el modo oscuro

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Carga la configuración del modo oscuro al iniciar la app
    const loadDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("darkMode");
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode)); // Establece el estado según lo guardado
        }
      } catch (error) {
        console.error("Error loading dark mode setting:", error);
      }
    };
    loadDarkMode();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuVisible(false); // Cierra el menú al hacer clic fuera
  };

  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode); // Alterna el estado del modo oscuro
      await AsyncStorage.setItem("darkMode", JSON.stringify(newDarkMode)); // Guarda la configuración
    } catch (error) {
      console.error("Error saving dark mode setting:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? "black" : "white",
        }}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={{ flex: 1 }}>
            {!isRegistro && isAuthenticated && (
              <View
                style={{
                  backgroundColor: isDarkMode ? "black" : "white",
                  height: 55,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Pressable onPress={toggleMenu}>
                  <Image
                    source={require("../assets/logo.png")}
                    style={{
                      width: 50,
                      height: 50,
                      padding: 5,
                      borderRadius: 5,
                    }}
                  />
                </Pressable>
                {menuVisible && (
                  <View
                    style={{
                      position: "absolute",
                      top: 55,
                      right: 10,
                      backgroundColor: isDarkMode
                        ? "rgba(0, 0, 0, 0.9)"
                        : "rgba(255, 255, 255, 0.9)",
                      padding: 10,
                      borderRadius: 5,
                      elevation: 5,
                      zIndex: 1000,
                    }}
                  >
                    <Pressable
                      onPress={toggleDarkMode}
                      style={{ marginBottom: 10, alignItems: "center" }}
                    >
                      <Image
                        source={require("../assets/dark_mode_icon.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    </Pressable>
                    <Pressable onPress={handleLogout}>
                      <Text
                        style={{
                          color: isDarkMode ? "white" : "black",
                          fontSize: 16,
                        }}
                      >
                        Cerrar sesión
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
            <Stack
              screenOptions={{
                headerShown: false,
                headerBackVisible: false,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}
