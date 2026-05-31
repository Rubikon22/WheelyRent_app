import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import CarImage from '../components/CarImage';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { api } from '../api/client';
import { getFallbackCar, normalizeCar } from '../utils/cars';

export default function CarDetailsScreen({ route, navigation }) {
  const [car, setCar] = useState(route.params?.car || null);
  const [loading, setLoading] = useState(!route.params?.car);

  useEffect(() => {
    if (!route.params?.carId || route.params?.car) return;
    let active = true;
    api.getCar(route.params.carId)
      .then(data => active && setCar(normalizeCar(data)))
      .catch(() => active && setCar(getFallbackCar(route.params.carId)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [route.params?.carId, route.params?.car]);

  if (loading) {
    return (
      <Screen style={{ justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} />
      </Screen>
    );
  }
  if (!car) return null;

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <CarImage car={car} style={s.heroImg} />
        <Text style={s.name}>{car.name}</Text>

        <View style={s.ratingRow}>
          <Text style={s.ratingText}>* {car.rating}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reviews', { car })}>
            <Text style={s.reviewLink}>Wszystkie opinie</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.specTitle}>Specyfikacja</Text>
        <View style={s.specGrid}>
          <View style={s.specRow}>
            <Text style={s.specK}>Nadwozie</Text>
            <Text style={s.specV}>{car.specs.body}  <Text style={{ color: COLORS.textMute }}>{car.specs.fuel}</Text></Text>
          </View>
          <View style={s.specRow}>
            <Text style={s.specK}>Przebieg</Text>
            <Text style={s.specV}>{car.specs.mileage}</Text>
          </View>
          <View style={s.specRow}>
            <Text style={s.specK}>Moc</Text>
            <Text style={s.specV}>{car.specs.power}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <Text style={s.perDay}>Za dzien</Text>
        <Text style={s.bigPrice}>{car.price} zl</Text>
        <BtnPrimary title="Wybierz" onPress={() => navigation.navigate('ExtraOptions', { carId: car.serverId || car.id, car })} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  heroImg: { height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  name: { color: COLORS.text, fontWeight: '800', fontSize: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  ratingText: { color: COLORS.star, fontWeight: '800', fontSize: 13 },
  reviewLink: { color: COLORS.textMute, fontSize: 11, fontWeight: '700', textDecorationLine: 'underline' },
  specTitle: { color: COLORS.text, fontWeight: '800', fontSize: 14, marginTop: 14 },
  specGrid: { marginTop: 8, gap: 8 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between' },
  specK: { color: COLORS.textMute, fontWeight: '700', fontSize: 12, textTransform: 'capitalize' },
  specV: { color: COLORS.text, fontWeight: '700', fontSize: 12 },
  footer: { paddingBottom: 4 },
  perDay: { color: COLORS.textDim, fontSize: 12, fontWeight: '700' },
  bigPrice: { color: COLORS.text, fontWeight: '800', fontSize: 24, marginTop: 2, marginBottom: 8 },
});
