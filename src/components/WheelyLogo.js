import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export default function WheelyLogo({ size = 130 }) {
  const h = size * 0.78;
  return (
    <Svg width={size} height={h} viewBox="0 0 160 125" fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M52 12c-9 0-16 7-16 16 0 11 16 26 16 26s16-15 16-26c0-9-7-16-16-16z" />
      <Circle cx="52" cy="28" r="5.5" />
      <Path d="M22 86c0-10 6-18 14-22l14-6h28l12 10h22c8 0 14 5 14 13v12c0 4-3 7-7 7h-6" />
      <Path d="M22 86v10c0 3 2 6 5 6h6" />
      <Path d="M52 58l-12 18h60l-10-18" />
      <Circle cx="44" cy="102" r="9" />
      <Circle cx="44" cy="102" r="3" />
      <Circle cx="104" cy="102" r="9" />
      <Circle cx="104" cy="102" r="3" />
      <Path d="M118 28c4 0 8 3 8 8" stroke="#22d3ee" />
      <Path d="M118 18c10 0 18 8 18 18" stroke="#22d3ee" />
    </Svg>
  );
}
