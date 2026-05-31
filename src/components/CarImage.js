import React from 'react';
import { Image } from 'react-native';
import CarPlaceholder from './CarPlaceholder';

export default function CarImage({ car, style }) {
  if (car?.imageUrl) {
    return <Image source={{ uri: car.imageUrl }} style={[style, { resizeMode: 'cover' }]} />;
  }
  return <CarPlaceholder kind={car?.localId || car?.id} style={style} />;
}
