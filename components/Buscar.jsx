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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import correspondencias from "../assets/correspondencias.json";
import { SafeAreaView } from "react-native-safe-area-context";

export function Buscar() {
  const [searchText, setSearchText] = useState("");
  const [fuel, setFuel] = useState("");
  const [fuelModalVisible, setFuelModalVisible] = useState(false);
  const [hybridModalVisible, setHybridModalVisible] = useState(false);
  const [hybridType, setHybridType] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("history");
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("history", JSON.stringify(history));
      } catch (error) {
        console.error("Error saving history:", error);
      }
    };
    saveHistory();
  }, [history]);

  const parseMesAnio = (mesAnio) => {
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

    const [mes, anio] = mesAnio.toLowerCase().split("/");
    const mesAbreviado = mes.substring(0, 3);
    return new Date(parseInt(anio), meses[mesAbreviado], 1);
  };

  const getSeries = (mat) => {
    return mat.replace(/\s+/g, "").substr(4);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!fuel) {
      Alert.alert(
        "Combustible no seleccionado",
        "Por favor, selecciona un tipo de combustible"
      );
      return;
    }
    // Validar formato: 0000XXX o X0000XX
    const pattern1 = /^[0-9]{4}[A-Z]{3}$/;
    const pattern2 = /^[A-Z]{1}[0-9]{4}[A-Z]{2}$/;
    if (!pattern1.test(searchText) && !pattern2.test(searchText)) {
      Alert.alert("Formato no válido", "El formato debe ser 0000XXX o X0000XX");
      return;
    }
    const normalizedSearch = searchText.replace(/\s+/g, "");
    const plateSeries = getSeries(normalizedSearch);

    const record = correspondencias.find((rec) => {
      const firstSeries = getSeries(rec.primera);
      const lastSeries = getSeries(rec.ultima);
      return firstSeries <= plateSeries && plateSeries <= lastSeries;
    });

    if (record) {
      let etiqueta = "No clasificado";
      const regDate = parseMesAnio(record.mesAnio);

      if (fuel === "Gasolina") {
        if (regDate >= new Date(2006, 0, 1)) {
          etiqueta = "C";
        } else if (regDate >= new Date(2001, 0, 1)) {
          etiqueta = "B";
        }
      } else if (fuel === "Diesel") {
        if (regDate >= new Date(2015, 8, 1)) {
          etiqueta = "C";
        } else if (regDate >= new Date(2006, 0, 1)) {
          etiqueta = "B";
        }
      } else if (fuel === "Eléctrico") {
        etiqueta = "0";
      } else if (fuel === "Híbrido") {
        if (hybridType === "Enchufable con autonomía >=40km") {
          etiqueta = "0";
        } else {
          etiqueta = "ECO";
        }
      }

      setHistory([
        { matricula: searchText, etiqueta, year: regDate.getFullYear() }, // Add year to history
        ...history,
      ]);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText} numberOfLines={1}>
        Introduce matrícula a consultar
      </Text>
      <Text style={styles.subHeaderText} numberOfLines={1}>
        (0000XXX / X0000XX)
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="0000XXX"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={(text) => setSearchText(text.toUpperCase())}
          onSubmitEditing={handleSearch}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.input,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPress={() => setFuelModalVisible(true)}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: fuel ? "#000" : "#888",
          }}
        >
          {fuel || "Selecciona combustible"}
        </Text>
      </TouchableOpacity>
      {fuel === "Híbrido" && (
        <TouchableOpacity
          style={[
            styles.input,
            { justifyContent: "center", alignItems: "center" },
          ]}
          onPress={() => setHybridModalVisible(true)}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: hybridType ? "#000" : "#888",
            }}
          >
            {hybridType || "Selecciona tipo de híbrido"}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Consultar</Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.historyContainer}
        contentContainerStyle={styles.historyContentContainer}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            {item.etiqueta !== "No clasificado" && (
              <Image
                source={
                  item.etiqueta === "0"
                    ? require("../assets/distintivo_0.png")
                    : item.etiqueta === "B"
                    ? require("../assets/distintivo_B.png")
                    : item.etiqueta === "C"
                    ? require("../assets/distintivo_C.png")
                    : require("../assets/distintivo_ECO.png") // Add ECO label image
                }
                style={styles.distintiveImage}
              />
            )}
            <Text style={styles.historyText}>
              El vehículo{" "}
              <Text style={{ fontWeight: "bold" }}>{item.matricula}</Text>{" "}
              cumple con los requisitos para obtener el{" "}
              <Text style={{ fontWeight: "bold" }}>
                Distintivo Ambiental {item.etiqueta}.
              </Text>{" "}
              Matriculado en{" "}
              <Text style={{ fontWeight: "bold" }}>{item.year}</Text>.
            </Text>
            <TouchableOpacity onPress={() => deleteHistoryItem(index)}>
              <Text style={styles.deleteIcon}>✖</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  headerText: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
  },
  subHeaderText: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  historyContainer: {
    width: "90%",
    maxHeight: 335, // previous adjustment
    marginTop: 40,
    marginBottom: -35, // added margin to finish above the bottom bar
  },
  historyContentContainer: {
    paddingBottom: 20,
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
  historyText: {
    fontSize: 16,
    color: "green",
    flex: 1,
    marginLeft: 10,
  },
  deleteIcon: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
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
});
