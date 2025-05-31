// Comentario detallado: Este componente se encarga de consultar las sanciones desde Firestore
// y mostrarlas en una lista, permitiendo al usuario ver detalles y avanzar a su pago.

// Importa librerías y componentes necesarios
import React, { useState, useEffect, useContext } from "react"; // Importa React y hooks
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native"; // Componentes de React Native
import { collection, query, where, getDocs } from "firebase/firestore"; // Métodos para interactuar con Firestore
import { auth, db } from "../FirebaseConfig"; // Configuración de Firebase
import { ThemeContext } from "../app/_layout"; // Contexto para el tema oscuro/claro

// Función principal del componente
export function Sanciones() {
  const { isDarkMode } = useContext(ThemeContext); // Obtiene el estado del tema oscuro/claro
  const [sanciones, setSanciones] = useState([]); // Estado para almacenar la lista de sanciones
  const userEmail = auth.currentUser?.email || ""; // Obtiene el correo del usuario autenticado

  // useEffect que se ejecuta al montar el componente o al cambiar userEmail
  useEffect(() => {
    // Obtiene de Firestore los documentos de sanciones filtrando por el usuario actual
    const fetchSanciones = async () => {
      try {
        if (!userEmail) return; // Si no hay correo, no realiza la consulta
        const q = query(
          collection(db, "sanciones"), // Colección "sanciones" en Firestore
          where("mailSancionado", "==", userEmail) // Filtra por el correo del usuario
        );
        const querySnapshot = await getDocs(q); // Ejecuta la consulta
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() }); // Agrega cada documento al array de sanciones
        });
        setSanciones(data); // Actualiza el estado con las sanciones obtenidas
      } catch (error) {
        console.error("Error fetching sanciones:", error); // Manejo de errores
      }
    };
    fetchSanciones(); // Llama a la función para obtener las sanciones
  }, [userEmail]); // Se ejecuta cuando cambia el correo del usuario

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Si no hay sanciones, muestra un mensaje */}
      {!sanciones.length ? (
        <View style={[styles.container, styles.noSancionesWrapper]}>
          <Text style={styles.noSancionesText}>
            Felicidades, no tienes sanciones
          </Text>
        </View>
      ) : (
        // Si hay sanciones, las muestra en una lista
        <ScrollView>
          {sanciones.map((item) => (
            <View
              key={item.id} // Identificador único de la sanción
              style={[styles.card, isDarkMode && styles.darkCard]}
            >
              {/* Muestra la imagen de la sanción o una imagen por defecto */}
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
                  {/* Muestra los detalles de la sanción */}
                  <Text
                    style={[styles.cardText, isDarkMode && styles.darkCardText]}
                  >
                    Fecha: {item.fecha}
                  </Text>
                  <Text
                    style={[styles.cardText, isDarkMode && styles.darkCardText]}
                  >
                    Lugar: {item.lugar}
                  </Text>
                  <Text
                    style={[styles.cardText, isDarkMode && styles.darkCardText]}
                  >
                    Matrícula: {item.matricula}
                  </Text>
                  <Text
                    style={[styles.cardText, isDarkMode && styles.darkCardText]}
                  >
                    Importe: {item.importe} €
                  </Text>
                </View>
                <View>
                  {/* Si la sanción está pagada, muestra un texto; si no, un botón para pagar */}
                  {item.pagada ? (
                    <Text style={styles.pagadaText}>PAGADA</Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={
                        () =>
                          Linking.openURL(
                            "https://www.granada.org/v2010.nsf/xtod/1CB5D451BA497828C1257E26003535F7"
                          ) // Abre el enlace para pagar la sanción
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
    backgroundColor: "#fff", // Fondo blanco por defecto
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#333", // Fondo negro para el modo oscuro
  },
  card: {
    flexDirection: "row", // Disposición horizontal
    backgroundColor: "#f9f9f9", // Fondo claro para las tarjetas
    borderRadius: 8, // Bordes redondeados
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd", // Borde gris claro
  },
  darkCard: {
    backgroundColor: "#222",
    borderColor: "#444", // Fondo oscuro para las tarjetas en modo oscuro
  },
  cardImage: {
    width: 80, // Ancho de la imagen
    height: 80, // Alto de la imagen
    borderRadius: 8, // Bordes redondeados
    marginRight: 10,
    resizeMode: "cover", // Ajusta la imagen para cubrir el espacio
    backgroundColor: "#f0f0f0", // Fondo gris claro
  },
  cardContent: {
    flex: 1,
    flexDirection: "row", // Disposición horizontal
    justifyContent: "space-between", // Espaciado entre elementos
    alignItems: "center", // Alineación vertical centrada
  },
  cardText: {
    fontSize: 14, // Tamaño de fuente
    color: "#333", // Color de texto oscuro
  },
  darkCardText: {
    color: "#fff", // Color de texto claro para el modo oscuro
  },
  payButton: {
    backgroundColor: "#001f3f", // Fondo azul oscuro para el botón de pago
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5, // Bordes redondeados
    alignSelf: "flex-start", // Alineación al inicio
    margin: 10,
  },
  payButtonText: {
    color: "#fff", // Texto blanco
    fontSize: 14, // Tamaño de fuente
  },
  pagadaText: {
    color: "#085937", // Texto verde para indicar que está pagada
    fontWeight: "bold", // Texto en negrita
    fontSize: 14, // Tamaño de fuente
  },
  noSancionesText: {
    flex: 1,
    textAlign: "center", // Texto centrado horizontalmente
    textAlignVertical: "center", // Texto centrado verticalmente
    fontSize: 18, // Tamaño de fuente
    color: "gray", // Color gris
  },
  noSancionesWrapper: {
    flex: 1,
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
  },
});
