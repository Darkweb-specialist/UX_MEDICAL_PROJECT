import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AddMedicineScreen } from '../screens/AddMedicineScreen';
import { MedicineDetailsScreen } from '../screens/MedicineDetailsScreen';
import { EditMedicineScreen } from '../screens/EditMedicineScreen';
import { AddDiaryEntryScreen } from '../screens/AddDiaryEntryScreen';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
      <Stack.Screen name="EditMedicine" component={EditMedicineScreen} />
      <Stack.Screen name="AddDiaryEntry" component={AddDiaryEntryScreen} />
    </Stack.Navigator>
  );
};
