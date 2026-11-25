import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Biodata } from '../types/biodata';
import { BiodataErrors, validateBiodata } from '../utils/validation';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { colors, fontSizes, fontWeights, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Biodata'>;

/**
 * BiodataScreen — collects applicant biodata before document upload
 * so extracted document fields can be compared against it.
 */
export default function BiodataScreen({ navigation }: Props) {
  const [form, setForm] = useState<Biodata>({
    fullName: '',
    dateOfBirth: '',
    fatherName: '',
    documentReference: '',
  });
  const [errors, setErrors] = useState<BiodataErrors>({});

  const updateField = (field: keyof Biodata, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error as the user edits
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    const trimmed: Biodata = {
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth.trim(),
      fatherName: form.fatherName.trim(),
      documentReference: form.documentReference.trim(),
    };

    const validationErrors = validateBiodata(trimmed);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    navigation.navigate('Upload', { biodata: trimmed });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Applicant Biodata</Text>
        <Text style={styles.subheading}>
          Enter your details as submitted in your DRDO RAC application. We will
          cross-check your document against these values.
        </Text>

        <TextField
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={form.fullName}
          onChangeText={(text) => updateField('fullName', text)}
          error={errors.fullName}
          autoCapitalize="words"
        />

        <TextField
          label="Date of Birth (DD/MM/YYYY)"
          placeholder="e.g. 15/08/2000"
          value={form.dateOfBirth}
          onChangeText={(text) => updateField('dateOfBirth', text)}
          error={errors.dateOfBirth}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <TextField
          label="Father's Name"
          placeholder="e.g. Suresh Sharma"
          value={form.fatherName}
          onChangeText={(text) => updateField('fatherName', text)}
          error={errors.fatherName}
          autoCapitalize="words"
        />

        <TextField
          label="Roll Number / CGPA / GATE Score"
          placeholder="e.g. MTK2019045 or 7.8 or 712"
          value={form.documentReference}
          onChangeText={(text) => updateField('documentReference', text)}
          error={errors.documentReference}
        />

        <Button
          label="Continue to Upload"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  continueButton: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
});
