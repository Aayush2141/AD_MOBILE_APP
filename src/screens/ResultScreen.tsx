import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ExtractedField, VerificationStatus } from '../types/document';
import Button from '../components/Button';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

// ── Status display helpers ────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; color: string; icon: string }
> = {
  verified: { label: 'All fields matched',       color: colors.success, icon: '✅' },
  mismatch: { label: 'Some fields mismatched',   color: colors.warning, icon: '⚠️' },
  failed:   { label: 'Verification failed',      color: colors.error,   icon: '❌' },
  pending:  { label: 'Pending',                  color: colors.info,    icon: '🕐' },
};

/** Human-readable display label for a field key (snake_case → Title Case). */
function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * ResultScreen — displays the VerificationResult passed via navigation params.
 *
 * Shows:
 *  • Overall status badge
 *  • Summary line: "X of Y fields matched"
 *  • List of extracted fields with ✓ / ✗ indicators
 *  • Processing time
 *  • "Verify Another Document" button → Home
 */
export default function ResultScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const { status, extractedFields, mismatches, documentType, processingTimeMs } = result;

  const matchedCount = extractedFields.length - mismatches.length;
  const totalCount = extractedFields.length;
  const statusCfg = STATUS_CONFIG[status];

  const handleVerifyAnother = () => {
    // Go back to Home so the user can start a fresh flow
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Status badge ── */}
      <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '1a' }]}>
        <Text style={styles.statusIcon}>{statusCfg.icon}</Text>
        <Text style={[styles.statusLabel, { color: statusCfg.color }]}>
          {statusCfg.label}
        </Text>
      </View>

      {/* ── Summary ── */}
      <Text style={styles.summaryText}>
        {matchedCount} of {totalCount} fields matched
      </Text>
      <Text style={styles.docType}>
        Document type:{' '}
        <Text style={styles.docTypeValue}>{documentType.toUpperCase()}</Text>
      </Text>

      {/* ── Extracted field list ── */}
      <Text style={styles.sectionTitle}>Extracted Fields</Text>

      {extractedFields.map((field) => (
        <FieldRow key={field.key} field={field} />
      ))}

      {/* ── Processing time ── */}
      <Text style={styles.processingTime}>
        ⏱ Processed in {processingTimeMs} ms
      </Text>

      {/* ── CTA ── */}
      <Button
        label="Verify Another Document"
        onPress={handleVerifyAnother}
        style={styles.ctaButton}
      />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Field row sub-component
// ---------------------------------------------------------------------------

function FieldRow({ field }: { field: ExtractedField }) {
  const matched = field.matchesBiodata;

  return (
    <View style={[styles.fieldRow, matched ? styles.fieldRowMatch : styles.fieldRowMismatch]}>
      {/* Match / mismatch indicator */}
      <Text style={styles.fieldIndicator}>{matched ? '✓' : '✗'}</Text>

      {/* Key + value */}
      <View style={styles.fieldText}>
        <Text style={styles.fieldKey}>{formatKey(field.key)}</Text>
        <Text style={styles.fieldValue}>{field.value}</Text>
        {!matched && (
          <Text style={styles.mismatchNote}>⚠ Doesn't match your biodata</Text>
        )}
      </View>

      {/* Confidence */}
      <Text style={styles.confidence}>
        {Math.round(field.confidence * 100)}%
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },

  /* Status badge */
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statusIcon: { fontSize: 28 },
  statusLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },

  /* Summary */
  summaryText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  docType: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  docTypeValue: {
    fontWeight: fontWeights.bold,
    color: colors.accent,
  },

  /* Section title */
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  /* Field row */
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  fieldRowMatch:    { borderLeftColor: colors.success },
  fieldRowMismatch: { borderLeftColor: colors.error },

  fieldIndicator: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginTop: 1,
    // color is implied by the row style but we keep it explicit:
  },
  fieldText: { flex: 1 },
  fieldKey: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  mismatchNote: {
    fontSize: fontSizes.xs,
    color: colors.error,
    marginTop: 4,
  },
  confidence: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Footer */
  processingTime: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  ctaButton: {
    alignSelf: 'center',
  },
});
