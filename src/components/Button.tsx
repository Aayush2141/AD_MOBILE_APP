import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../constants/theme';

interface ButtonProps {
  /** Label displayed on the button */
  label: string;
  /** Called when the button is pressed */
  onPress: () => void;
  /** Visual variant — primary (filled) or outline */
  variant?: 'primary' | 'outline';
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** Disables interaction without showing a spinner */
  disabled?: boolean;
  /** Extra styles applied to the outer TouchableOpacity */
  style?: StyleProp<ViewStyle>;
}

/**
 * Button — reusable themed button component.
 * Supports primary (filled) and outline variants.
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.accent} />
      ) : (
        <Text style={[styles.label, !isPrimary && styles.labelOutline]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  primary: {
    backgroundColor: colors.highlight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0.5,
  },
  labelOutline: {
    color: colors.accent,
  },
});
