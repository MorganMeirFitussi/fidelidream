import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  boxShadow: vars.shadow.md,
  marginBottom: vars.space.xl,
});

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  marginBottom: vars.space.lg,
  color: vars.color.text,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: vars.space.lg,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const label = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textSecondary,
});

export const inputWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

export const inputPrefix = style({
  position: 'absolute',
  left: vars.space.md,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.medium,
  pointerEvents: 'none',
  zIndex: 1,
});

export const input = style({
  width: '100%',
  padding: vars.space.md,
  paddingLeft: vars.space.xl,
  fontSize: vars.fontSize.md,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  
  ':hover': {
    borderColor: vars.color.primary,
  },
  
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primaryLight}`,
  },
  
  '::placeholder': {
    color: vars.color.textMuted,
  },
});

export const inputNoPadding = style({
  paddingLeft: vars.space.md,
});

export const helpText = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: vars.space.xs,
});
