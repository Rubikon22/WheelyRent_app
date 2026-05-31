import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

export function BtnPrimary({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[s.primary, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={s.primaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function BtnGhostWhite({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[s.ghostWhite, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={s.ghostWhiteText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function BtnOutline({ title, onPress, style, icon }) {
  return (
    <TouchableOpacity style={[s.outline, style]} onPress={onPress} activeOpacity={0.8}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {icon}
        <Text style={s.outlineText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 14, fontFamily: 'Inter_700Bold' },
  ghostWhite: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
  },
  ghostWhiteText: { color: '#1a1530', fontWeight: '700', fontSize: 14, fontFamily: 'Inter_700Bold' },
  outline: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
  },
  outlineText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
