// Importa los componentes y módulos necesarios
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
} from "react-native"; // Componentes de React Native
import React, { useState, useContext } from "react"; // Importa React y hooks
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento local
import * as ImagePicker from "expo-image-picker"; // Selector de imágenes
import { ThemeContext } from "../app/_layout"; // Contexto para el tema oscuro/claro

// Componente principal para gestionar los vehículos
export function MisVehiculos() {
  const { isDarkMode } = useContext(ThemeContext); // Obtiene el estado del tema oscuro/claro
  const [vehicles, setVehicles] = useState([]); // Estado para la lista de vehículos
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar/ocultar el modal
  const [matricula, setMatricula] = useState(""); // Estado para la matrícula del vehículo
  const [modelo, setModelo] = useState(""); // Estado para el modelo del vehículo
  const [etiqueta, setEtiqueta] = useState(""); // Estado para la etiqueta ambiental
  const [imageUrl, setImageUrl] = useState(""); // Estado para la URL de la imagen del vehículo

  // Lista de etiquetas ambientales con sus imágenes correspondientes
  const etiquetas = [
    { name: "0", image: require("../assets/distintivo_0.png") },
    { name: "B", image: require("../assets/distintivo_B.png") },
    { name: "C", image: require("../assets/distintivo_C.png") },
    { name: "ECO", image: require("../assets/distintivo_ECO.png") },
    { name: "Sin", image: require("../assets/distintivo_sin.png") },
  ];

  React.useEffect(() => {
    // Carga los vehículos guardados en AsyncStorage al iniciar el componente
    const loadVehicles = async () => {
      try {
        const savedVehicles = await AsyncStorage.getItem("vehicles"); // Obtiene los vehículos almacenados
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles).map((vehicle) => ({
            ...vehicle,
            image: vehicle.image || "default", // Asigna una imagen por defecto si no tiene
          }));
          setVehicles(parsedVehicles); // Actualiza el estado con los vehículos cargados
        }
      } catch (error) {
        console.error("Error loading vehicles:", error); // Manejo de errores
      }
    };
    loadVehicles(); // Llama a la función para cargar los vehículos
  }, []);

  React.useEffect(() => {
    // Guarda los vehículos en AsyncStorage cada vez que cambian
    const saveVehicles = async () => {
      try {
        await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles)); // Guarda los vehículos en formato JSON
      } catch (error) {
        console.error("Error saving vehicles:", error); // Manejo de errores
      }
    };
    saveVehicles(); // Llama a la función para guardar los vehículos
  }, [vehicles]); // Se ejecuta cuando cambia el estado "vehicles"

  React.useEffect(() => {
    // Solicita permisos para acceder a la galería de imágenes
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync(); // Solicita permisos
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería."); // Muestra un mensaje si no se otorgan permisos
      }
    };
    requestPermissions(); // Llama a la función para solicitar permisos
  }, []);

  const addVehicle = () => {
    // Valida los campos y agrega un nuevo vehículo a la lista
    if (!matricula || !modelo || !etiqueta) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos obligatorios." // Muestra un mensaje de error si faltan campos
      );
      return;
    }

    const newVehicle = {
      matricula, // Asigna la matrícula ingresada
      modelo, // Asigna el modelo ingresado
      etiqueta, // Asigna la etiqueta seleccionada
      image: imageUrl || "default", // Asigna la imagen seleccionada o una por defecto
    };
    setVehicles([...vehicles, newVehicle]); // Agrega el nuevo vehículo al estado
    setMatricula(""); // Limpia el campo de matrícula
    setModelo(""); // Limpia el campo de modelo
    setEtiqueta(""); // Limpia la etiqueta seleccionada
    setImageUrl(""); // Limpia la URL de la imagen
    setModalVisible(false); // Cierra el modal
  };

  const pickImage = async () => {
    // Abre la galería para seleccionar una imagen
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite solo imágenes
        allowsEditing: true, // Permite editar la imagen
        aspect: [4, 3], // Relación de aspecto
        quality: 1, // Calidad de la imagen
      });

      if (!result.canceled) {
        setImageUrl(result.assets[0].uri); // Asigna la URI de la imagen seleccionada
      }
    } catch (error) {
      console.error("Error picking image:", error); // Manejo de errores
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Si no hay vehículos, muestra un mensaje */}
      {vehicles.length === 0 ? (
        <Text
          style={[
            styles.noVehiclesText,
            isDarkMode && styles.darkNoVehiclesText,
          ]}
        >
          Aún no tienes vehículos
        </Text>
      ) : (
        // Si hay vehículos, los muestra en una lista
        <ScrollView style={styles.vehicleList}>
          {vehicles.map((vehicle, index) => (
            <View
              key={index}
              style={[styles.vehicleCard, isDarkMode && styles.darkVehicleCard]}
            >
              {/* Botón para eliminar un vehículo */}
              <TouchableOpacity
                style={styles.deleteIconContainer}
                onPress={() =>
                  setVehicles(
                    vehicles.filter((_, vehicleIndex) => vehicleIndex !== index) // Filtra y elimina el vehículo seleccionado
                  )
                }
              >
                <Text
                  style={[
                    styles.deleteIcon,
                    isDarkMode && styles.darkDeleteIcon,
                  ]}
                >
                  ✖
                </Text>
              </TouchableOpacity>
              {/* Imagen del vehículo */}
              <Image
                source={
                  vehicle.image === "default"
                    ? require("../assets/unknown_car.png") // Imagen por defecto
                    : { uri: vehicle.image } // Imagen seleccionada
                }
                style={styles.vehicleImage}
              />
              {/* Información del vehículo */}
              <View style={styles.vehicleInfo}>
                <Text
                  style={[
                    styles.vehicleText,
                    isDarkMode && styles.darkVehicleText,
                  ]}
                >
                  <Text style={styles.boldText}>Matrícula:</Text>{" "}
                  {vehicle.matricula}
                </Text>
                <Text
                  style={[
                    styles.vehicleText,
                    isDarkMode && styles.darkVehicleText,
                  ]}
                >
                  <Text style={styles.boldText}>Modelo:</Text> {vehicle.modelo}
                </Text>
              </View>
              {/* Imagen de la etiqueta ambiental */}
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
      {/* Botón para agregar un nuevo vehículo */}
      <TouchableOpacity
        style={[styles.addButton, isDarkMode && styles.darkAddButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.addButtonText, isDarkMode && styles.darkAddButtonText]}
        >
          +
        </Text>
      </TouchableOpacity>

      {/* Modal para agregar un nuevo vehículo */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              isDarkMode && styles.darkModalContainer,
            ]}
          >
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              placeholder="Matrícula"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              value={matricula}
              onChangeText={(text) => setMatricula(text.toUpperCase())}
            />
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              placeholder="Modelo de coche"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
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
                  <Text
                    style={[
                      styles.etiquetaText,
                      isDarkMode && styles.darkEtiquetaText,
                    ]}
                  >
                    {et.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.pickImageButton,
                isDarkMode && styles.darkPickImageButton,
              ]}
              onPress={pickImage}
            >
              <Text
                style={[
                  styles.pickImageButtonText,
                  isDarkMode && styles.darkPickImageButtonText,
                ]}
              >
                Seleccionar Imagen
              </Text>
            </TouchableOpacity>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            ) : null}
            <TouchableOpacity
              style={[
                styles.addVehicleButton,
                isDarkMode && styles.darkAddVehicleButton,
              ]}
              onPress={addVehicle}
            >
              <Text
                style={[
                  styles.addVehicleButtonText,
                  isDarkMode && styles.darkAddVehicleButtonText,
                ]}
              >
                Agregar
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  noVehiclesText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "gray",
  },
  darkNoVehiclesText: {
    color: "#aaa",
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
  darkVehicleCard: {
    backgroundColor: "#222",
    borderColor: "#444",
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
    // Cambiado el fondo para que coincida con el fondo de la tarjeta
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 2,
    overflow: "hidden",
  },
  darkDeleteIcon: {
    color: "#f55",
    backgroundColor: "transparent", // Coincide con el fondo oscuro de la tarjeta
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
    color: "#333",
  },
  darkVehicleText: {
    color: "#fff",
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
  darkAddButton: {
    backgroundColor: "#00509e",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  darkAddButtonText: {
    color: "#ddd",
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
  darkModalContainer: {
    backgroundColor: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  darkInput: {
    borderColor: "#555",
    color: "#fff",
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
    color: "#000",
  },
  darkEtiquetaText: {
    color: "#fff",
  },
  addVehicleButton: {
    backgroundColor: "#001f3f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  darkAddVehicleButton: {
    backgroundColor: "#003366",
  },
  addVehicleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  darkAddVehicleButtonText: {
    color: "#ddd",
  },
  pickImageButton: {
    backgroundColor: "#0074D9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  darkPickImageButton: {
    backgroundColor: "#00509e",
  },
  pickImageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  darkPickImageButtonText: {
    color: "#ddd",
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
