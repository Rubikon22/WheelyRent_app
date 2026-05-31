import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { CARS } from '../constants/cars';
import { Icon } from '../components/Icons';
import CarImage from '../components/CarImage';
import Screen from '../components/Screen';
import { api } from '../api/client';
import { normalizeCars } from '../utils/cars';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [cars, setCars] = useState(CARS);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    api.getCars()
      .then(data => {
        if (!active) return;
        setCars(normalizeCars(data));
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;
        setCars(CARS);
        setOffline(true);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = cars.filter(car => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      car.name.toLowerCase().includes(q) ||
      car.short.toLowerCase().includes(q) ||
      car.specs.body.toLowerCase().includes(q) ||
      car.specs.fuel.toLowerCase().includes(q) ||
      String(car.price).includes(q)
    );
  });

  return (
    <Screen>
      <Text style={s.title}>Wynajmij{'\n'}samochod</Text>

      <View style={s.searchWrap}>
        <View style={s.searchIcon}>
          <Icon name="search" size={16} color={COLORS.textMute} />
        </View>
        <TextInput
          style={s.searchInput}
          placeholder="Szukaj"
          placeholderTextColor={COLORS.textMute}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity style={s.clearBtn} onPress={() => setQuery('')}>
            <Text style={s.clearText}>x</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.subtitle}>
        {query.trim() ? `Wyniki: ${filtered.length}` : 'Polecane samochody'}
      </Text>
      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginBottom: 8 }} />}
      {offline && <Text style={s.notice}>Brak polaczenia z API - pokazano dane lokalne.</Text>}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 10, paddingBottom: 10 }}>
          {filtered.length === 0 ? (
            <Text style={s.empty}>Nie znaleziono samochodow</Text>
          ) : (
            filtered.map(car => (
              <TouchableOpacity
                key={car.serverId || car.id}
                style={s.carRow}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CarDetails', { carId: car.serverId || car.id, car })}
              >
                <CarImage car={car} style={s.carImg} />
                <View style={s.carMeta}>
                  <Text style={s.carName}>{car.name}</Text>
                  <Text style={s.carPrice}>{car.priceLabel}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 22, lineHeight: 26 },
  searchWrap: { position: 'relative', marginTop: 14 },
  searchIcon: { position: 'absolute', left: 12, top: 12, zIndex: 1 },
  searchInput: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18,
    paddingVertical: 10, paddingLeft: 36, paddingRight: 40, color: COLORS.text, fontSize: 14, fontWeight: '600',
  },
  clearBtn: { position: 'absolute', right: 12, top: 10, zIndex: 1 },
  clearText: { color: COLORS.textMute, fontSize: 16, fontWeight: '700' },
  subtitle: { fontWeight: '800', fontSize: 15, color: COLORS.text, marginTop: 16, marginBottom: 8 },
  notice: { color: COLORS.textMute, fontSize: 11, fontWeight: '700', marginBottom: 8 },
  empty: { color: COLORS.textMute, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 40 },
  carRow: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, overflow: 'hidden', height: 80,
  },
  carImg: { width: 120, height: '100%' },
  carMeta: { flex: 1, padding: 10, justifyContent: 'space-between' },
  carName: { color: COLORS.text, fontWeight: '700', fontSize: 13, lineHeight: 16 },
  carPrice: { color: COLORS.text, fontWeight: '800', fontSize: 12, alignSelf: 'flex-end' },
});
