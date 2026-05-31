import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

const DEFAULT = {
  name: 'Will Smith',
  email: 'willsmith@gmail.com',
  role: 'CLIENT',
  city: 'Warszawa',
  birthDate: '25.09.1968',
  about: '',
  avatarUri: null,
  cards: [
    { id: '1', type: 'visa', last4: '1234' },
    { id: '2', type: 'mastercard', last4: '4321' },
  ],
  drivingLicense: null,
  idCard: null,
  notifications: {},
};

let cardIdCounter = 3;

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT);

  const updateProfile = (fields) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const addCard = (card) => {
    const newCard = { ...card, id: String(cardIdCounter++) };
    setProfile(prev => ({ ...prev, cards: [...prev.cards, newCard] }));
  };

  const removeCard = (cardId) => {
    setProfile(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== cardId),
    }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, addCard, removeCard }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
