import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DocumentType } from '../types/document';
import DocumentTypeCard, { ALL_DOCUMENT_TYPES } from '../components/DocumentTypeCard';
import Button from '../components/Button';
import { colors, fontSizes, fontWeights, spacing } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

/**
 * UploadScreen — step 1: choose the document type to verify.
 * File picking (step 2) will be added in Commit 6.
 */
export default function UploadScreen({ navigation }: Props) {
  // Track which document type the user has tapped
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    // TODO (Commit 6): pass selectedType into the file picker flow
    console.log('[UploadScreen] selected document type:', selectedType);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Heading ── */}
      <Text style={styles.heading}>Select Document Type</Text>
      <Text style={styles.subheading}>
        Choose the category of the DRDO RAC document you want to verify.
      </Text>

      {/* ── Document type list ── */}
      {ALL_DOCUMENT_TYPES.map((type) => (
        <DocumentTypeCard
          key={type}
          type={type}
          selected={selectedType === type}
          onSelect={setSelectedType}
        />
      ))}

      {/* ── Continue button (disabled until a type is chosen) ── */}
      <Button
        label="Continue"
        onPress={handleContinue}
        disabled={selectedType === null}
        style={styles.continueButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subheading: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  continueButton: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
});
