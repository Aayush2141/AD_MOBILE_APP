/**
 * theme.ts
 * Central design token file — colors, spacing, and font sizes.
 * Import from here rather than hard-coding values in component files.
 */

export const colors = {
  // Brand
  primary: '#1a1a2e',      // deep navy — main brand color
  primaryLight: '#16213e', // slightly lighter navy
  accent: '#0f3460',       // accent blue
  highlight: '#e94560',    // call-to-action red-pink

  // Neutrals
  white: '#ffffff',
  background: '#f5f5f5',
  surface: '#ffffff',
  border: '#e0e0e0',

  // Text
  textPrimary: '#1a1a2e',
  textSecondary: '#555555',
  textMuted: '#888888',

  // Status
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#2980b9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  full: 9999,
};
