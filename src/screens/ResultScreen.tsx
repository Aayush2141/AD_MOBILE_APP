import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, fontSizes, fontWeights, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

/**
 * ResultScreen — placeholder for the verification result dashboard.
 * Extracted fields and mismatch alerts will be shown here in a future commit.
 */
export default function ResultScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ResultScreen</Text>
      <Text style={styles.description}>
        Extracted fields and verification results will be displayed here.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>← Back to Home</Text>
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
