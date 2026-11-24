import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { DocumentType } from '../types/document';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

// Human-readable label and emoji for each DocumentType value
const DOC_META: Record<DocumentType, { label: string; icon: string; description: string }> = {
  marksheet:   { label: 'Marksheet',          icon: '📄', description: 'Degree / semester marksheet' },
  certificate: { label: 'Certificate',         icon: '🎓', description: 'Educational degree certificate' },
  gate:        { label: 'GATE Scorecard',      icon: '📊', description: 'GATE examination scorecard' },
  experience:  { label: 'Experience Letter',   icon: '💼', description: 'Work experience certificate' },
  caste:       { label: 'Caste Certificate',   icon: '📋', description: 'SC / ST / OBC community certificate' },
  ews:         { label: 'EWS Certificate',     icon: '📜', description: 'Economically Weaker Section certificate' },
  pwd:         { label: 'PwD Certificate',     icon: '♿', description: 'Person with Disability certificate' },
};

interface DocumentTypeCardProps {
  type: DocumentType;
  selected: boolean;
  onSelect: (type: DocumentType) => void;
}

/**
 * DocumentTypeCard — tappable card representing one DRDO RAC document type.
 * Renders highlighted when selected.
 */
export default function DocumentTypeCard({
  type,
  selected,
  onSelect,
}: DocumentTypeCardProps) {
  const { label, icon, description } = DOC_META[type];

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onSelect(type)}
      activeOpacity={0.75}
    >
      {/* Left: icon */}
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Center: text */}
      <View style={styles.textWrap}>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Right: selection indicator */}
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

/** Exported helper: returns all DocumentType values in a stable display order. */
export const ALL_DOCUMENT_TYPES: DocumentType[] = [
  'marksheet',
  'certificate',
  'gate',
  'experience',
  'caste',
  'ews',
  'pwd',
];

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardSelected: {
    borderColor: colors.highlight,
    backgroundColor: '#fff0f3',  // very light tint of highlight color
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconWrapSelected: {
    backgroundColor: colors.highlight + '22', // 13% opacity tint
  },
  icon: {
    fontSize: 22,
  },

  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  labelSelected: {
    color: colors.highlight,
  },
  description: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },

  // Radio button circle
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  radioSelected: {
    borderColor: colors.highlight,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.highlight,
  },
});
