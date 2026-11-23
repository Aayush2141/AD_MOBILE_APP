import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ResultScreen from '../screens/ResultScreen';
import { colors } from '../constants/theme';

/**
 * RootStackParamList — the route map for the entire app.
 * Each key is a screen name; the value is its route params (undefined = none).
 */
export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Result: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator — wraps everything in a NavigationContainer and
 * defines the three-screen stack: Home → Upload → Result.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'DocVerify' }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: 'Upload Document' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Verification Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
