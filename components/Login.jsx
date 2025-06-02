// Importa las dependencias necesarias de React y otras bibliotecas
import React, { useState, useEffect, useContext } from "react";
import { auth, sendPasswordResetEmail } from "../FirebaseConfig"; // Importa la configuración de Firebase
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Métodos de autenticación de Firebase
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"; // Componentes de React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento asíncrono
import { useRouter } from "expo-router"; // Enrutador para navegación
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Manejo del teclado en vistas
import { ThemeContext } from "../app/_layout"; // Contexto para el tema oscuro/claro

// Componente principal de Login
export function Login() {
  // Define los estados locales del componente
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el indicador de carga
  const [isResetPassword, setIsResetPassword] = useState(false); // Estado para alternar entre login y restablecimiento de contraseña
  const router = useRouter(); // Hook para manejar la navegación
  const { isDarkMode } = useContext(ThemeContext); // Obtiene el estado del tema oscuro/claro

  // Efecto para cargar el correo electrónico almacenado
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email"); // Obtiene el correo almacenado
        if (savedEmail) setEmail(savedEmail); // Si existe, lo establece en el estado
      } catch (error) {
        console.error("Error loading email:", error); // Manejo de errores
      }
    };
    loadEmail(); // Llama a la función
  }, []);

  // Efecto para guardar el correo electrónico cuando cambia
  useEffect(() => {
    const saveEmail = async () => {
      try {
        await AsyncStorage.setItem("email", email); // Guarda el correo en el almacenamiento
      } catch (error) {
        console.error("Error saving email:", error); // Manejo de errores
      }
    };
    saveEmail(); // Llama a la función
  }, [email]); // Se ejecuta cuando cambia el estado "email"

  // Efecto para verificar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/buscar"); // Si el usuario está autenticado, redirige
      } else {
        setIsLoading(false); // Si no, detiene el indicador de carga
      }
    });
    return () => unsubscribe(); // Limpia el listener al desmontar
  }, [router]);

  // Función para restablecer la contraseña
  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Envía el correo de restablecimiento
      setIsResetPassword(false); // Cambia al estado de inicio de sesión
      alert("¡Enviado!\nRevisa tu correo para restablecer la contraseña."); // Muestra un mensaje de éxito
    } catch (error) {
      // Manejo de errores específicos
      if (error?.code === "auth/invalid-email") {
        alert("El correo electrónico no es válido.");
      } else if (error?.code === "auth/user-not-found") {
        alert("No se encontró un usuario con este correo.");
      } else {
        alert("Ocurrió un error al intentar restablecer la contraseña.");
      }
    }
  };

  // Muestra un indicador de carga si el estado "isLoading" es verdadero
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <ActivityIndicator size="large" color="#085937" />
      </View>
    );
  }

  // Función para iniciar sesión
  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // Intenta iniciar sesión con Firebase
      router.replace("/buscar"); // Redirige al usuario
    } catch (error) {
      // Manejo de errores específicos
      if (error?.code === "auth/wrong-password") {
        alert("La contraseña es incorrecta.");
      } else if (error?.code === "auth/user-not-found") {
        alert("No se encontró un usuario con este correo.");
      } else if (error?.code === "auth/invalid-email") {
        alert("El correo electrónico no es válido.");
      } else {
        alert("Ocurrió un error al iniciar sesión.");
      }
    }
  };

  // Renderiza la interfaz de usuario
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: "black" }}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.innerContainer}>
              {isResetPassword ? (
                <>
                  <Text style={styles.header}>Restablecer Contraseña</Text>
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Pressable style={styles.button} onPress={resetPassword}>
                    <Text style={styles.buttonText}>Enviar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setIsResetPassword(false)}
                    style={styles.linkContainer}
                  >
                    <Text style={styles.linkText}>
                      Volver al inicio de sesión
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.header}>Iniciar Sesión</Text>
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    placeholder="Contraseña"
                    secureTextEntry
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable style={styles.button} onPress={signIn}>
                    <Text style={styles.buttonText}>Entrar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push("/registro")}
                    style={styles.linkContainer}
                  >
                    <Text style={styles.registrateText}>Regístrate</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setIsResetPassword(true)}
                    style={styles.linkContainer}
                  >
                    <Text style={styles.linkText}>
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingTop: 120,
  },
  darkContainer: {},
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
  darkInput: {},
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#085937",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    alignSelf: "center",
  },
  linkText: {
    color: "#2980b9",
    fontSize: 14,
    marginTop: 10,
  },
  registrateText: {
    padding: 8,
    fontSize: 16,
    borderRadius: 5,
    color: "#333",
    backgroundColor: "#f5efdb",
    fontWeight: "bold",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
});
