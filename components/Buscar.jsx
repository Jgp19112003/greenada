import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Image,
  Keyboard,
  Pressable,
  FlatList, // Import FlatList
} from "react-native"; // Import React Native components
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for local storage
import React, { useState, useEffect, useContext } from "react"; // Import React hooks
import correspondencias from "../assets/correspondencias.json"; // Import JSON file with data
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView for safe UI rendering
import { ThemeContext } from "../app/_layout"; // Import ThemeContext for dark mode

export function Buscar() {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state from ThemeContext
  const [searchText, setSearchText] = useState(""); // State for the search input
  const [fuel, setFuel] = useState(""); // State for selected fuel type
  const [fuelModalVisible, setFuelModalVisible] = useState(false); // State for fuel modal visibility
  const [hybridModalVisible, setHybridModalVisible] = useState(false); // State for hybrid modal visibility
  const [hybridType, setHybridType] = useState(""); // State for selected hybrid type
  const [history, setHistory] = useState([]); // State for search history

  useEffect(() => {
    // Load search history from AsyncStorage when the component mounts
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("history"); // Retrieve history from AsyncStorage
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory)); // Parse and set the history
        }
      } catch (error) {
        console.error("Error loading history:", error); // Log any errors
      }
    };
    loadHistory();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Save search history to AsyncStorage whenever it changes
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("history", JSON.stringify(history)); // Save history as a JSON string
      } catch (error) {
        console.error("Error saving history:", error); // Log any errors
      }
    };
    saveHistory();
  }, [history]); // Runs whenever the `history` state changes

  const parseMesAnio = (mesAnio) => {
    // Parse a date string in the format "mes/año" into a JavaScript Date object
    const meses = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };

    const [mes, anio] = mesAnio.toLowerCase().split("/"); // Split the string into month and year
    const mesAbreviado = mes.substring(0, 3); // Get the first three letters of the month
    return new Date(parseInt(anio), meses[mesAbreviado], 1); // Return a Date object
  };

  const getSeries = (mat) => {
    // Extract the series part of a license plate
    return mat.replace(/\s+/g, "").substr(4); // Remove spaces and get the substring starting at index 4
  };

  // Función que maneja la lógica de búsqueda y muestra la etiqueta ambiental
  const handleSearch = () => {
    // Evita que el teclado se quede abierto
    Keyboard.dismiss();
    // Si no se selecciona un combustible, muestra alerta
    if (!fuel) {
      Alert.alert(
        "Combustible no seleccionado",
        "Por favor, selecciona un tipo de combustible"
      );
      return;
    }
    // Validación de formato de matrícula con dos patrones
    const pattern1 = /^[0-9]{4}[A-Z]{3}$/;
    const pattern2 = /^[A-Z]{1}[0-9]{4}[A-Z]{2}$/;
    if (!pattern1.test(searchText) && !pattern2.test(searchText)) {
      Alert.alert("Formato no válido", "El formato debe ser 0000XXX");
      return;
    }
    // Se normaliza el texto y se obtiene la serie de la matrícula
    const normalizedSearch = searchText.replace(/\s+/g, "");
    const plateSeries = getSeries(normalizedSearch);

    const record = correspondencias.find((rec) => {
      // Filtra según el rango de matrículas en correspondencias.json
      const firstSeries = getSeries(rec.primera);
      const lastSeries = getSeries(rec.ultima);
      return firstSeries <= plateSeries && plateSeries <= lastSeries;
    });

    // Si se encuentra un registro, define la etiqueta en base al combustible y fecha
    if (record) {
      let etiqueta = "No clasificado";
      const regDate = parseMesAnio(record.mesAnio);

      if (fuel === "Gasolina") {
        // Si el combustible es gasolina
        if (regDate >= new Date(2006, 0, 1)) {
          // Si la fecha de registro es posterior o igual a enero de 2006
          etiqueta = "C"; // Asigna la etiqueta "C"
        } else if (regDate >= new Date(2001, 0, 1)) {
          // Si la fecha de registro es posterior o igual a enero de 2001
          etiqueta = "B"; // Asigna la etiqueta "B"
        }
      } else if (fuel === "Diesel") {
        // Si el combustible es diésel
        if (regDate >= new Date(2015, 8, 1)) {
          // Si la fecha de registro es posterior o igual a septiembre de 2015
          etiqueta = "C"; // Asigna la etiqueta "C"
        } else if (regDate >= new Date(2006, 0, 1)) {
          // Si la fecha de registro es posterior o igual a enero de 2006
          etiqueta = "B"; // Asigna la etiqueta "B"
        }
      } else if (fuel === "Eléctrico") {
        // Si el combustible es eléctrico
        etiqueta = "0"; // Asigna la etiqueta "0"
      } else if (fuel === "Híbrido") {
        // Si el combustible es híbrido
        if (hybridType === "Enchufable con autonomía >=40km") {
          // Si el híbrido es enchufable con autonomía mayor o igual a 40 km
          etiqueta = "0"; // Asigna la etiqueta "0"
        } else if (
          hybridType === "Enchufable con autonomía <40km" ||
          hybridType === "No enchufable"
        ) {
          etiqueta = "ECO"; // Asigna la etiqueta "ECO"
        }
      }

      if (etiqueta !== "No clasificado") {
        setHistory([
          {
            matricula: normalizedSearch,
            etiqueta,
            mesAnio: record.mesAnio, // store the raw string
          },
          ...history,
        ]);
      } else {
        Alert.alert(
          "Sin distintivo",
          "El vehículo no tiene distintivo medioambiental."
        );
      }
    } else {
      Alert.alert(
        "Matrícula no encontrada",
        "No se encontró la matrícula en la tabla de correspondencias."
      );
    }
    setSearchText("");
  };

  const deleteHistoryItem = (itemIndex) => {
    setHistory(history.filter((_, index) => index !== itemIndex));
  };

  const fuelOptions = ["Gasolina", "Diesel", "Híbrido", "Eléctrico"];

  const hybridOptions = [
    "No enchufable",
    "Enchufable con autonomía <40km",
    "Enchufable con autonomía >=40km",
  ];

  const handleFuelSelect = (option) => {
    setFuel(option);
    setFuelModalVisible(false);
  };

  const handleHybridSelect = (option) => {
    setHybridType(option);
    setHybridModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]} // Apply dark mode styles
    >
      <Text
        style={[styles.headerText, isDarkMode && styles.darkHeaderText]} // Apply dark mode styles
        numberOfLines={1}
      >
        Introduce matrícula a consultar
      </Text>
      <Text
        style={[styles.subHeaderText, isDarkMode && styles.darkSubHeaderText]}
        numberOfLines={1}
      >
        (0000XXX)
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="0000XXX"
          placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
          value={searchText}
          onChangeText={(text) => setSearchText(text.toUpperCase())}
          onSubmitEditing={handleSearch}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.input,
          isDarkMode && styles.darkInput,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPress={() => setFuelModalVisible(true)}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: fuel ? (isDarkMode ? "#fff" : "#000") : "#888",
          }}
        >
          {fuel || "Selecciona combustible"}
        </Text>
      </TouchableOpacity>
      {fuel === "Híbrido" && (
        <TouchableOpacity
          style={[
            styles.input,
            isDarkMode && styles.darkInput,
            { justifyContent: "center", alignItems: "center" },
          ]}
          onPress={() => setHybridModalVisible(true)}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: hybridType ? (isDarkMode ? "#fff" : "#000") : "#888",
            }}
          >
            {hybridType || "Selecciona tipo de híbrido"}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={handleSearch}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          Consultar
        </Text>
      </TouchableOpacity>
      <FlatList
        style={[
          styles.historyContainer,
          isDarkMode && styles.darkHistoryContainer,
        ]}
        contentContainerStyle={styles.historyContentContainer}
        data={history} // Pass the history array as data
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={({ item, index }) => (
          <View
            style={[styles.historyItem, isDarkMode && styles.darkHistoryItem]}
          >
            {item.etiqueta !== "No clasificado" && (
              <Image
                source={
                  item.etiqueta === "0"
                    ? require("../assets/distintivo_0.png")
                    : item.etiqueta === "B"
                    ? require("../assets/distintivo_B.png")
                    : item.etiqueta === "C"
                    ? require("../assets/distintivo_C.png")
                    : require("../assets/distintivo_ECO.png")
                }
                style={styles.distintiveImage}
              />
            )}
            <Text
              style={[styles.historyText, isDarkMode && styles.darkHistoryText]}
            >
              El vehículo{" "}
              <Text style={{ fontWeight: "bold" }}>{item.matricula}</Text>{" "}
              cumple con los requisitos para obtener el{" "}
              <Text style={{ fontWeight: "bold" }}>
                Distintivo Ambiental {item.etiqueta}.
              </Text>{" "}
              Matriculado en{" "}
              <Text style={{ fontWeight: "bold" }}>{item.mesAnio}</Text>.
            </Text>
            <TouchableOpacity onPress={() => deleteHistoryItem(index)}>
              <Text
                style={[styles.deleteIcon, isDarkMode && styles.darkDeleteIcon]}
              >
                ✖
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Reemplaza el modal de combustible */}
      <Modal visible={fuelModalVisible} transparent animationType="slide">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setFuelModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {fuelOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleFuelSelect(option)}
                style={{ padding: 10 }}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setFuelModalVisible(false)}
              style={{ padding: 10, marginTop: 10 }}
            >
              <Text style={{ fontSize: 16, textAlign: "center", color: "red" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Reemplaza el modal de híbrido */}
      <Modal visible={hybridModalVisible} transparent animationType="slide">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setHybridModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {hybridOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleHybridSelect(option)}
                style={{ padding: 10 }}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setHybridModalVisible(false)}
              style={{ padding: 10, marginTop: 10 }}
            >
              <Text style={{ fontSize: 16, textAlign: "center", color: "red" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
    color: "#000",
  },
  darkHeaderText: {
    color: "#fff",
  },
  subHeaderText: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  darkSubHeaderText: {
    color: "#aaa",
  },
  searchContainer: {},
  input: {
    width: 250,
    height: 50,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    paddingHorizontal: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 10,
    color: "#000",
  },
  darkInput: {
    borderColor: "#fff",
    color: "#fff",
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#001f3f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: "#00509e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  darkButtonText: {
    color: "#ddd",
  },
  historyContainer: {
    width: "90%",
    maxHeight: 335,
    marginTop: 40,
    marginBottom: -35,
    backgroundColor: "transparent", // Match the background color
  },
  darkHistoryContainer: {
    backgroundColor: "transparent", // Match the background color
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "green",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  darkHistoryItem: {
    backgroundColor: "#222",
    borderColor: "#0f0",
  },
  historyText: {
    fontSize: 16,
    color: "green",
    flex: 1,
    marginLeft: 10,
  },
  darkHistoryText: {
    color: "#0f0",
  },
  deleteIcon: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
  darkDeleteIcon: {
    color: "#f55",
  },
  distintiveImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  darkModalContainer: {
    backgroundColor: "#222",
  },
});

// Comentario detallado: Este componente lee la matrícula introducida y, mediante el archivo correspondencias.json,
// determina la fecha de matriculación y el distintivo ambiental, guardando el historial en AsyncStorage.
