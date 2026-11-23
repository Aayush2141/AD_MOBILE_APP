import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, fontSizes, fontWeights, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * HomeScreen — landing page of the app.
 * Will be fleshed out in Commit 4.
 */
export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      <Text style={styles.description}>
        Starting point for document verification.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.buttonText}>Go to Upload →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
});
