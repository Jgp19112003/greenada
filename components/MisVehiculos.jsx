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
import * as ImagePicker from "expo-image-picker";
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

  React.useEffect(() => {
    // Comentario detallado: useEffect para cargar los vehículos guardados en AsyncStorage cuando inicia el componente
    const loadVehicles = async () => {
      try {
        const savedVehicles = await AsyncStorage.getItem("vehicles");
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles).map((vehicle) => ({
            ...vehicle,
            image: vehicle.image || "default",
          }));
          setVehicles(parsedVehicles);
        }
      } catch (error) {
        console.error("Error loading vehicles:", error);
      }
    };
    loadVehicles();
  }, []);

  React.useEffect(() => {
    // Comentario detallado: useEffect para actualizar AsyncStorage cada vez que cambia el array 'vehicles'
    const saveVehicles = async () => {
      try {
        await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles));
      } catch (error) {
        console.error("Error saving vehicles:", error);
      }
    };
    saveVehicles();
  }, [vehicles]);

  React.useEffect(() => {
    // Comentario detallado: requestPermissions solicita permiso para acceder a la galería a través de ImagePicker
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería.");
      }
    };
    requestPermissions();
  }, []);

  const addVehicle = () => {
    // Comentario detallado: addVehicle valida campos y agrega un nuevo vehículo a la lista, incluyendo matrícula, modelo y etiqueta
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
      image: imageUrl || "default",
    };
    setVehicles([...vehicles, newVehicle]);
    setMatricula("");
    setModelo("");
    setEtiqueta("");
    setImageUrl("");
    setModalVisible(false);
  };

  const pickImage = async () => {
    // Comentario detallado: pickImage lanza la galería y devuelve la URI de la imagen seleccionada
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
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
                    ? require("../assets/unknown_car.png")
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
              onChangeText={(text) => setMatricula(text.toUpperCase())}
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
            <TouchableOpacity
              style={styles.pickImageButton}
              onPress={pickImage}
            >
              <Text style={styles.pickImageButtonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            ) : null}
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
    bottom: 5,
    right: 5,
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
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
    width: "100%",
  },
  etiquetaOption: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
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
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginBottom: 5,
  },
  etiquetaText: {
    fontSize: 10,
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
  pickImageButton: {
    backgroundColor: "#0074D9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  pickImageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
});

// Gestión de vehículos que el usuario desea guardar.
// useState para manejar la lista de vehículos, y estados para el modal
// addVehicle: añade un nuevo vehículo al array local y persiste en AsyncStorage
// pickImage: abre la galería para adjuntar imagen del coche
// Se muestran los vehículos en una lista, cada uno con:
//   - Matrícula, modelo, etiqueta ambiental
//   - Imagen por defecto o la elegida por el usuario
// Un botón "+" permite abrir un modal para crear un vehículo nuevo
