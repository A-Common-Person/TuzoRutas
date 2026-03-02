import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";

import { rutas } from "../../src/data/rutas";
import { Ruta } from "../../src/types";

export default function HomeScreen() {
  const [rutaActiva, setRutaActiva] = useState<Ruta | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const seleccionarRuta = (ruta: Ruta) => {
    setRutaActiva(ruta);

    // Centrar mapa en la trayectoria
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        ruta.trayectoria.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
        })),
        {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TuzoRutas</Text>
      </View>

      {/* Botones de rutas */}
      <ScrollView horizontal style={styles.menu} showsHorizontalScrollIndicator={false}>
        {rutas.map((ruta) => (
          <TouchableOpacity
            key={ruta.id}
            style={[styles.button, { backgroundColor: ruta.color }]}
            onPress={() => seleccionarRuta(ruta)}
          >
            <Text style={styles.buttonText}>{ruta.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 20.1011,
          longitude: -98.7591,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Base Carto */}
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maximumZ={19}
        />

        {/* Ruta activa */}
        {rutaActiva && (
          <>
            {/* Línea siguiendo calles */}
            <Polyline
              coordinates={rutaActiva.trayectoria.map((p) => ({
                latitude: p.lat,
                longitude: p.lng,
              }))}
              strokeColor={rutaActiva.color}
              strokeWidth={5}
            />

            {/* Paradas (si existen) */}
            {rutaActiva.paradas.length > 0 &&
              rutaActiva.paradas.map((p, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: p.lat,
                    longitude: p.lng,
                  }}
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
    height: 65,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  menu: {
    maxHeight: 65,
    paddingVertical: 8,
    backgroundColor: "#f2f2f2",
  },

  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  map: { flex: 1 },
});