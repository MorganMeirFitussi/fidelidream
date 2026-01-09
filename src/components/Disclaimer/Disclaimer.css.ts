import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  backgroundColor: vars.color.warningLight,
  border: `1px solid ${vars.color.warning}`,
  borderRadius: vars.borderRadius.md,
  padding: vars.space.lg,
  marginBottom: vars.space.xl,
});

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.warning,
  marginBottom: vars.space.sm,
});

export const text = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text,
  lineHeight: 1.6,
  margin: 0,
});

export const highlight = style({
  fontWeight: vars.fontWeight.semibold,
});
