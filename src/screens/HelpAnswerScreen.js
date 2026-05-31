import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';

const ANSWERS = {
  report: {
    q: 'Jak zgłosić problem?',
    a: 'Możesz zgłosić swój problem naszemu pracownikowi w czacie prywatnym lub zadzwonić pod numer infolinii:',
  },
  edit: {
    q: 'Jak edytować rezerwacje?',
    a: 'Jeśli masz problem z edycją rezerwacji online, skontaktuj się z naszym działem obsługi klienta - chętnie pomożemy!',
  },
  pay: {
    q: 'Opcje płatności',
    a: 'Zapłacić za wynajem możesz tylko kartą debetową, visa lub mastercart. Pozostałe metody będą dostępne później.',
  },
  cancel: {
    q: 'Jak anulować rezerwacje?',
    a: 'Skontaktuj się z naszym działem obsługi klienta, przygotuj numer swojej rezerwacji oraz dane osoby, na którą została dokonana, i czekaj na odpowiedź.',
  },
};

export default function HelpAnswerScreen({ route, navigation }) {
  const data = ANSWERS[route.params.key];
  if (!data) return null;

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Centrum pomocy</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>{data.q}</Text>
        </View>

        <View style={[s.card, { marginTop: 14 }]}>
          <Text style={s.answer}>{data.a}</Text>
          <View style={s.phoneLine}>
            <Icon name="phone" size={13} color="#1a1530" />
            <Text style={s.phoneText}>Telefon: +48123456789</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginTop: 18 },
  cardTitle: { color: '#1a1530', fontWeight: '800', fontSize: 14 },
  answer: { color: '#1a1530', fontWeight: '700', fontSize: 13, lineHeight: 19 },
  phoneLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  phoneText: { color: '#1a1530', fontWeight: '700', fontSize: 12 },
});
