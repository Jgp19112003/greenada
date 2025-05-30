// Comentario detallado: Este componente se encarga de consultar las sanciones desde Firestore
// y mostrarlas en una lista, permitiendo al usuario ver detalles y avanzar a su pago.
// Importa librerías y componentes necesarios
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../FirebaseConfig";

// Función principal del componente
export function Sanciones() {
  // useState para almacenar la lista de sanciones descargada de Firestore
  const [sanciones, setSanciones] = useState([]);
  const userEmail = auth.currentUser?.email || "";

  // useEffect que se ejecuta al montar el componente o al cambiar userEmail
  useEffect(() => {
    // Obtiene de Firestore los documentos de sanciones filtrando por el usuario actual
    const fetchSanciones = async () => {
      try {
        if (!userEmail) return;
        const q = query(
          collection(db, "sanciones"),
          where("mailSancionado", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setSanciones(data);
      } catch (error) {
        console.error("Error fetching sanciones:", error);
      }
    };
    fetchSanciones();
  }, [userEmail]);

  return (
    <View style={styles.container}>
      {!sanciones.length ? (
        // Si no hay sanciones, muestra un texto indicando que no tiene
        <View style={[styles.container, styles.noSancionesWrapper]}>
          <Text style={styles.noSancionesText}>
            Felicidades, no tienes sanciones
          </Text>
        </View>
      ) : (
        // Si hay sanciones, se mapean y se muestra cada una en una tarjeta
        <ScrollView>
          {sanciones.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.imagen ? (
                <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              ) : (
                <Image
                  source={require("../assets/unknown_car.png")}
                  style={styles.cardImage}
                />
              )}
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardText}>Fecha: {item.fecha}</Text>
                  <Text style={styles.cardText}>Lugar: {item.lugar}</Text>
                  <Text style={styles.cardText}>
                    Matrícula: {item.matricula}
                  </Text>
                  <Text style={styles.cardText}>Importe: {item.importe} €</Text>
                </View>
                <View>
                  {item.pagada ? (
                    <Text style={styles.pagadaText}>PAGADA</Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() =>
                        Linking.openURL(
                          "https://www.granada.org/v2010.nsf/xtod/1CB5D451BA497828C1257E26003535F7"
                        )
                      }
                    >
                      <Text style={styles.payButtonText}>Pagar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
  },
  payButton: {
    backgroundColor: "#001f3f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  pagadaText: {
    color: "#085937",
    fontWeight: "bold",
    fontSize: 14,
  },
  noSancionesText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "gray",
  },
  noSancionesWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
