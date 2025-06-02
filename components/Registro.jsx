// Importa las dependencias necesarias
import React, { useState, useEffect, useContext } from "react"; // Importa React y hooks
import { auth, db } from "../FirebaseConfig"; // Importa la configuración de Firebase
import { createUserWithEmailAndPassword } from "firebase/auth"; // Método para registrar usuarios en Firebase Authentication
import { doc, setDoc } from "firebase/firestore"; // Métodos para interactuar con Firestore
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"; // Componentes de React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento local
import { useRouter } from "expo-router"; // Enrutador para navegación
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Manejo del teclado en vistas
import { ThemeContext } from "../app/_layout"; // Contexto para el tema oscuro/claro

// Componente principal para registrar nuevos usuarios
export function Registro() {
  const router = useRouter(); // Hook para manejar la navegación
  const { isDarkMode } = useContext(ThemeContext); // Obtiene el estado del tema oscuro/claro

  // Estados locales para manejar los datos del formulario
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [nombre, setNombre] = useState(""); // Estado para el nombre del usuario
  const [telefono, setTelefono] = useState(""); // Estado para el teléfono del usuario
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar múltiples envíos

  // useEffect para cargar datos del usuario desde AsyncStorage al iniciar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedNombre = await AsyncStorage.getItem("nombre"); // Obtiene el nombre almacenado
        const savedTelefono = await AsyncStorage.getItem("telefono"); // Obtiene el teléfono almacenado
        if (savedNombre) setNombre(savedNombre); // Si existe, lo establece en el estado
        if (savedTelefono) setTelefono(savedTelefono); // Si existe, lo establece en el estado
      } catch (error) {
        console.error("Error loading user data:", error); // Manejo de errores
      }
    };
    loadUserData(); // Llama a la función para cargar los datos
  }, []);

  // useEffect para guardar datos del usuario en AsyncStorage cuando cambian
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem("nombre", nombre); // Guarda el nombre en el almacenamiento
        await AsyncStorage.setItem("telefono", telefono); // Guarda el teléfono en el almacenamiento
      } catch (error) {
        console.error("Error saving user data:", error); // Manejo de errores
      }
    };
    saveUserData(); // Llama a la función para guardar los datos
  }, [nombre, telefono]); // Se ejecuta cuando cambian los estados "nombre" o "telefono"

  // Función para registrar un nuevo usuario
  const signUp = async () => {
    // Evita múltiples envíos si ya se está procesando
    if (isSubmitting) return;
    setIsSubmitting(true); // Establece el estado de envío en verdadero
    try {
      // Crea un nuevo usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Obtiene el usuario creado
      // Guarda datos adicionales del usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), { nombre, telefono, email });
      router.replace("/buscar"); // Redirige al usuario a la página principal
    } catch (error) {
      console.error("Error registrando usuario:", error); // Manejo de errores
      setIsSubmitting(false); // Restablece el estado de envío
    }
  };

  // Renderiza la interfaz de usuario
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: "black" }} // Estilo del contenedor
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
          keyboardShouldPersistTaps="handled" // Permite que los toques pasen al teclado
        >
          <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {/* Contenedor principal */}
            {/* Logo de la aplicación */}
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.innerContainer}>
              {/* Contenedor interno */}
              <Text style={styles.header}>Registro</Text>
              {/* Campo de entrada para el nombre */}
              <TextInput
                style={[styles.input, styles.inputTextBlack]} // Aplica el nuevo estilo
                placeholder="Nombre"
                placeholderTextColor="#666"
                value={nombre}
                onChangeText={setNombre}
              />
              {/* Campo de entrada para el teléfono */}
              <TextInput
                style={[styles.input, styles.inputTextBlack]} // Aplica el nuevo estilo
                placeholder="Teléfono"
                keyboardType="phone-pad"
                placeholderTextColor="#666"
                value={telefono}
                onChangeText={setTelefono}
              />
              {/* Campo de entrada para el correo electrónico */}
              <TextInput
                style={[styles.input, styles.inputTextBlack]} // Aplica el nuevo estilo
                placeholder="Correo electrónico"
                keyboardType="email-address"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
              />
              {/* Campo de entrada para la contraseña */}
              <TextInput
                style={[styles.input, styles.inputTextBlack]} // Aplica el nuevo estilo
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
              />
              {/* Botón para enviar el formulario */}
              <Pressable style={styles.button} onPress={signUp}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
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
    color: "#333",
  },
  inputTextBlack: {
    color: "black", // Fuerza el texto a ser negro
  },
  darkInput: {
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#085937",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
});

// Comentario detallado: El formulario recoge datos como email y contraseña, y los registra
// en Firebase Authentication, guardando información adicional en Firestore si fuese necesario.
