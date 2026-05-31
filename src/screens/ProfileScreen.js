import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import { BtnOutline } from '../components/Btn';
import Screen from '../components/Screen';
import { useProfile } from '../context/ProfileContext';
import { clearToken } from '../api/client';

function DocStatus({ label, doc }) {
  return (
    <View style={s.docRow}>
      <Icon name="id-card" size={16} color={doc ? '#059669' : COLORS.textMute} />
      <Text style={s.docLabel}>{label}</Text>
      {doc ? (
        <View style={s.docBadge}>
          <Text style={s.docBadgeText}>✓ Dodano</Text>
        </View>
      ) : (
        <Text style={s.docMissing}>Brak</Text>
      )}
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { profile } = useProfile();
  const hasLicense = !!profile.drivingLicense;

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {profile.avatarUri ? (
          <Image source={{ uri: profile.avatarUri }} style={s.avatar} />
        ) : (
          <View style={s.avatarPlaceholder}>
            <Icon name="user" size={38} color="#1a1530" strokeWidth={1.3} />
          </View>
        )}
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.email}>{profile.email}</Text>

        <BtnOutline
          title={hasLicense ? 'Dokumenty' : 'Dodaj prawo jazdy'}
          icon={<Icon name={hasLicense ? 'id-card' : 'plus'} size={13} color="#fff" />}
          onPress={() => navigation.navigate('Verify')}
          style={{ marginTop: 16 }}
        />
        <BtnOutline
          title="Moje rezerwacje"
          icon={<Icon name="id-card" size={13} color="#fff" />}
          onPress={() => navigation.navigate('MyBookings')}
          style={{ marginTop: 9 }}
        />
        <BtnOutline
          title="Ustawienia konta"
          icon={<Icon name="settings" size={13} color="#fff" />}
          onPress={() => navigation.navigate('Settings')}
          style={{ marginTop: 9 }}
        />
        {profile.role === 'ADMIN' && (
          <BtnOutline
            title="Zarzadzaj autami"
            icon={<Icon name="settings" size={13} color="#fff" />}
            onPress={() => navigation.navigate('AdminCars')}
            style={{ marginTop: 9 }}
          />
        )}

        <View style={s.docsSection}>
          <Text style={s.docsTitle}>Dokumenty</Text>
          <DocStatus label="Prawo jazdy" doc={profile.drivingLicense} />
          <DocStatus label="Dowód osobisty" doc={profile.idCard} />
        </View>

        <Text style={s.infoLabel}>Informacja</Text>
        <Text style={s.infoText}>
          Miasto: {profile.city}{'\n'}
          Data urodzenia: {profile.birthDate}{'\n'}
          O sobie:{'\n'}
          {profile.about}
        </Text>

        <TouchableOpacity
          style={s.logoutBtn}
          onPress={() => {
            clearToken();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
            );
          }}
        >
          <Text style={s.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { alignItems: 'center', paddingBottom: 20 },
  avatarPlaceholder: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: { width: 68, height: 68, borderRadius: 34 },
  name: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginTop: 10 },
  email: { color: COLORS.textMute, fontSize: 11, fontWeight: '700', fontStyle: 'italic' },

  docsSection: { alignSelf: 'stretch', marginTop: 18 },
  docsTitle: { color: COLORS.text, fontWeight: '800', fontStyle: 'italic', fontSize: 13, marginBottom: 8 },
  docRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 10, paddingHorizontal: 12, marginBottom: 6,
  },
  docLabel: { color: COLORS.text, fontWeight: '700', fontSize: 12, flex: 1 },
  docBadge: { backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  docBadgeText: { color: '#fff', fontWeight: '700', fontSize: 10 },
  docMissing: { color: COLORS.textMute, fontWeight: '600', fontSize: 11 },

  infoLabel: { alignSelf: 'flex-start', marginTop: 18, fontWeight: '800', fontStyle: 'italic', fontSize: 13, color: COLORS.text },
  infoText: { alignSelf: 'flex-start', marginTop: 10, fontSize: 12, fontWeight: '700', lineHeight: 22, fontStyle: 'italic', color: COLORS.text },
  logoutBtn: {
    marginTop: 24, paddingVertical: 12, paddingHorizontal: 32,
    borderRadius: 22, borderWidth: 1.5, borderColor: '#ef4444',
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
});
