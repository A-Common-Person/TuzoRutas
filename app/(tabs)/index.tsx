import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";

import rutasData from "../../src/data/rutas.json";
import { Ruta } from "../../src/types";

const rutas: Ruta[] = rutasData;

export default function HomeScreen() {
  const [rutaActiva, setRutaActiva] = useState<Ruta | null>(null);

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TuzoRutas</Text>
      </View>

      {/* Botones de rutas */}
      <ScrollView horizontal style={styles.menu}>
        {rutas.map((ruta) => (
          <TouchableOpacity
            key={ruta.id}
            style={[styles.button, { backgroundColor: ruta.color }]}
            onPress={() => setRutaActiva(ruta)}
          >
            <Text style={styles.buttonText}>{ruta.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.1011,
          longitude: -98.7591,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Base de Carto */}
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maximumZ={19}
        />

        {/* Dibujar ruta activa */}
        {rutaActiva && (
          <>
            <Polyline
              coordinates={rutaActiva.paradas.map((p) => ({
                latitude: p.lat,
                longitude: p.lng,
              }))}
              strokeColor={rutaActiva.color}
              strokeWidth={4}
            />
            {rutaActiva.paradas.map((p, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: p.lat, longitude: p.lng }}
                title={p.nombre}
              />
            ))}
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { color: "white", fontSize: 22, fontWeight: "bold" },
  menu: {
    maxHeight: 60,
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  map: { flex: 1 },
});