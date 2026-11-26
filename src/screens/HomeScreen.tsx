import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import { HistoryEntry, loadHistory } from '../services/historyStorage';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * HomeScreen — landing page with brand header, primary CTA, and
 * a Recent Verifications list backed by local AsyncStorage history.
 */
export default function HomeScreen({ navigation }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Refresh history whenever HomeScreen comes into focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadHistory().then((entries) => {
        if (active) setHistory(entries);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const recentEntries = history.slice(0, 5);
  const fullyMatchedCount = history.filter(
    (item) => item.totalFields > 0 && item.matchedFields === item.totalFields,
  ).length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Brand area ── */}
      <View style={styles.brandArea}>
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

      {/* ── Recent Verifications ── */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Recent Verifications</Text>

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No verifications yet</Text>
            <Text style={styles.emptySub}>
              Tap "Verify a Document" above to check your first certificate or marksheet.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.historySummary}>
              {history.length} {history.length === 1 ? 'document' : 'documents'} verified,{' '}
              {fullyMatchedCount} fully matched
            </Text>

            {recentEntries.map((entry) => {
              const allMatched =
                entry.totalFields > 0 && entry.matchedFields === entry.totalFields;

              return (
                <View key={entry.id} style={styles.historyRow}>
                  <View style={styles.historyMeta}>
                    <Text style={styles.historyDocType}>
                      {entry.documentType.toUpperCase()} • {entry.fileName}
                    </Text>
                    <Text style={styles.historySub}>
                      {entry.matchedFields}/{entry.totalFields} fields matched •{' '}
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      allMatched ? styles.badgeMatch : styles.badgeMismatch,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        allMatched ? styles.badgeTextMatch : styles.badgeTextMismatch,
                      ]}
                    >
                      {allMatched ? 'Matched' : 'Mismatch'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
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
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  /* Brand */
  brandArea: {
    alignItems: 'center',
    marginTop: spacing.md,
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
    marginBottom: spacing.xl,
  },

  /* History section */
  historySection: {
    width: '100%',
  },
  historyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  historySummary: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  emptyTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySub: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyMeta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  historyDocType: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  historySub: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  badgeMatch: {
    backgroundColor: colors.success + '20',
  },
  badgeMismatch: {
    backgroundColor: colors.warning + '24',
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
  },
  badgeTextMatch: {
    color: colors.success,
  },
  badgeTextMismatch: {
    color: colors.warning,
  },
});
