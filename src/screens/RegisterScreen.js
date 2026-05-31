import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import { api, setToken } from '../api/client';
import { useProfile } from '../context/ProfileContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useProfile();

  const handleRegister = async () => {
    if (loading) return;

    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Błąd', 'Wypełnij imię, email i hasło');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Błąd', 'Hasło musi mieć co najmniej 6 znaków');
      return;
    }
    if (!agreed) {
      Alert.alert('Błąd', 'Zaakceptuj warunki i politykę prywatności');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await api.register(name.trim(), email.trim(), password);
      setToken(token);
      updateProfile({ name: user.name, email: user.email, role: user.role });
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Rejestracja nieudana', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={s.brand}>WheelyRent</Text>
        <Text style={s.title}>Załóż konto</Text>

        <View style={s.form}>
          <TextInput style={s.input} placeholder="Imię i nazwisko" placeholderTextColor={COLORS.textMute} value={name} onChangeText={setName} editable={!loading} />
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={COLORS.textMute} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
          <TextInput style={s.input} placeholder="Numer telefonu" placeholderTextColor={COLORS.textMute} value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!loading} />
          <TextInput style={s.input} placeholder="Hasło" placeholderTextColor={COLORS.textMute} value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
        </View>

        <TouchableOpacity style={s.checkRow} onPress={() => setAgreed(!agreed)}>
          <View style={[s.dot, !agreed && s.dotEmpty]} />
          <Text style={s.checkText}>Akceptuję warunki i politykę{'\n'}prywatności</Text>
        </TouchableOpacity>

        <BtnPrimary title={loading ? 'Rejestracja...' : 'Zarejestruj się'} onPress={handleRegister} style={{ marginTop: 22 }} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
          <Text style={s.loginLink}>Masz już konto? <Text style={s.loginLinkBold}>Zaloguj się</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { alignItems: 'center', paddingTop: 20, paddingBottom: 30 },
  brand: { color: COLORS.text, fontWeight: '800', fontSize: 19 },
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, marginTop: 22 },
  form: { width: '100%', marginTop: 18, gap: 9 },
  input: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, paddingHorizontal: 14, color: COLORS.text, fontSize: 14, fontWeight: '600',
  },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 18, alignSelf: 'flex-start' },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', marginTop: 2 },
  dotEmpty: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#fff' },
  checkText: { color: COLORS.text, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  loginLink: { color: COLORS.textMute, fontSize: 13, fontWeight: '600' },
  loginLinkBold: { color: COLORS.primary, fontWeight: '800' },
});
