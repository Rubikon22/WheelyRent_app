# WheelyRent

Mobilna aplikacja do wynajmu samochodów zbudowana w React Native + Expo SDK 54.

## Technologie

- **Frontend:** React Native 0.81.5 + Expo SDK 54
- **Nawigacja:** React Navigation v7 (Stack + Bottom Tabs)
- **Stan:** React Context API (ProfileContext)
- **Backend:** REST API — `https://rent.milmanart.win`
- **Autoryzacja:** JWT Bearer Token + AsyncStorage
- **Mapy:** OpenStreetMap + Leaflet (WebView)

## Funkcjonalności

- Rejestracja i logowanie z uwierzytelnianiem JWT
- Przeglądanie i wyszukiwanie samochodów
- Szczegóły auta ze zdjęciami i opiniami
- Proces rezerwacji: opcje dodatkowe, podsumowanie, płatność, potwierdzenie
- Edycja profilu z przesyłaniem avatara
- Weryfikacja dokumentów (prawo jazdy, dowód osobisty)
- Zarządzanie kartami płatniczymi (Visa / Mastercard)
- Lista rezerwacji z możliwością anulowania
- Interaktywna mapa z lokalizacjami aut
- Konfiguracja powiadomień
- Panel admina do zarządzania autami (CRUD)
- Sekcja pomocy / FAQ

## Ekrany (20)

| Ekran | Opis |
|-------|------|
| WelcomeScreen | Ekran powitalny |
| LoginScreen | Logowanie |
| RegisterScreen | Rejestracja konta |
| HomeScreen | Lista samochodów (główny) |
| CarDetailsScreen | Szczegóły auta |
| ExtraOptionsScreen | Opcje dodatkowe wynajmu |
| SummaryScreen | Podsumowanie rezerwacji |
| PaymentScreen | Płatność kartą |
| ConfirmScreen | Potwierdzenie rezerwacji |
| MyBookingsScreen | Moje rezerwacje |
| ProfileScreen | Profil użytkownika |
| SettingsScreen | Edycja profilu i kart |
| VerifyScreen | Weryfikacja dokumentów |
| NotificationsScreen | Ustawienia powiadomień |
| MapScreen | Mapa lokalizacji aut |
| ChatScreen | Wiadomości |
| ReviewsScreen | Opinie o aucie |
| HelpScreen | Lista FAQ |
| HelpAnswerScreen | Odpowiedź FAQ |
| AdminCarsScreen | Zarządzanie autami (admin) |

## Struktura projektu

```
src/
├── api/
│   └── client.js            # Klient REST API + zarządzanie tokenem JWT
├── components/
│   ├── BackHeader.js         # Nagłówek z przyciskiem wstecz
│   ├── Btn.js                # Komponenty przycisków
│   ├── CarImage.js           # Komponent zdjęcia auta
│   ├── CarPlaceholder.js     # Placeholder SVG auta
│   ├── Icons.js              # Zestaw ikon SVG
│   ├── Screen.js             # Wrapper ekranu (gradient)
│   └── WheelyLogo.js         # Logo aplikacji SVG
├── constants/
│   ├── cars.js               # Dane lokalne samochodów
│   └── theme.js              # Kolory i tokeny designu
├── context/
│   └── ProfileContext.js     # Globalny stan (profil, karty, powiadomienia)
├── navigation/
│   └── index.js              # Konfiguracja nawigacji
├── screens/                  # 20 ekranów aplikacji
└── utils/
    └── cars.js               # Normalizacja danych aut
```

## Endpointy API

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/auth/register` | Rejestracja użytkownika |
| POST | `/auth/login` | Logowanie |
| POST | `/auth/logout` | Wylogowanie |
| GET | `/auth/me` | Dane zalogowanego użytkownika |
| GET | `/cars` | Lista samochodów |
| GET | `/cars/:id` | Szczegóły samochodu |
| POST | `/cars` | Dodanie auta (admin) |
| PUT | `/cars/:id` | Edycja auta (admin) |
| DELETE | `/cars/:id` | Usunięcie auta (admin) |
| POST | `/bookings` | Utworzenie rezerwacji |
| GET | `/bookings/my` | Rezerwacje użytkownika |
| DELETE | `/bookings/:id` | Anulowanie rezerwacji |

## Dokumentacja

- Dokumentacja projektu: `docs/WheelyRent-Dokumentacja.docx`
- Diagramy (Miro): [WheelyRent — Diagramy](https://miro.com/app/board/uXjVHMJpbMg=/?share_link_id=446742789407)

## Licencja

Projekt realizowany w ramach zajęć na uczelni.
