import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Entry point – will be replaced in Commit 2 with navigation container
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
});
