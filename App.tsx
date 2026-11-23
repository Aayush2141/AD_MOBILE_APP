import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, fontWeights } from './src/constants/theme';

/**
 * App.tsx — temporary root.
 * In Commit 3 this will render <AppNavigator /> instead of inline JSX.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DocVerify</Text>
      <Text style={styles.subtitle}>Intelligent Document Verification</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
