import { useState, type ReactNode } from 'react';
import { vars } from '../../styles/theme.css';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  tooltip?: ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: vars.color.successLight, color: vars.color.success },
  warning: { bg: vars.color.warningLight, color: vars.color.warning },
  error: { bg: vars.color.errorLight, color: vars.color.error },
  info: { bg: vars.color.primaryLight, color: vars.color.primary },
};

export function Badge({ variant = 'info', children, tooltip }: BadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const styles = variantStyles[variant];

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: vars.space.xs,
          padding: `${vars.space.xs} ${vars.space.sm}`,
          fontSize: vars.fontSize.xs,
          fontWeight: vars.fontWeight.medium,
          backgroundColor: styles.bg,
          color: styles.color,
          borderRadius: vars.borderRadius.md,
          cursor: tooltip ? 'help' : 'default',
        }}
      >
        {children}
      </span>

      {tooltip && showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            backgroundColor: vars.color.text,
            color: vars.color.textInverse,
            textAlign: 'left',
            borderRadius: vars.borderRadius.sm,
            padding: vars.space.sm,
            fontSize: vars.fontSize.xs,
            lineHeight: 1.4,
            boxShadow: vars.shadow.md,
            zIndex: 10,
          }}
        >
          {tooltip}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              marginLeft: '-5px',
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: `${vars.color.text} transparent transparent transparent`,
            }}
          />
        </div>
      )}
    </div>
  );
}
