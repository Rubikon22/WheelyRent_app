import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ChatScreen from '../screens/ChatScreen';
import CarDetailsScreen from '../screens/CarDetailsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SummaryScreen from '../screens/SummaryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { ConfirmSuccessScreen, ConfirmFailScreen } from '../screens/ConfirmScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VerifyScreen from '../screens/VerifyScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ExtraOptionsScreen from '../screens/ExtraOptionsScreen';
import HelpScreen from '../screens/HelpScreen';
import HelpAnswerScreen from '../screens/HelpAnswerScreen';
import AdminCarsScreen from '../screens/AdminCarsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHeader = { headerShown: false };

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="ExtraOptions" component={ExtraOptionsScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="ConfirmSuccess" component={ConfirmSuccessScreen} />
      <Stack.Screen name="ConfirmFail" component={ConfirmFailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AdminCars" component={AdminCarsScreen} />
    </Stack.Navigator>
  );
}

function HelpStack() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="HelpHome" component={HelpScreen} />
      <Stack.Screen name="HelpAnswer" component={HelpAnswerScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navBg,
          borderTopColor: '#b6b2c4',
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          const names = { HomeTab: 'home', ProfileTab: 'user', MapTab: 'globe', ChatTab: 'chat', HelpTab: 'help' };
          return (
            <Icon
              name={names[route.name]}
              size={20}
              color={focused ? COLORS.navActive : COLORS.navIcon}
              strokeWidth={focused ? 2.2 : 1.6}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
      <Tab.Screen name="MapTab" component={MapScreen} />
      <Tab.Screen name="ChatTab" component={ChatScreen} />
      <Tab.Screen name="HelpTab" component={HelpStack} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={noHeader}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
