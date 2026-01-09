import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.md,
  zIndex: 1000,
});

export const modal = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.xl,
  width: '100%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'auto',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  margin: 0,
});

export const closeButton = style({
  padding: vars.space.xs,
  borderRadius: vars.borderRadius.sm,
  color: vars.color.textMuted,
  fontSize: '24px',
  lineHeight: 1,
  transition: 'color 0.2s ease, background-color 0.2s ease',
  
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const form = style({
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
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

export const inputWithPrefix = style({
  paddingLeft: vars.space.xl,
});

export const inputError = style({
  borderColor: vars.color.error,
  
  ':focus': {
    borderColor: vars.color.error,
    boxShadow: `0 0 0 3px ${vars.color.errorLight}`,
  },
});

export const errorText = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.error,
  marginTop: vars.space.xs,
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  padding: vars.space.lg,
  borderTop: `1px solid ${vars.color.border}`,
});

export const button = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderRadius: vars.borderRadius.md,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  transition: 'background-color 0.2s ease',
});

export const cancelButton = style([button, {
  backgroundColor: vars.color.surfaceHover,
  color: vars.color.text,
  
  ':hover': {
    backgroundColor: vars.color.border,
  },
}]);

export const submitButton = style([button, {
  backgroundColor: vars.color.primary,
  color: vars.color.textInverse,
  
  ':hover': {
    backgroundColor: vars.color.primaryHover,
  },
  
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}]);

export const select = style({
  width: '100%',
  padding: vars.space.md,
  fontSize: vars.fontSize.md,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: vars.space.xl,
  
  ':hover': {
    borderColor: vars.color.primary,
  },
  
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primaryLight}`,
  },
});

export const inputCalculated = style({
  width: '100%',
  padding: vars.space.md,
  fontSize: vars.fontSize.md,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  backgroundColor: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: vars.fontWeight.semibold,
  cursor: 'not-allowed',
});

export const calculatedBadge = style({
  marginLeft: vars.space.xs,
  padding: `2px ${vars.space.xs}`,
  fontSize: vars.fontSize.xs,
  backgroundColor: vars.color.successLight,
  color: vars.color.success,
  borderRadius: vars.borderRadius.sm,
  fontWeight: vars.fontWeight.medium,
});

export const helpText = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: vars.space.xs,
});
