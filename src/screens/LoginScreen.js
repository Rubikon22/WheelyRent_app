import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import WheelyLogo from '../components/WheelyLogo';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import { api, setToken } from '../api/client';
import { useProfile } from '../context/ProfileContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useProfile();

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      Alert.alert('Błąd', 'Podaj email i hasło');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await api.login(email.trim(), password);
      setToken(token);
      updateProfile({ name: user.name, email: user.email, role: user.role });
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Logowanie nieudane', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.top}>
          <WheelyLogo size={70} />
          <Text style={s.brand}>WheelyRent</Text>
        </View>

        <Text style={s.title}>Zaloguj się</Text>

        <View style={s.form}>
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={COLORS.textMute} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
          <TextInput style={s.input} placeholder="Hasło" placeholderTextColor={COLORS.textMute} value={password} onChangeText={setPassword} secureTextEntry editable={!loading} onSubmitEditing={handleLogin} returnKeyType="go" />
        </View>

        <BtnPrimary title={loading ? 'Logowanie...' : 'Zaloguj się'} onPress={handleLogin} style={{ marginTop: 18 }} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 10, alignSelf: 'center' }}>
          <Text style={s.link}>
            Nie masz konta? <Text style={{ color: '#fff' }}>Zarejestruj się</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { alignItems: 'center', paddingTop: 20, paddingBottom: 30 },
  top: { alignItems: 'center' },
  brand: { color: COLORS.text, fontWeight: '800', fontSize: 18, marginTop: 4 },
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, marginTop: 30, textAlign: 'center' },
  form: { width: '100%', marginTop: 22, gap: 10 },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  link: { color: COLORS.textMute, fontSize: 12, fontWeight: '600' },
});
