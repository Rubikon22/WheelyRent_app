import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import { BtnPrimary } from '../components/Btn';
import Screen from '../components/Screen';
import BackHeader from '../components/BackHeader';
import { useProfile } from '../context/ProfileContext';

function DocForm({ title, iconName, doc, onSave, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [number, setNumber] = useState(doc?.number || '');
  const [expiry, setExpiry] = useState(doc?.expiry || '');
  const [photoUri, setPhotoUri] = useState(doc?.photoUri || null);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!number.trim()) {
      Alert.alert('Błąd', 'Podaj numer dokumentu');
      return;
    }
    onSave({ number: number.trim(), expiry: expiry.trim(), photoUri });
    setEditing(false);
  };

  if (doc && !editing) {
    return (
      <View style={s.docCard}>
        <View style={s.docHeader}>
          <Icon name={iconName} size={18} color={COLORS.cyanBright} />
          <Text style={s.docTitle}>{title}</Text>
          <View style={s.statusBadge}>
            <Text style={s.statusText}>Dodano</Text>
          </View>
        </View>
        {doc.photoUri && <Image source={{ uri: doc.photoUri }} style={s.docPhoto} />}
        <Text style={s.docInfo}>Numer: {doc.number}</Text>
        {doc.expiry ? <Text style={s.docInfo}>Ważny do: {doc.expiry}</Text> : null}
        <View style={s.docActions}>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={s.editText}>Edytuj</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Alert.alert('Usunąć dokument?', title, [
              { text: 'Anuluj', style: 'cancel' },
              { text: 'Usuń', style: 'destructive', onPress: onRemove },
            ]);
          }}>
            <Text style={s.removeText}>Usuń</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.docCard}>
      <View style={s.docHeader}>
        <Icon name={iconName} size={18} color={COLORS.cyanBright} />
        <Text style={s.docTitle}>{title}</Text>
      </View>

      <TouchableOpacity style={s.photoBtn} onPress={pickPhoto}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={s.photoPreview} />
        ) : (
          <View style={s.photoPlaceholder}>
            <Text style={s.photoPlaceholderText}>+ Zdjęcie dokumentu</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={s.label}>Numer dokumentu</Text>
      <TextInput
        style={s.input}
        value={number}
        onChangeText={setNumber}
        placeholder="np. ABC 123456"
        placeholderTextColor={COLORS.textMute}
        maxLength={9}
      />

      <Text style={s.label}>Ważny do (opcjonalnie)</Text>
      <TextInput
        style={s.input}
        value={expiry}
        onChangeText={(text) => {
          const digits = text.replace(/[^0-9]/g, '');
          let formatted = '';
          for (let i = 0; i < digits.length && i < 8; i++) {
            if (i === 2 || i === 4) formatted += '.';
            formatted += digits[i];
          }
          setExpiry(formatted);
        }}
        placeholder="DD.MM.RRRR"
        placeholderTextColor={COLORS.textMute}
        maxLength={10}
        keyboardType="number-pad"
      />

      <View style={s.formActions}>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveBtnText}>Zapisz</Text>
        </TouchableOpacity>
        {editing && (
          <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(false)}>
            <Text style={s.cancelBtnText}>Anuluj</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function VerifyScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();

  return (
    <Screen>
      <BackHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={s.brand}>WheelyRent</Text>
        <Text style={s.desc}>
          Dodaj swoje dokumenty, aby{'\n'}korzystać z aplikacji WheelyRent.
        </Text>

        <DocForm
          title="Prawo jazdy"
          iconName="id-card"
          doc={profile.drivingLicense}
          onSave={(doc) => updateProfile({ drivingLicense: doc })}
          onRemove={() => updateProfile({ drivingLicense: null })}
        />

        <DocForm
          title="Dowód osobisty"
          iconName="id-card"
          doc={profile.idCard}
          onSave={(doc) => updateProfile({ idCard: doc })}
          onRemove={() => updateProfile({ idCard: null })}
        />
      </ScrollView>

    </Screen>
  );
}

const s = StyleSheet.create({
  brand: { color: COLORS.text, fontWeight: '800', fontSize: 19, textAlign: 'center' },
  desc: { color: COLORS.text, fontWeight: '800', fontSize: 13, textAlign: 'center', marginTop: 14, lineHeight: 18, marginBottom: 20 },

  docCard: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 14, padding: 16, marginBottom: 14,
  },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  docTitle: { color: COLORS.text, fontWeight: '800', fontSize: 14, flex: 1 },
  statusBadge: {
    backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  statusText: { color: '#fff', fontWeight: '700', fontSize: 11 },

  docPhoto: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10 },
  docInfo: { color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 2 },
  docActions: { flexDirection: 'row', gap: 20, marginTop: 10 },
  editText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  removeText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },

  photoBtn: { marginBottom: 12 },
  photoPreview: { width: '100%', height: 120, borderRadius: 10 },
  photoPlaceholder: {
    width: '100%', height: 100, borderRadius: 10, borderWidth: 1.5,
    borderColor: COLORS.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  photoPlaceholderText: { color: COLORS.textMute, fontWeight: '700', fontSize: 13 },

  label: { color: COLORS.textDim, fontSize: 11, fontWeight: '700', marginTop: 6, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.bgCardSoft, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 11, paddingHorizontal: 14, color: COLORS.text, fontSize: 14, fontWeight: '600',
  },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  saveBtn: {
    flex: 1, backgroundColor: COLORS.primary, paddingVertical: 11,
    borderRadius: 18, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 11,
    borderRadius: 18, alignItems: 'center',
  },
  cancelBtnText: { color: COLORS.textMute, fontWeight: '700', fontSize: 14 },
});
