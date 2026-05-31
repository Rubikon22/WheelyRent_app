import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import WheelyLogo from '../components/WheelyLogo';
import Screen from '../components/Screen';
import { api, loadToken, clearToken } from '../api/client';
import { useProfile } from '../context/ProfileContext';

const MIN_SPLASH_MS = 1500;

export default function WelcomeScreen({ navigation }) {
  const { updateProfile } = useProfile();

  useEffect(() => {
    let active = true;
    const start = Date.now();

    (async () => {
      let target = 'Login';

      const token = await loadToken();
      if (token) {
        try {
          const me = await api.me();
          if (active && me) {
            updateProfile({ name: me.name, email: me.email, role: me.role });
            target = 'Main';
          }
        } catch (e) {
          clearToken();
        }
      }

      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SPLASH_MS - elapsed);
      setTimeout(() => {
        if (active) navigation.replace(target);
      }, wait);
    })();

    return () => { active = false; };
  }, [navigation]);

  return (
    <Screen style={s.center}>
      <WheelyLogo size={150} />
      <Text style={s.brand}>WheelyRent</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  brand: { color: COLORS.text, fontWeight: '800', fontSize: 22, marginTop: 26 },
});
