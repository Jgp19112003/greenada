import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import { ThemeContext } from "../app/_layout";

// Componente que muestra un mapa o imagen de la ZBE (Zona de Bajas Emisiones).
// Puede incluir un botón o enlace a Google Maps u otra funcionalidad
//   para abrir la ubicación exacta de la ZBE

export function Mapa() {
  const { isDarkMode } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const openGoogleMaps = () => {
    // Abre la ubicación de Granada en Google Maps
    Linking.openURL("https://www.google.com/maps?q=Granada");
  };

  const openMoreInfo = () => {
    Linking.openURL("http://www.movilidadgranada.com/zbe.php");
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
        Zona de Bajas Emisiones
      </Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={require("../assets/zona.jpg")} style={styles.image} />
      </TouchableOpacity>
      <ScrollView style={styles.textContainer}>
        <Text style={[styles.info, isDarkMode && styles.darkInfo]}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA ESTE DE LA CIUDAD:
          </Text>{" "}
          Camino del Sacromonte hasta la Abadía incluido en la ZBE. Cruce del
          Restaurante El Caldero...
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA CARRETERA DE ALFACAR:
          </Text>{" "}
          Coincide con el perímetro urbano, quedando la ciudad deportiva dentro
          de la ZBE.
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA NORTE:
          </Text>{" "}
          Calles Pegaso y Merced Alta, no incluidas dentro de la ZBE. Borde de
          terreno de Casería de los Cipreses.
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA NOROESTE:
          </Text>{" "}
          Avd. Blas de Otero, Calle Lepanto, C/Racimos, C/El Jau y borde de
          Parque Cronista Juan Burgos.
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA OESTE:
          </Text>{" "}
          Borde de Parque de las Alquerias, vía servicio de la autovía (evitar
          entradas desde zona de Puleva)...
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA SUROESTE:
          </Text>{" "}
          Carretera de Vegas del Genil hasta cruce en encuentro Río Monachil y
          Genil. Término municipal...
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA SUR:
          </Text>{" "}
          Avenida de la Innovación dentro de la ZBE. Avenida de Jesús Candel,
          Avd. del Conocimiento, Calle Torre...
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            ZONA SURESTE:
          </Text>{" "}
          Vía de Servicio de la Autovía, Paseo de Cameros no incluida para
          acceso Parking, Camino de Caidero...
          {"\n\n"}
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}
          >
            No están dentro de la ZBE:
          </Text>{" "}
          La Circunvalación (GR30), la Ronda SUR (A-395), Merced Alta (A-4006)
          ni Avenida Santa María de la Alhambra.
        </Text>
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={openGoogleMaps}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          Abrir en Google Maps
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.smallButton, isDarkMode && styles.darkSmallButton]}
        onPress={openMoreInfo}
      >
        <Text
          style={[
            styles.smallButtonText,
            isDarkMode && styles.darkSmallButtonText,
          ]}
        >
          Más información
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={require("../assets/zona.jpg")}
            style={styles.modalImage}
          />
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  darkTitle: {
    color: "#fff",
  },
  textContainer: {
    flex: 1,
    marginBottom: 16,
  },
  info: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "justify",
    color: "#000",
  },
  darkInfo: {
    color: "#fff",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  darkSectionTitle: {
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#001f3f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: "#00509e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  darkButtonText: {
    color: "#ddd",
  },
  smallButton: {
    width: "100%",
    height: 35,
    backgroundColor: "#0074D9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  darkSmallButton: {
    backgroundColor: "#00509e",
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  darkSmallButtonText: {
    color: "#ddd",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});

// Comentario detallado: Aquí se renderiza la imagen o mapa interactivo de la ZBE, con botones
// para mostrar información adicional, enlaces a Google Maps, etc.
