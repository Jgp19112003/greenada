import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function MisVehiculos() {
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [modelo, setModelo] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const etiquetas = [
    { name: "0", image: require("../assets/distintivo_0.png") },
    { name: "B", image: require("../assets/distintivo_B.png") },
    { name: "C", image: require("../assets/distintivo_C.png") },
    { name: "ECO", image: require("../assets/distintivo_ECO.png") },
    { name: "Sin", image: require("../assets/distintivo_sin.png") },
  ];

  // Load vehicles from AsyncStorage on component mount
  React.useEffect(() => {
    const loadVehicles = async () => {
      try {
        const savedVehicles = await AsyncStorage.getItem("vehicles");
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles).map((vehicle) => ({
            ...vehicle,
            image: vehicle.image || "default", // Assign "default" if no image is present
          }));
          setVehicles(parsedVehicles);
        }
      } catch (error) {
        console.error("Error loading vehicles:", error);
      }
    };
    loadVehicles();
  }, []);

  // Save vehicles to AsyncStorage whenever the vehicles state changes
  React.useEffect(() => {
    const saveVehicles = async () => {
      try {
        await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles));
      } catch (error) {
        console.error("Error saving vehicles:", error);
      }
    };
    saveVehicles();
  }, [vehicles]);

  const addVehicle = () => {
    if (!matricula || !modelo || !etiqueta) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    const newVehicle = {
      matricula,
      modelo,
      etiqueta,
      image: imageUrl || "default", // Use "default" as a placeholder identifier
    };
    setVehicles([...vehicles, newVehicle]);
    setMatricula("");
    setModelo("");
    setEtiqueta("");
    setImageUrl("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <Text style={styles.noVehiclesText}>Aún no tienes vehículos</Text>
      ) : (
        <ScrollView style={styles.vehicleList}>
          {vehicles.map((vehicle, index) => (
            <View key={index} style={styles.vehicleCard}>
              <TouchableOpacity
                style={styles.deleteIconContainer}
                onPress={() =>
                  setVehicles(
                    vehicles.filter((_, vehicleIndex) => vehicleIndex !== index)
                  )
                }
              >
                <Text style={styles.deleteIcon}>✖</Text>
              </TouchableOpacity>
              <Image
                source={
                  vehicle.image === "default"
                    ? require("../assets/unknown_car.png") // Handle default image
                    : { uri: vehicle.image }
                }
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleText}>
                  <Text style={styles.boldText}>Matrícula:</Text>{" "}
                  {vehicle.matricula}
                </Text>
                <Text style={styles.vehicleText}>
                  <Text style={styles.boldText}>Modelo:</Text> {vehicle.modelo}
                </Text>
              </View>
              <Image
                source={
                  etiquetas.find((et) => et.name === vehicle.etiqueta)?.image
                }
                style={styles.etiquetaImage}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              value={matricula}
              onChangeText={(text) => setMatricula(text.toUpperCase())} // Convert to uppercase
            />
            <TextInput
              style={styles.input}
              placeholder="Modelo de coche"
              value={modelo}
              onChangeText={setModelo}
            />
            <View style={styles.etiquetaSelector}>
              {etiquetas.map((et, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setEtiqueta(et.name)}
                  style={[
                    styles.etiquetaOption,
                    etiqueta === et.name && styles.selectedEtiqueta,
                  ]}
                >
                  <Image source={et.image} style={styles.etiquetaImage} />
                  <Text style={styles.etiquetaText}>{et.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            <TouchableOpacity
              style={styles.addVehicleButton}
              onPress={addVehicle}
            >
              <Text style={styles.addVehicleButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
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
  },
  noVehiclesText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "gray",
  },
  vehicleList: {
    flex: 1,
  },
  vehicleCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  deleteIconContainer: {
    position: "absolute",
    bottom: 5, // Move to the bottom
    right: 5, // Align to the right
    zIndex: 1,
  },
  deleteIcon: {
    fontSize: 18,
    color: "red",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    overflow: "hidden",
  },
  vehicleImage: {
    width: 80, // Fixed width
    height: 80, // Fixed height
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover", // Crops the sides if necessary to fill the container
    backgroundColor: "#f0f0f0", // Adds a background color for better contrast
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleText: {
    fontSize: 14,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  etiquetaImage: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#0074D9",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
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
    width: "90%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  etiquetaSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 5,
    width: "100%", // Match the width of other inputs
  },
  etiquetaOption: {
    alignItems: "center",
    justifyContent: "center",
    width: 50, // Reduced width to align with other inputs
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  selectedEtiqueta: {
    borderColor: "#0074D9",
    backgroundColor: "#e6f7ff",
  },
  etiquetaImage: {
    width: 35, // Reduced size to fit better
    height: 35,
    resizeMode: "contain",
    marginBottom: 5,
  },
  etiquetaText: {
    fontSize: 10, // Reduced font size for better alignment
    textAlign: "center",
  },
  addVehicleButton: {
    backgroundColor: "#001f3f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addVehicleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
