import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { CARS } from '../constants/cars';

const PALETTE_CACHE = {};
function getPalette(kind) {
  if (PALETTE_CACHE[kind]) return PALETTE_CACHE[kind];
  const car = CARS.find(c => c.id === kind || c.id === kind?.externalId || c.id === kind?.localId);
  const p = car ? { bg: car.color, car: car.carColor } : { bg: '#888', car: '#555' };
  PALETTE_CACHE[kind] = p;
  return p;
}

export default function CarPlaceholder({ kind, style }) {
  const p = getPalette(kind);
  return (
    <View style={[{ backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width="80%" height="60%" viewBox="0 0 120 50" fill={p.car}>
        <Path d="M10 35c0-3 3-6 6-6l12-1 8-10c2-2 4-3 7-3h28c3 0 6 1 8 3l10 11h6c5 0 9 4 9 9v6c0 1-1 2-2 2H10v-11z" />
        <Circle cx="30" cy="42" r="6" fill="#1a1a1a" />
        <Circle cx="30" cy="42" r="2.5" fill="#666" />
        <Circle cx="88" cy="42" r="6" fill="#1a1a1a" />
        <Circle cx="88" cy="42" r="2.5" fill="#666" />
      </Svg>
    </View>
  );
}
