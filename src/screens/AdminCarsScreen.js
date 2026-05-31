import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { api } from '../api/client';
import { normalizeCars } from '../utils/cars';

const EMPTY = {
  brand: '',
  model: '',
  year: '',
  pricePerDay: '',
  fuelType: '',
  latitude: '',
  longitude: '',
};

function toPayload(form) {
  return {
    brand: form.brand.trim(),
    model: form.model.trim(),
    year: Number(form.year),
    pricePerDay: Number(form.pricePerDay),
    fuelType: form.fuelType.trim() || null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
  };
}

export default function AdminCarsScreen({ navigation }) {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCars = async () => {
    const data = await api.getCars();
    setCars(normalizeCars(data));
  };

  useEffect(() => {
    loadCars().catch(e => Alert.alert('Blad', e.message));
  }, []);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const startEdit = (car) => {
    setEditingId(car.serverId || car.id);
    setForm({
      brand: car.raw?.brand || car.short.split(' ')[0] || '',
      model: car.raw?.model || car.short.replace(`${car.raw?.brand || ''} `, ''),
      year: String(car.raw?.year || ''),
      pricePerDay: String(car.price || ''),
      fuelType: car.specs.fuel || '',
      latitude: car.latitude ? String(car.latitude) : '',
      longitude: car.longitude ? String(car.longitude) : '',
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.brand.trim() || !form.model.trim() || !form.year || !form.pricePerDay) {
      Alert.alert('Blad', 'Podaj marke, model, rok i cene');
      return;
    }
    setLoading(true);
    try {
      const payload = toPayload(form);
      if (editingId) await api.updateCar(editingId, payload);
      else await api.createCar(payload);
      await loadCars();
      reset();
    } catch (e) {
      Alert.alert('Blad zapisu', e.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (car) => {
    setLoading(true);
    try {
      await api.deleteCar(car.serverId || car.id);
      await loadCars();
      if (editingId === (car.serverId || car.id)) reset();
    } catch (e) {
      Alert.alert('Blad usuwania', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Panel administratora</Text>

        <View style={s.form}>
          <View style={s.row}>
            <TextInput style={[s.input, s.half]} placeholder="Marka" placeholderTextColor={COLORS.textMute} value={form.brand} onChangeText={v => updateField('brand', v)} />
            <TextInput style={[s.input, s.half]} placeholder="Model" placeholderTextColor={COLORS.textMute} value={form.model} onChangeText={v => updateField('model', v)} />
          </View>
          <View style={s.row}>
            <TextInput style={[s.input, s.half]} placeholder="Rok" placeholderTextColor={COLORS.textMute} value={form.year} onChangeText={v => updateField('year', v)} keyboardType="number-pad" />
            <TextInput style={[s.input, s.half]} placeholder="Cena/dzien" placeholderTextColor={COLORS.textMute} value={form.pricePerDay} onChangeText={v => updateField('pricePerDay', v)} keyboardType="numeric" />
          </View>
          <TextInput style={s.input} placeholder="Paliwo" placeholderTextColor={COLORS.textMute} value={form.fuelType} onChangeText={v => updateField('fuelType', v)} />
          <View style={s.row}>
            <TextInput style={[s.input, s.half]} placeholder="Latitude" placeholderTextColor={COLORS.textMute} value={form.latitude} onChangeText={v => updateField('latitude', v)} keyboardType="numeric" />
            <TextInput style={[s.input, s.half]} placeholder="Longitude" placeholderTextColor={COLORS.textMute} value={form.longitude} onChangeText={v => updateField('longitude', v)} keyboardType="numeric" />
          </View>
          <BtnPrimary title={loading ? 'Zapisywanie...' : editingId ? 'Zapisz zmiany' : 'Dodaj auto'} onPress={save} />
          {editingId && (
            <TouchableOpacity style={s.cancelBtn} onPress={reset}>
              <Text style={s.cancelText}>Anuluj edycje</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.list}>
          {cars.map(car => (
            <View key={car.serverId || car.id} style={s.card}>
              <View style={{ flex: 1 }}>
                <Text style={s.carName}>{car.name}</Text>
                <Text style={s.carMeta}>{car.price} zl/dzien - {car.specs.fuel}</Text>
                <Text style={s.carMeta}>{car.latitude || '-'}, {car.longitude || '-'}</Text>
              </View>
              <View style={s.actions}>
                <TouchableOpacity style={s.actionBtn} onPress={() => startEdit(car)}>
                  <Text style={s.actionText}>Edytuj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.actionBtn, s.deleteBtn]} onPress={() => remove(car)}>
                  <Text style={s.actionText}>Usun</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, textAlign: 'center' },
  form: { marginTop: 16, gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 11,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: COLORS.textMute, fontWeight: '700' },
  list: { marginTop: 18, gap: 10, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
  },
  carName: { color: COLORS.text, fontWeight: '800', fontSize: 13 },
  carMeta: { color: COLORS.textMute, fontWeight: '600', fontSize: 11, marginTop: 3 },
  actions: { gap: 8, justifyContent: 'center' },
  actionBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 7, paddingHorizontal: 10 },
  deleteBtn: { backgroundColor: '#dc2626' },
  actionText: { color: '#fff', fontWeight: '800', fontSize: 11 },
});
