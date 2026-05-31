import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { EXTRA_OPTIONS } from '../constants/cars';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';

export default function ExtraOptionsScreen({ route, navigation }) {
  const { carId, car } = route.params;
  const [selected, setSelected] = useState({});

  const chosen = EXTRA_OPTIONS.filter(o => selected[o.id]);
  const extrasPerDay = chosen.filter(o => o.perDay).reduce((sum, o) => sum + o.price, 0);
  const extrasOnce = chosen.filter(o => !o.perDay).reduce((sum, o) => sum + o.price, 0);

  const handleNext = () => {
    navigation.navigate('Summary', {
      carId,
      car,
      extras: chosen.length > 0 ? chosen.map(o => o.label).join(', ') : null,
      extrasCount: chosen.length,
      extrasPerDay,
      extrasOnce,
    });
  };

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <Text style={s.title}>Opcje dodatkowe</Text>
      <Text style={s.subtitle}>Wybierz opcje, które Cię interesują</Text>

      <View style={{ marginTop: 20, gap: 14 }}>
        {EXTRA_OPTIONS.map(o => (
          <TouchableOpacity
            key={o.id}
            style={s.row}
            onPress={() => setSelected(p => ({ ...p, [o.id]: !p[o.id] }))}
          >
            <View style={[s.dot, !selected[o.id] && s.dotEmpty]} />
            <Text style={s.label}>{o.label}</Text>
            <Text style={s.price}>+{o.price} zł{o.perDay ? '/dzień' : ' jednorazowo'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {(extrasPerDay > 0 || extrasOnce > 0) && (
        <View style={s.totalBox}>
          {extrasPerDay > 0 && (
            <Text style={s.totalLine}>Opcje dzienne: +{extrasPerDay} zł/dzień</Text>
          )}
          {extrasOnce > 0 && (
            <Text style={s.totalLine}>Opcje jednorazowe: +{extrasOnce} zł</Text>
          )}
        </View>
      )}

      <View style={{ flex: 1 }} />

      <BtnPrimary title="Dalej" onPress={handleNext} />
      <TouchableOpacity onPress={() => navigation.navigate('Summary', { carId, car, extras: null, extrasCount: 0, extrasPerDay: 0, extrasOnce: 0 })} style={s.skipBtn}>
        <Text style={s.skipText}>Pomiń</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, textAlign: 'center' },
  subtitle: { color: COLORS.textDim, fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' },
  dotEmpty: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#fff' },
  label: { color: COLORS.text, fontWeight: '800', fontSize: 13, flex: 1 },
  price: { color: COLORS.textDim, fontWeight: '700', fontSize: 12 },
  totalBox: { marginTop: 20, gap: 4 },
  totalLine: { color: COLORS.primary, fontWeight: '800', fontSize: 14, textAlign: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  skipText: { color: COLORS.textMute, fontWeight: '700', fontSize: 14 },
});
