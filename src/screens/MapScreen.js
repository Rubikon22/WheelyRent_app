import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants/theme';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import { CARS } from '../constants/cars';
import { api } from '../api/client';
import { normalizeCars } from '../utils/cars';

const LOCAL_COORDS = {
  mustang: { latitude: 52.2350, longitude: 21.0000 },
  audi: { latitude: 52.2220, longitude: 21.0180 },
  suzuki: { latitude: 52.2380, longitude: 21.0250 },
  bmw: { latitude: 52.2270, longitude: 20.9950 },
  toyota: { latitude: 52.2190, longitude: 21.0300 },
  mercedes: { latitude: 52.2410, longitude: 21.0080 },
  vw: { latitude: 52.2150, longitude: 21.0050 },
};

function buildMapHtml(markers) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([52.2297, 21.0122], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    var markers = ${JSON.stringify(markers)};
    markers.forEach(function(m) {
      L.marker([m.lat, m.lng], { icon: icon }).addTo(map).bindPopup(m.title);
    });
  </script>
</body>
</html>
`;
}

export default function MapScreen({ navigation }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getCars()
      .then(data => active && setCars(normalizeCars(data)))
      .catch(() => {
        if (!active) return;
        setCars(CARS.map(car => ({ ...car, ...(LOCAL_COORDS[car.id] || {}) })));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const markers = cars
    .filter(car => car.latitude && car.longitude)
    .map(car => ({
      lat: car.latitude,
      lng: car.longitude,
      title: `${car.name} - ${car.price}zl/dzien`,
    }));

  const mapHtml = useMemo(() => buildMapHtml(markers), [markers]);

  return (
    <Screen>
      <Text style={s.title}>Zobacz auta obok ciebie</Text>

      <View style={s.mapWrap}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
        ) : (
          <WebView
            source={{ html: mapHtml }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            scrollEnabled={false}
          />
        )}
      </View>

      <BtnPrimary title="Home" onPress={() => navigation.navigate('HomeTab')} style={{ marginTop: 14 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 22, textAlign: 'center' },
  mapWrap: {
    flex: 1, marginTop: 22, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
});
