import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DocumentType } from '../types/document';
import DocumentTypeCard, { ALL_DOCUMENT_TYPES } from '../components/DocumentTypeCard';
import Button from '../components/Button';
import { pickDocument, pickImage, takePhoto, PickedFile } from '../services/filePicker';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

/**
 * UploadScreen — two-step form:
 *   Step 1 (Commit 5): select document type
 *   Step 2 (Commit 6): pick or capture the actual file
 *
 * "Continue" in Commit 7 will trigger the mock verification service.
 */
export default function UploadScreen({ navigation }: Props) {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);

  // ── File picker handlers ────────────────────────────────────────────────

  const handlePickDocument = async () => {
    const file = await pickDocument();
    if (file) setPickedFile(file);
  };

  const handlePickImage = async () => {
    const file = await pickImage();
    if (file) setPickedFile(file);
  };

  const handleTakePhoto = async () => {
    const file = await takePhoto();
    if (file) setPickedFile(file);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** True when the picked file is an image (not a PDF) */
  const isImage =
    pickedFile?.mimeType.startsWith('image/') ?? false;

  const handleContinue = () => {
    if (!selectedType || !pickedFile) return;
    // TODO (Commit 7): call verificationService and pass result to ResultScreen
    console.log('[UploadScreen] type:', selectedType, 'file:', pickedFile.name);
  };

  // Both a type and a file must be chosen before continuing
  const canContinue = selectedType !== null && pickedFile !== null;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Step 1: document type ── */}
      <Text style={styles.sectionTitle}>Step 1 — Select Document Type</Text>
      <Text style={styles.sectionSub}>
        Choose the category of the document you want to verify.
      </Text>

      {ALL_DOCUMENT_TYPES.map((type) => (
        <DocumentTypeCard
          key={type}
          type={type}
          selected={selectedType === type}
          onSelect={setSelectedType}
        />
      ))}

      {/* ── Step 2: pick the file ── */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
        Step 2 — Add Your Document
      </Text>
      <Text style={styles.sectionSub}>
        Upload a PDF or take / choose an image of your document.
      </Text>

      {/* Picker action buttons */}
      <View style={styles.pickerRow}>
        <PickerButton
          icon="📂"
          label="Choose PDF"
          onPress={handlePickDocument}
        />
        <PickerButton
          icon="🖼️"
          label="Choose Image"
          onPress={handlePickImage}
        />
        <PickerButton
          icon="📷"
          label="Take Photo"
          onPress={handleTakePhoto}
        />
      </View>

      {/* File preview — shown after a file is picked */}
      {pickedFile && (
        <View style={styles.previewCard}>
          {/* Show thumbnail only for image files */}
          {isImage && (
            <Image
              source={{ uri: pickedFile.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.previewMeta}>
            <Text style={styles.previewIcon}>{isImage ? '🖼️' : '📄'}</Text>
            <Text style={styles.previewName} numberOfLines={2}>
              {pickedFile.name}
            </Text>
            <Text style={styles.previewMime}>{pickedFile.mimeType}</Text>
          </View>
          {/* Allow user to clear and pick a different file */}
          <TouchableOpacity
            onPress={() => setPickedFile(null)}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Continue ── */}
      <Button
        label="Continue"
        onPress={handleContinue}
        disabled={!canContinue}
        style={styles.continueButton}
      />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Small local component — one of the three picker action buttons
// ---------------------------------------------------------------------------

interface PickerButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

function PickerButton({ icon, label, onPress }: PickerButtonProps) {
  return (
    <TouchableOpacity style={styles.pickerBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.pickerBtnIcon}>{icon}</Text>
      <Text style={styles.pickerBtnLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },

  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionSub: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },

  /* Picker action row */
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pickerBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pickerBtnIcon: { fontSize: 24, marginBottom: 4 },
  pickerBtnLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  /* File preview card */
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 72,
    height: 72,
  },
  previewMeta: {
    flex: 1,
    padding: spacing.sm,
  },
  previewIcon: { fontSize: 18, marginBottom: 2 },
  previewName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
  },
  previewMime: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  clearBtn: {
    padding: spacing.md,
  },
  clearBtnText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },

  continueButton: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
});
