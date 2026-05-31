import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';

function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return '-';
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function ConfirmLayout({ navigation, route, success }) {
  const booking = route?.params?.booking;
  const car = route?.params?.car;
  const days = route?.params?.days;
  const total = route?.params?.total;
  const carName = car?.name || (booking?.car ? `${booking.car.brand} ${booking.car.model}, ${booking.car.year}` : null);

  return (
    <Screen style={s.center}>
      <Text style={s.title}>Potwierdzenie{'\n'}rezerwacji</Text>

      <Text style={s.msg}>
        {success
          ? 'Rezerwacja na wynajem samochodu\nzostała pomyślnie potwierdzona.'
          : 'Nie udało się dokonać rezerwacji.\nWypróbuj inną metodę płatności!'}
      </Text>

      {success && booking && (
        <View style={s.receipt}>
          {carName && <Text style={s.rCar}>{carName}</Text>}
          {booking.startDate && (
            <Text style={s.rLine}>{fmtDate(booking.startDate)} - {fmtDate(booking.endDate)}{days ? ` (${days} dni)` : ''}</Text>
          )}
          <View style={s.rDivider} />
          <View style={s.rRow}>
            <Text style={s.rLabel}>Razem do zaplaty</Text>
            <Text style={s.rTotal}>{total != null ? total : booking.totalPrice} zl</Text>
          </View>
          <Text style={s.rNote}>Nr rezerwacji: #{booking.id}</Text>
        </View>
      )}

      <Text style={s.msg}>
        Jeżeli masz problem, skontaktuj się z{'\n'}nami!{'\n'}Telefon: +48 123 456 789
      </Text>

      <View style={{ flex: 1 }} />

      <BtnPrimary title="Home" onPress={() => navigation.popToTop()} style={{ marginBottom: 6, alignSelf: 'stretch' }} />
    </Screen>
  );
}

export function ConfirmSuccessScreen({ navigation, route }) {
  return <ConfirmLayout navigation={navigation} route={route} success />;
}

export function ConfirmFailScreen({ navigation, route }) {
  return <ConfirmLayout navigation={navigation} route={route} success={false} />;
}

const s = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: 80 },
  title: { color: COLORS.text, fontWeight: '800', fontSize: 22, textAlign: 'center', lineHeight: 26 },
  msg: { color: COLORS.text, fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: 30, lineHeight: 19 },
  receipt: {
    alignSelf: 'stretch', marginTop: 24, backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, gap: 6,
  },
  rCar: { color: COLORS.text, fontWeight: '800', fontSize: 14, textAlign: 'center' },
  rLine: { color: COLORS.textDim, fontWeight: '600', fontSize: 12, textAlign: 'center' },
  rDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },
  rRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rLabel: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  rTotal: { color: COLORS.primary, fontWeight: '800', fontSize: 18 },
  rNote: { color: COLORS.textMute, fontWeight: '600', fontSize: 10, textAlign: 'center', marginTop: 2 },
});
