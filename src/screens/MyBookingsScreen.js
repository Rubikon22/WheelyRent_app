import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import CarPlaceholder from '../components/CarPlaceholder';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { api } from '../api/client';

function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return '-';
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function daysBetween(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function MyBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.myBookings();
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Nie udalo sie pobrac rezerwacji');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleCancel = (booking) => {
    Alert.alert(
      'Anulowac rezerwacje?',
      `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim(),
      [
        { text: 'Nie', style: 'cancel' },
        {
          text: 'Tak, anuluj',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.cancelBooking(booking.id);
              load();
            } catch (e) {
              Alert.alert('Blad', e.message || 'Nie udalo sie anulowac');
            }
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <Text style={s.title}>Moje rezerwacje</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {error && <Text style={s.error}>{error}</Text>}

          {!error && bookings.length === 0 && (
            <Text style={s.empty}>Nie masz jeszcze zadnych rezerwacji.</Text>
          )}

          <View style={{ gap: 10, paddingBottom: 12, marginTop: 8 }}>
            {bookings.map(b => {
              const car = b.car || {};
              const days = daysBetween(b.startDate, b.endDate);
              const cancelled = b.status === 'CANCELLED';
              return (
                <View key={b.id} style={[s.card, cancelled && s.cardCancelled]}>
                  <View style={s.row}>
                    <CarPlaceholder kind={car.externalId || car.id} style={s.img} />
                    <View style={s.meta}>
                      <Text style={s.carName}>{car.brand} {car.model}, {car.year}</Text>
                      <Text style={s.dates}>{fmtDate(b.startDate)} - {fmtDate(b.endDate)} ({days} dni)</Text>
                      <Text style={s.price}>{b.totalPrice} zl</Text>
                    </View>
                    <View style={[s.statusBadge, cancelled ? s.statusCancelled : s.statusActive]}>
                      <Text style={s.statusText}>{cancelled ? 'Anulowana' : 'Aktywna'}</Text>
                    </View>
                  </View>

                  {!cancelled && (
                    <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(b)}>
                      <Text style={s.cancelText}>Anuluj rezerwacje</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, textAlign: 'center', marginBottom: 6 },
  empty: { color: COLORS.textMute, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 50 },
  error: { color: '#ef4444', fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 20 },
  card: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 10, overflow: 'hidden',
  },
  cardCancelled: { opacity: 0.55 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  img: { width: 80, height: 60, borderRadius: 8, overflow: 'hidden' },
  meta: { flex: 1, gap: 3 },
  carName: { color: COLORS.text, fontWeight: '800', fontSize: 13 },
  dates: { color: COLORS.textDim, fontWeight: '600', fontSize: 11 },
  price: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusActive: { backgroundColor: '#059669' },
  statusCancelled: { backgroundColor: '#6b7280' },
  statusText: { color: '#fff', fontWeight: '700', fontSize: 10 },
  cancelBtn: {
    marginTop: 10, borderWidth: 1, borderColor: '#ef4444', borderRadius: 18,
    paddingVertical: 8, alignItems: 'center',
  },
  cancelText: { color: '#ef4444', fontWeight: '700', fontSize: 12 },
});
