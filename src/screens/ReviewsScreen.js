import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { CARS } from '../constants/cars';
import { StarRow } from '../components/Icons';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';

export default function ReviewsScreen({ route, navigation }) {
  const car = route.params?.car || CARS.find(c => c.id === route.params.carId);
  if (!car) return null;

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <Text style={s.title}>Opinie i oceny{'\n'}innych użytkowników</Text>

      <View style={s.ratingRow}>
        <Text style={s.ratingBig}>{car.rating}</Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <StarRow value={car.ratingNum} size={18} />
        </View>
      </View>
      <Text style={s.avg}>średnia ocen</Text>

      <Text style={s.lastTitle}>Ostatnie opinie:</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 9 }}>
          {car.reviews.map((r, i) => (
            <View key={i} style={s.review}>
              <View style={s.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={s.revName}>{r.name}</Text>
                <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
                  <StarRow value={r.stars} size={12} />
                </View>
                {r.text ? <Text style={s.revText}>{r.text}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, lineHeight: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  ratingBig: { color: COLORS.text, fontWeight: '800', fontSize: 24 },
  avg: { color: COLORS.textMute, fontSize: 11, fontWeight: '700', marginTop: 2 },
  lastTitle: { color: COLORS.text, fontWeight: '800', fontSize: 14, marginTop: 16, marginBottom: 8 },
  review: {
    flexDirection: 'row', gap: 10, backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10,
  },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#d9d9d9' },
  revName: { color: COLORS.text, fontWeight: '800', fontSize: 13 },
  revText: { color: COLORS.text, fontWeight: '700', fontSize: 11, marginTop: 4, lineHeight: 15 },
});
