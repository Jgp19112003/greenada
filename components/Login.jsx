import React, { useState, useEffect } from "react";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load email from AsyncStorage on mount
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email");
        if (savedEmail) setEmail(savedEmail);
      } catch (error) {
        console.error("Error loading email:", error);
      }
    };
    loadEmail();
  }, []);

  // Save email to AsyncStorage whenever it changes
  useEffect(() => {
    const saveEmail = async () => {
      try {
        await AsyncStorage.setItem("email", email);
      } catch (error) {
        console.error("Error saving email:", error);
      }
    };
    saveEmail();
  }, [email]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/buscar");
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <ActivityIndicator size="large" color="#085937" />
      </View>
    );
  }

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/buscar");
    } catch (error) {
      console.error("Error signing in:", error);
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
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Iniciar Sesión</Text>
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
            <Pressable style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/registro")}
              style={styles.linkContainer}
            >
              <Text style={styles.registrateText}> Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

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
