import { CARS } from '../constants/cars';

const FALLBACK_REVIEWS = [
  { name: 'Anna', stars: 5, text: 'Auto bylo przygotowane na czas.' },
  { name: 'Marek', stars: 4, text: 'Szybka rezerwacja i dobra obsluga.' },
];

export function normalizeCar(car) {
  if (!car) return null;
  if (car.name && car.price) return car;

  const local = CARS.find(c => c.id === car.externalId);
  const name = `${car.brand} ${car.model}, ${car.year}`;
  const short = `${car.brand} ${car.model}`;

  return {
    id: car.id,
    serverId: car.id,
    localId: car.externalId || String(car.id),
    externalId: car.externalId,
    name,
    short,
    price: Number(car.pricePerDay),
    priceLabel: `${Number(car.pricePerDay)}zl / dzien`,
    color: local?.color || '#2563eb',
    carColor: local?.carColor || '#1d4ed8',
    rating: local?.rating || '4,8',
    ratingNum: local?.ratingNum || 4.8,
    reviews: local?.reviews || FALLBACK_REVIEWS,
    imageUrl: car.imageUrl,
    available: car.available,
    latitude: car.latitude,
    longitude: car.longitude,
    specs: {
      body: local?.specs?.body || car.description?.split('.')[0] || 'Auto',
      fuel: car.fuelType || local?.specs?.fuel || 'Brak danych',
      mileage: local?.specs?.mileage || 'Brak danych',
      power: local?.specs?.power || 'Brak danych',
      seats: car.seats,
      transmission: car.transmission,
    },
    raw: car,
  };
}

export function normalizeCars(cars) {
  return Array.isArray(cars) ? cars.map(normalizeCar).filter(Boolean) : [];
}

export function getFallbackCar(id) {
  return CARS.find(c => c.id === id || c.id === String(id));
}
