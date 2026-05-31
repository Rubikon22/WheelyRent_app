import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

const MAX_WIDTH = 420;

export default function Screen({ children, style, noPadding }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.outer}>
      <View
        style={[
          s.inner,
          {
            paddingTop: insets.top + (noPadding ? 0 : 16),
            paddingBottom: insets.bottom + (noPadding ? 0 : 12),
            paddingHorizontal: noPadding ? 0 : 20,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_WIDTH,
    backgroundColor: COLORS.bg,
  },
});
