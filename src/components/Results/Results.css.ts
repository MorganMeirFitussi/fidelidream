import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const container = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  boxShadow: vars.shadow.lg,
  marginTop: vars.space.xl,
  border: `2px solid ${vars.color.primary}`,
});

export const header = style({
  textAlign: 'center',
  marginBottom: vars.space.xl,
});

export const title = style({
  fontSize: vars.fontSize.xxl,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.text,
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
});

export const subtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const totalsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: vars.space.lg,
  marginBottom: vars.space.xl,
  padding: vars.space.lg,
  backgroundColor: vars.color.primaryLight,
  borderRadius: vars.borderRadius.md,
});

export const totalItem = style({
  textAlign: 'center',
});

export const totalLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginBottom: vars.space.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const totalValue = style({
  fontSize: vars.fontSize.xxl,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary,
});

export const totalValueSmall = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textSecondary,
  marginTop: vars.space.xs,
});

export const effectiveRate = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.success,
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.successLight,
  borderRadius: vars.borderRadius.full,
  width: 'fit-content',
  margin: '0 auto',
});

export const section = style({
  marginBottom: vars.space.xl,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
  marginBottom: vars.space.md,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const breakdownTable = style({
  width: '100%',
  borderCollapse: 'collapse',
});

export const tableRow = style({
  borderBottom: `1px solid ${vars.color.borderLight}`,
  
  ':last-child': {
    borderBottom: 'none',
  },
});

export const tableRowTotal = style({
  borderTop: `2px solid ${vars.color.border}`,
  fontWeight: vars.fontWeight.semibold,
});

export const tableCell = style({
  padding: vars.space.md,
  fontSize: vars.fontSize.md,
  color: vars.color.text,
});

export const tableCellLabel = style([tableCell, {
  color: vars.color.textSecondary,
}]);

export const tableCellValue = style([tableCell, {
  textAlign: 'right',
  fontWeight: vars.fontWeight.medium,
  fontVariantNumeric: 'tabular-nums',
}]);

export const tableCellNegative = style({
  color: vars.color.success,
});

export const packageBreakdown = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const packageCard = style({
  padding: vars.space.md,
  backgroundColor: vars.color.surfaceHover,
  borderRadius: vars.borderRadius.md,
  border: `1px solid ${vars.color.borderLight}`,
});

export const packageHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.sm,
});

export const packageName = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
});

export const packageType = style({
  fontSize: vars.fontSize.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.borderRadius.full,
  backgroundColor: vars.color.primary,
  color: vars.color.textInverse,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const packageDetails = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space.sm,
  fontSize: vars.fontSize.sm,
});

export const packageDetail = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const packageDetailLabel = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

export const packageDetailValue = style({
  fontWeight: vars.fontWeight.medium,
  color: vars.color.text,
});

// Tooltip styles
export const tooltipContainer = style({
  position: 'relative',
  display: 'inline-block',
});

export const tooltipTrigger = style({
  cursor: 'help',
  borderBottom: '1px dotted currentColor',
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
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.borderRadius.sm,
  fontSize: vars.fontSize.xs,
  whiteSpace: 'nowrap',
  zIndex: 1000,
  marginBottom: vars.space.xs,
  transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
  
  selectors: {
    [`${tooltipContainer}:hover &`]: {
      visibility: 'visible',
      opacity: 1,
    },
  },
});
