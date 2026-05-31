import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { Icon } from './Icons';

export default function BackHeader({ navigation, title, onBack, style }) {
  const handleBack = onBack || (() => navigation.goBack());
  return (
    <View style={[s.header, style]}>
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={s.btn}
      >
        <Icon name="back" size={26} color={COLORS.text} />
      </TouchableOpacity>
      {title ? <Text style={s.title} numberOfLines={1}>{title}</Text> : null}
      <View style={s.spacer} />
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 40, marginBottom: 6 },
  btn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  title: { flex: 1, color: COLORS.text, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  spacer: { width: 40 },
});
