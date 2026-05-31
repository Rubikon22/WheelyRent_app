import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'https://rent.milmanart.win';

const TOKEN_KEY = 'wheelyrent_token';

let authToken = null;

export function setToken(token) {
  authToken = token || null;
  if (token) {
    AsyncStorage.setItem(TOKEN_KEY, token).catch(() => {});
  } else {
    AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
  }
}

export async function loadToken() {
  try {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) authToken = stored;
    return authToken;
  } catch (e) {
    return null;
  }
}

export function clearToken() {
  authToken = null;
  AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Brak połączenia z serwerem. Sprawdź internet.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    const message = (data && data.error) || `Błąd serwera (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  me: () => request('/auth/me', { auth: true }),

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST', auth: true });
    } catch (e) {}
    clearToken();
  },

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      auth: true,
      body: { currentPassword, newPassword },
    }),

  updateProfile: (fields) =>
    request('/users/me', { method: 'PUT', auth: true, body: fields }),

  getCars: () => request('/cars'),
  getCar: (id) => request(`/cars/${id}`),

  createCar: (fields) =>
    request('/cars', { method: 'POST', auth: true, body: fields }),

  updateCar: (id, fields) =>
    request(`/cars/${id}`, { method: 'PUT', auth: true, body: fields }),

  deleteCar: (id) =>
    request(`/cars/${id}`, { method: 'DELETE', auth: true }),

  createBooking: (carId, startDate, endDate, extrasCost = 0) =>
    request('/bookings', { method: 'POST', auth: true, body: { carId, startDate, endDate, extrasCost } }),

  myBookings: () => request('/bookings/my', { auth: true }),

  cancelBooking: (id) =>
    request(`/bookings/${id}`, { method: 'DELETE', auth: true }),
};
