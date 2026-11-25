import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * HomeScreen — polished landing page (Commit 4).
 * Shows the app brand, a tagline, and the primary CTA button.
 */
export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* ── Brand area ── */}
      <View style={styles.brandArea}>
        {/* Shield icon placeholder (no image assets yet) */}
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>🛡️</Text>
        </View>

        <Text style={styles.appTitle}>DocVerify</Text>
        <Text style={styles.tagline}>
          Instant, accurate document verification{'\n'}for DRDO RAC candidates
        </Text>
      </View>

      {/* ── Info cards ── */}
      <View style={styles.cardRow}>
        <InfoCard icon="⚡" label="Under 3s" sub="per document" />
        <InfoCard icon="🎯" label="3σ Accuracy" sub="extraction" />
        <InfoCard icon="🌐" label="Multi-lang" sub="support" />
      </View>

      {/* ── Primary CTA ── */}
      <Button
        label="Verify a Document"
        onPress={() => navigation.navigate('Biodata')}
        style={styles.ctaButton}
      />

      <Text style={styles.footerNote}>
        Upload a photo or PDF of your DRDO RAC document
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Small helper component — stat card
// ---------------------------------------------------------------------------

interface InfoCardProps {
  icon: string;
  label: string;
  sub: string;
}

function InfoCard({ icon, label, sub }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  /* Brand */
  brandArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Info cards */
  cardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  cardSub: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* CTA */
  ctaButton: {
    marginBottom: spacing.md,
  },
  footerNote: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
