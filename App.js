import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HealthProvider } from './src/context/HealthContext';
import { StackNavigator } from './src/navigation/StackNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <HealthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <StackNavigator />
        </NavigationContainer>
      </HealthProvider>
    </SafeAreaProvider>
  );
}
