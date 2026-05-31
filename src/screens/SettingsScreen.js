import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { useProfile } from '../context/ProfileContext';

function CardIcon({ type }) {
  if (type === 'visa') {
    return (
      <View style={[cs.brandTile, { backgroundColor: '#1a1f71' }]}>
        <Text style={cs.brandText}>VISA</Text>
      </View>
    );
  }
  return (
    <View style={[cs.brandTile, { backgroundColor: '#fff', overflow: 'hidden' }]}>
      <View style={[cs.mcCircle, { backgroundColor: '#eb001b', left: 4 }]} />
      <View style={[cs.mcCircle, { backgroundColor: '#f79e1b', right: 4 }]} />
    </View>
  );
}

const cs = StyleSheet.create({
  brandTile: { width: 42, height: 26, borderRadius: 4, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  brandText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  mcCircle: { width: 14, height: 14, borderRadius: 7, position: 'absolute' },
});

export default function SettingsScreen({ navigation }) {
  const { profile, updateProfile, addCard, removeCard } = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [city, setCity] = useState(profile.city);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [about, setAbout] = useState(profile.about);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardType, setNewCardType] = useState('visa');

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateProfile({ name, email, city, birthDate, about, avatarUri });
    navigation.goBack();
  };

  const handleAddCard = () => {
    const digits = newCardNumber.replace(/\s/g, '');
    if (digits.length !== 16) {
      Alert.alert('Błąd', 'Podaj pełny 16-cyfrowy numer karty');
      return;
    }
    const last4 = digits.slice(-4);
    addCard({ type: newCardType, last4 });
    setNewCardNumber('');
    setShowAddCard(false);
  };

  const handleRemoveCard = (card) => {
    Alert.alert(
      'Usunąć kartę?',
      `**** ${card.last4}`,
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Usuń', style: 'destructive', onPress: () => removeCard(card.id) },
      ],
    );
  };

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Ustawienia konta</Text>

        <TouchableOpacity style={s.avatarWrap} onPress={pickAvatar} activeOpacity={0.7}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={s.avatar} />
          ) : (
            <View style={s.avatarPlaceholder}>
              <Icon name="user" size={36} color="#1a1530" strokeWidth={1.3} />
            </View>
          )}
          <View style={s.avatarBadge}>
            <Text style={s.avatarBadgeText}>✎</Text>
          </View>
        </TouchableOpacity>
        <Text style={s.avatarHint}>Zmień zdjęcie</Text>

        <View style={s.form}>
          <Text style={s.label}>Imię i nazwisko</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor={COLORS.textMute} />

          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.textMute} />

          <Text style={s.label}>Miasto</Text>
          <TextInput style={s.input} value={city} onChangeText={setCity} placeholderTextColor={COLORS.textMute} />

          <Text style={s.label}>Data urodzenia</Text>
          <TextInput
            style={s.input}
            value={birthDate}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              let formatted = '';
              for (let i = 0; i < digits.length && i < 8; i++) {
                if (i === 2 || i === 4) formatted += '.';
                formatted += digits[i];
              }
              setBirthDate(formatted);
            }}
            placeholder="DD.MM.RRRR"
            placeholderTextColor={COLORS.textMute}
            maxLength={10}
            keyboardType="number-pad"
          />

          <Text style={s.label}>O sobie ({about.length}/500)</Text>
          <TextInput
            style={[s.input, { height: 80, textAlignVertical: 'top' }]}
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={500}
            placeholderTextColor={COLORS.textMute}
          />
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Metody płatności</Text>

        {profile.cards.map(card => (
          <View key={card.id} style={s.cardRow}>
            <CardIcon type={card.type} />
            <Text style={s.cardNum}>**** {card.last4}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => handleRemoveCard(card)}>
              <Text style={s.removeText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        ))}

        {!showAddCard ? (
          <TouchableOpacity style={s.addCardBtn} onPress={() => setShowAddCard(true)}>
            <Text style={s.addCardText}>+ Dodaj kartę</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.addCardForm}>
            <View style={s.typeRow}>
              <TouchableOpacity
                style={[s.typeBtn, newCardType === 'visa' && s.typeBtnActive]}
                onPress={() => setNewCardType('visa')}
              >
                <Text style={[s.typeBtnText, newCardType === 'visa' && s.typeBtnTextActive]}>VISA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.typeBtn, newCardType === 'mastercard' && s.typeBtnActive]}
                onPress={() => setNewCardType('mastercard')}
              >
                <Text style={[s.typeBtnText, newCardType === 'mastercard' && s.typeBtnTextActive]}>Mastercard</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={s.input}
              placeholder="Numer karty (16 cyfr)"
              placeholderTextColor={COLORS.textMute}
              value={newCardNumber}
              onChangeText={(text) => setNewCardNumber(text.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={16}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <TouchableOpacity style={s.addConfirmBtn} onPress={handleAddCard}>
                <Text style={s.addConfirmText}>Dodaj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.addCancelBtn} onPress={() => { setShowAddCard(false); setNewCardNumber(''); }}>
                <Text style={s.addCancelText}>Anuluj</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={s.divider} />

        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text style={s.link}>» Wiadomości</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={s.buttons}>
        <BtnPrimary title="Zapisz" onPress={handleSave} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.cancelBtn}>
          <Text style={s.cancelText}>Anuluj</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { alignItems: 'center', paddingBottom: 10 },
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatarPlaceholder: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.bg,
  },
  avatarBadgeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  avatarHint: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 16 },
  form: { width: '100%', gap: 4 },
  label: { color: COLORS.textDim, fontSize: 11, fontWeight: '700', marginTop: 8 },
  input: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 11, paddingHorizontal: 14, color: COLORS.text, fontSize: 14, fontWeight: '600',
  },
  divider: { height: 1, backgroundColor: COLORS.border, width: '100%', marginVertical: 16 },
  link: { color: COLORS.text, fontWeight: '800', fontSize: 14, alignSelf: 'flex-start', marginBottom: 6 },
  buttons: { paddingBottom: 4 },
  cancelBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
  cancelText: { color: COLORS.textMute, fontWeight: '700', fontSize: 14 },

  sectionTitle: { color: COLORS.text, fontWeight: '800', fontSize: 14, alignSelf: 'flex-start', marginBottom: 10 },
  cardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 12, marginBottom: 8,
  },
  cardNum: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  removeText: { color: '#ef4444', fontWeight: '700', fontSize: 12 },
  addCardBtn: {
    backgroundColor: '#3b82f6', paddingVertical: 10, borderRadius: 22,
    alignItems: 'center', width: '100%', marginTop: 4,
  },
  addCardText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  addCardForm: {
    width: '100%', backgroundColor: COLORS.bgCard, borderWidth: 1,
    borderColor: COLORS.border, borderRadius: 12, padding: 14, marginTop: 4,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  typeBtn: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeBtnText: { color: COLORS.textDim, fontWeight: '700', fontSize: 12 },
  typeBtnTextActive: { color: '#fff' },
  addConfirmBtn: {
    flex: 1, backgroundColor: COLORS.primary, paddingVertical: 10,
    borderRadius: 18, alignItems: 'center',
  },
  addConfirmText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  addCancelBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10,
    borderRadius: 18, alignItems: 'center',
  },
  addCancelText: { color: COLORS.textMute, fontWeight: '700', fontSize: 13 },
});
