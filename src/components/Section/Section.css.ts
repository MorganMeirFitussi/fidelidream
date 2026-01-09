import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  boxShadow: vars.shadow.md,
  marginBottom: vars.space.xl,
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.lg,
});

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  margin: 0,
});

export const addButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.primary,
  color: vars.color.textInverse,
  borderRadius: vars.borderRadius.md,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  transition: 'background-color 0.2s ease',
  
  ':hover': {
    backgroundColor: vars.color.primaryHover,
  },
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: vars.space.md,
});

export const emptyState = style({
  textAlign: 'center',
  padding: vars.space.xxl,
  color: vars.color.textMuted,
});

export const emptyIcon = style({
  fontSize: '48px',
  marginBottom: vars.space.md,
  opacity: 0.5,
});

export const emptyText = style({
  fontSize: vars.fontSize.md,
  marginBottom: vars.space.md,
});
