import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ResultScreen from '../screens/ResultScreen';
import { colors } from '../constants/theme';
import { VerificationResult } from '../types/document';

/**
 * RootStackParamList — the route map for the entire app.
 *
 * Commit 7: Result now receives a VerificationResult via navigation params
 * so UploadScreen can pass the mock result without global state.
 */
export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Result: { result: VerificationResult };
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
