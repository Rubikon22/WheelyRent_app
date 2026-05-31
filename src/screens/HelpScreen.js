import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import { BtnGhostWhite } from '../components/Btn';
import Screen from '../components/Screen';

const FAQ = [
  { key: 'report', label: 'Jak zgłosić problem?' },
  { key: 'edit', label: 'Jak edytować rezerwacje?' },
  { key: 'pay', label: 'Opcje płatności' },
  { key: 'cancel', label: 'Jak anulować rezerwacje?' },
];

export default function HelpScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = FAQ.filter(q => {
    if (!query.trim()) return true;
    return q.label.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <Screen>
      <Text style={s.title}>Centrum pomocy</Text>

      <View style={s.searchWrap}>
        <View style={s.searchIcon}>
          <Icon name="search" size={14} color="#1a1530" strokeWidth={2.2} />
        </View>
        <TextInput
          style={s.searchInput}
          placeholder="Szukaj"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity style={s.clearBtn} onPress={() => setQuery('')}>
            <Text style={s.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.faqLabel}>Często zadawane pytania</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 9 }}>
          {filtered.length === 0 ? (
            <Text style={s.empty}>Nie znaleziono wyników</Text>
          ) : (
            filtered.map(q => (
              <TouchableOpacity key={q.key} style={s.pill} onPress={() => navigation.navigate('HelpAnswer', { key: q.key })}>
                <Text style={s.pillText}>{q.label}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BtnGhostWhite title="FAQ" style={{ marginBottom: 4 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20 },
  searchWrap: { position: 'relative', marginTop: 14 },
  searchIcon: { position: 'absolute', left: 12, top: 10, zIndex: 1 },
  searchInput: {
    backgroundColor: '#fff', color: '#1a1530', borderRadius: 18,
    paddingVertical: 9, paddingLeft: 34, paddingRight: 40, fontWeight: '600', fontSize: 13,
  },
  clearBtn: { position: 'absolute', right: 12, top: 8, zIndex: 1 },
  clearText: { color: '#999', fontSize: 16, fontWeight: '700' },
  faqLabel: { fontWeight: '800', fontSize: 12, marginTop: 22, color: COLORS.textDim },
  empty: { color: COLORS.textMute, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 30 },
  pill: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center',
  },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 13, textAlign: 'center' },
});
