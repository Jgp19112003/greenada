import React, { useState, useEffect } from "react";
import { auth, db } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export function Registro() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedNombre = await AsyncStorage.getItem("nombre");
        const savedTelefono = await AsyncStorage.getItem("telefono");
        if (savedNombre) setNombre(savedNombre);
        if (savedTelefono) setTelefono(savedTelefono);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Save user data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem("nombre", nombre);
        await AsyncStorage.setItem("telefono", telefono);
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };
    saveUserData();
  }, [nombre, telefono]);

  const signUp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "usuarios", user.uid), { nombre, telefono, email });
      router.replace("/buscar");
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "black" }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo image */}
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Registro</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              placeholderTextColor="#666"
              value={telefono}
              onChangeText={setTelefono}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingTop: 120,
  },
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
