import { style, keyframes } from '@vanilla-extract/css';
import { vars } from './theme.css';

// ============================================
// Animations
// ============================================

export const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

// ============================================
// Layout
// ============================================

export const section = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  boxShadow: vars.shadow.md,
});

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.lg,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  margin: 0,
});

// ============================================
// Grid / Lists
// ============================================

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: vars.space.md,
});

// ============================================
// Empty State
// ============================================

export const emptyState = style({
  textAlign: 'center',
  padding: vars.space.xxl,
  color: vars.color.textMuted,
});

export const emptyIcon = style({
  fontSize: '3rem',
  marginBottom: vars.space.md,
});

export const emptyText = style({
  fontSize: vars.fontSize.md,
  margin: 0,
});

// ============================================
// Package Card
// ============================================

export const packageCard = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  border: `1px solid ${vars.color.border}`,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    borderColor: vars.color.primary,
    boxShadow: vars.shadow.sm,
  },
});

export const packageCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: vars.space.md,
});

export const packageName = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  margin: 0,
});

export const packageActions = style({
  display: 'flex',
  gap: vars.space.xs,
});

export const actionButton = style({
  padding: vars.space.xs,
  borderRadius: vars.borderRadius.sm,
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: vars.fontSize.md,
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
  },
});

export const packageStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.md,
});

export const stat = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const statValue = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
});

// ============================================
// Badges
// ============================================

export const badgeContainer = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
  marginTop: vars.space.sm,
});

// ============================================
// Results
// ============================================

export const resultsCard = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  boxShadow: vars.shadow.lg,
  border: `2px solid ${vars.color.primary}`,
});

export const resultsHeader = style({
  textAlign: 'center',
  marginBottom: vars.space.lg,
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const resultsTitle = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.textSecondary,
  marginBottom: vars.space.sm,
});

export const resultsValue = style({
  fontSize: vars.fontSize.xxxl,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary,
});

export const resultsSubValue = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.textSecondary,
  marginTop: vars.space.xs,
});

export const breakdownSection = style({
  marginTop: vars.space.lg,
});

export const breakdownTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  marginBottom: vars.space.md,
});

export const breakdownItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${vars.space.sm} 0`,
  borderBottom: `1px solid ${vars.color.borderLight}`,
  ':last-child': {
    borderBottom: 'none',
  },
});

export const breakdownLabel = style({
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.sm,
});

export const breakdownValue = style({
  fontWeight: vars.fontWeight.medium,
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
});

// ============================================
// Personal Info Form
// ============================================

export const formGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: vars.space.lg,
});

// ============================================
// Disclaimer
// ============================================

export const disclaimer = style({
  backgroundColor: vars.color.primaryLight,
  borderRadius: vars.borderRadius.md,
  padding: vars.space.md,
  marginBottom: vars.space.lg,
});

export const disclaimerTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.primary,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  marginBottom: vars.space.xs,
});

export const disclaimerText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  margin: 0,
  lineHeight: 1.5,
});
