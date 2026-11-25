import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import BiodataScreen from '../screens/BiodataScreen';
import UploadScreen from '../screens/UploadScreen';
import ResultScreen from '../screens/ResultScreen';
import { colors } from '../constants/theme';
import { Biodata } from '../types/biodata';
import { VerificationResult } from '../types/document';

/**
 * RootStackParamList — the route map for the entire app.
 *
 * Commit 8: Added Biodata screen in the flow (Home -> Biodata -> Upload -> Result).
 * Upload now receives applicant biodata via navigation params.
 */
export type RootStackParamList = {
  Home: undefined;
  Biodata: undefined;
  Upload: { biodata: Biodata };
  Result: { result: VerificationResult };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator — wraps everything in a NavigationContainer and
 * defines the four-screen stack: Home → Biodata → Upload → Result.
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
          name="Biodata"
          component={BiodataScreen}
          options={{ title: 'Applicant Biodata' }}
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
