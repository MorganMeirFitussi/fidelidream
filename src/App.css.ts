import { style } from '@vanilla-extract/css';
import { vars } from './styles/theme.css';

export const app = style({
  minHeight: '100vh',
  backgroundColor: vars.color.background,
});

export const container = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: vars.space.lg,
  
  '@media': {
    'screen and (min-width: 768px)': {
      padding: vars.space.xl,
    },
  },
});

export const header = style({
  textAlign: 'center',
  marginBottom: vars.space.xxl,
  paddingTop: vars.space.xl,
});

export const logo = style({
  fontSize: '48px',
  marginBottom: vars.space.md,
});

export const title = style({
  fontSize: vars.fontSize.xxxl,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.text,
  marginBottom: vars.space.sm,
  
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: vars.fontSize.xxl,
    },
  },
});

export const subtitle = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.textSecondary,
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: 1.5,
});

export const calculateSection = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: vars.space.xl,
  marginBottom: vars.space.xl,
});

export const calculateButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.xxl}`,
  backgroundColor: vars.color.primary,
  color: vars.color.textInverse,
  borderRadius: vars.borderRadius.lg,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  transition: 'all 0.2s ease',
  boxShadow: vars.shadow.md,
  
  ':hover': {
    backgroundColor: vars.color.primaryHover,
    transform: 'translateY(-2px)',
    boxShadow: vars.shadow.lg,
  },
  
  ':active': {
    transform: 'translateY(0)',
  },
  
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export const footer = style({
  textAlign: 'center',
  padding: vars.space.xl,
  marginTop: vars.space.xxl,
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});
