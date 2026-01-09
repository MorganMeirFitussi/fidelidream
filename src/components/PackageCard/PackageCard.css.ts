import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const card = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  padding: vars.space.md,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  
  ':hover': {
    borderColor: vars.color.primary,
    boxShadow: vars.shadow.sm,
  },
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: vars.space.md,
});

export const name = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  margin: 0,
});

export const actions = style({
  display: 'flex',
  gap: vars.space.xs,
});

export const actionButton = style({
  padding: vars.space.xs,
  borderRadius: vars.borderRadius.sm,
  color: vars.color.textMuted,
  transition: 'color 0.2s ease, background-color 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  
  ':hover': {
    color: vars.color.primary,
    backgroundColor: vars.color.primaryLight,
  },
});

export const deleteButton = style({
  ':hover': {
    color: vars.color.error,
    backgroundColor: vars.color.errorLight,
  },
});

export const details = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: vars.space.sm,
});

export const detailItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const detailLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const detailValue = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.text,
});

export const routeBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.borderRadius.full,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  marginTop: vars.space.sm,
});

export const capitalGainBadge = style([routeBadge, {
  backgroundColor: vars.color.successLight,
  color: vars.color.success,
}]);

export const ordinaryIncomeBadge = style([routeBadge, {
  backgroundColor: vars.color.warningLight,
  color: vars.color.warning,
}]);

export const underwaterBadge = style([routeBadge, {
  backgroundColor: vars.color.errorLight,
  color: vars.color.error,
}]);

// Tooltip styles for route badges
export const tooltipContainer = style({
  position: 'relative',
  display: 'inline-block',
});

export const tooltipContent = style({
  visibility: 'hidden',
  opacity: 0,
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: vars.color.text,
  color: vars.color.textInverse,
  padding: vars.space.sm,
  borderRadius: vars.borderRadius.md,
  fontSize: vars.fontSize.xs,
  width: '280px',
  textAlign: 'left',
  zIndex: 1000,
  marginBottom: vars.space.xs,
  transition: 'opacity 0.15s ease-in-out, visibility 0.15s ease-in-out',
  lineHeight: 1.4,
  fontWeight: vars.fontWeight.normal,
  boxShadow: vars.shadow.lg,
  
  selectors: {
    [`${tooltipContainer}:hover &`]: {
      visibility: 'visible',
      opacity: 1,
    },
  },
});

export const tooltipTitle = style({
  fontWeight: vars.fontWeight.semibold,
  marginBottom: vars.space.xs,
  fontSize: vars.fontSize.sm,
});
