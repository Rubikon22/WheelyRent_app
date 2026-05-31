import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { useProfile } from '../context/ProfileContext';
import { api } from '../api/client';

function CardIcon({ type }) {
  if (type === 'visa') {
    return (
      <View style={[cs.brandTile, { backgroundColor: '#1a1f71' }]}>
        <Text style={cs.brandText}>VISA</Text>
      </View>
    );
  }
  return (
    <View style={[cs.brandTile, { backgroundColor: '#fff', overflow: 'hidden' }]}>
      <View style={[cs.mcCircle, { backgroundColor: '#eb001b', left: 4 }]} />
      <View style={[cs.mcCircle, { backgroundColor: '#f79e1b', right: 4 }]} />
    </View>
  );
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

const cs = StyleSheet.create({
  brandTile: { width: 42, height: 26, borderRadius: 4, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  brandText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  mcCircle: { width: 14, height: 14, borderRadius: 7, position: 'absolute' },
});

export default function PaymentScreen({ route, navigation }) {
  const { profile, addCard } = useProfile();
  const [selected, setSelected] = useState(profile.cards[0]?.id || null);
  const [showAdd, setShowAdd] = useState(false);
  const [newNum, setNewNum] = useState('');
  const [newType, setNewType] = useState('visa');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    const digits = newNum.replace(/\s/g, '');
    if (digits.length !== 16) {
      Alert.alert('Blad', 'Podaj pelny 16-cyfrowy numer karty');
      return;
    }
    addCard({ type: newType, last4: digits.slice(-4) });
    setNewNum('');
    setShowAdd(false);
  };

  const handlePay = async () => {
    if (loading) return;
    if (!selected) {
      Alert.alert('Blad', 'Wybierz metode platnosci');
      return;
    }
    if (!route.params?.carId) {
      navigation.navigate('ConfirmFail');
      return;
    }

    setLoading(true);
    try {
      const startDate = addDays(new Date(), 1);
      const endDate = addDays(startDate, route.params.days || 1);
      const booking = await api.createBooking(route.params.carId, startDate.toISOString(), endDate.toISOString(), route.params.extrasCost || 0);
      navigation.navigate('ConfirmSuccess', {
        booking,
        car: route.params.car,
        days: route.params.days,
        total: route.params.total,
      });
    } catch (e) {
      Alert.alert('Rezerwacja nieudana', e.message);
      navigation.navigate('ConfirmFail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <Text style={s.title}>Wybierz metode platnosci</Text>

      <View style={{ gap: 10 }}>
        {profile.cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[s.payCard, selected === card.id && s.payCardSelected]}
            onPress={() => setSelected(card.id)}
          >
            <CardIcon type={card.type} />
            <Text style={s.cardNum}>**** {card.last4}</Text>
            <View style={{ flex: 1 }} />
            {selected === card.id && <View style={s.checkDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {profile.cards.length === 0 && (
        <Text style={s.noCards}>Brak zapisanych kart. Dodaj karte ponizej.</Text>
      )}

      {!showAdd ? (
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Text style={s.addBtnText}>+ Dodaj metode platnosci</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.addForm}>
          <View style={s.typeRow}>
            <TouchableOpacity
              style={[s.typeBtn, newType === 'visa' && s.typeBtnActive]}
              onPress={() => setNewType('visa')}
            >
              <Text style={[s.typeBtnText, newType === 'visa' && s.typeBtnTextActive]}>VISA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.typeBtn, newType === 'mastercard' && s.typeBtnActive]}
              onPress={() => setNewType('mastercard')}
            >
              <Text style={[s.typeBtnText, newType === 'mastercard' && s.typeBtnTextActive]}>Mastercard</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={s.input}
            placeholder="Numer karty (16 cyfr)"
            placeholderTextColor={COLORS.textMute}
            value={newNum}
            onChangeText={(text) => setNewNum(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={16}
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity style={s.confirmBtn} onPress={handleAdd}>
              <Text style={s.confirmText}>Dodaj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelCardBtn} onPress={() => { setShowAdd(false); setNewNum(''); }}>
              <Text style={s.cancelCardText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <BtnPrimary title={loading ? 'Rezerwacja...' : 'Zaplac'} onPress={handlePay} style={{ marginBottom: 4 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  payCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
  },
  payCardSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  cardNum: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  checkDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.primary },
  noCards: { color: COLORS.textMute, fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 20 },
  addBtn: {
    backgroundColor: '#3b82f6', paddingVertical: 12, borderRadius: 22,
    alignItems: 'center', marginTop: 14,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  addForm: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 14, marginTop: 14,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  typeBtn: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeBtnText: { color: COLORS.textDim, fontWeight: '700', fontSize: 12 },
  typeBtnTextActive: { color: '#fff' },
  input: {
    backgroundColor: COLORS.bgCardSoft, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 11, paddingHorizontal: 14, color: COLORS.text, fontSize: 14, fontWeight: '600',
  },
  confirmBtn: {
    flex: 1, backgroundColor: COLORS.primary, paddingVertical: 10,
    borderRadius: 18, alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelCardBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10,
    borderRadius: 18, alignItems: 'center',
  },
  cancelCardText: { color: COLORS.textMute, fontWeight: '700', fontSize: 13 },
});
