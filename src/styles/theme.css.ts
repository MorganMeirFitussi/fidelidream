import { createTheme, createThemeContract, style } from '@vanilla-extract/css';

// Theme contract - defines the shape of theme variables
export const vars = createThemeContract({
  color: {
    // Primary palette - Deep teal for trust/finance
    primary: null,
    primaryHover: null,
    primaryLight: null,
    
    // Secondary palette - Warm gold for accents
    secondary: null,
    secondaryHover: null,
    
    // Semantic colors
    success: null,
    successLight: null,
    error: null,
    errorLight: null,
    warning: null,
    warningLight: null,
    
    // Neutrals
    background: null,
    surface: null,
    surfaceHover: null,
    border: null,
    borderLight: null,
    
    // Text
    text: null,
    textSecondary: null,
    textMuted: null,
    textInverse: null,
  },
  space: {
    none: null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
    xxxl: null,
  },
  fontSize: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
    xxxl: null,
  },
  fontWeight: {
    normal: null,
    medium: null,
    semibold: null,
    bold: null,
  },
  borderRadius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
  },
  shadow: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
});

// Light theme (default)
export const lightTheme = createTheme(vars, {
  color: {
    // Deep teal - professional, trustworthy
    primary: '#0d7377',
    primaryHover: '#0a5c5f',
    primaryLight: '#e6f4f4',
    
    // Warm gold - for positive values and accents
    secondary: '#d4a574',
    secondaryHover: '#c49464',
    
    // Semantic
    success: '#059669',
    successLight: '#d1fae5',
    error: '#dc2626',
    errorLight: '#fee2e2',
    warning: '#d97706',
    warningLight: '#fef3c7',
    
    // Neutrals - warm undertones
    background: '#faf9f7',
    surface: '#ffffff',
    surfaceHover: '#f5f4f2',
    border: '#e5e2dc',
    borderLight: '#f0ede7',
    
    // Text
    text: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    textInverse: '#ffffff',
  },
  space: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
});

// Utility class for applying the theme
export const themeClass = style({
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  backgroundColor: vars.color.background,
  color: vars.color.text,
  minHeight: '100vh',
});
