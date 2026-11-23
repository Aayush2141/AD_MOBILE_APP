import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, fontSizes, fontWeights, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

/**
 * UploadScreen — placeholder for the document upload / scan flow.
 * Camera and file picker logic will be added in a future commit.
 */
export default function UploadScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UploadScreen</Text>
      <Text style={styles.description}>
        Users will upload or scan a document here (image or PDF).
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Result')}
      >
        <Text style={styles.buttonText}>Go to Result →</Text>
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
