import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helpText?: string;
  badge?: string;
}

export function FormField({ label, children, error, helpText, badge }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.xs }}>
      <label
        style={{
          fontSize: vars.fontSize.sm,
          fontWeight: vars.fontWeight.medium,
          color: vars.color.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: vars.space.xs,
        }}
      >
        {label}
        {badge && (
          <span
            style={{
              padding: `2px ${vars.space.xs}`,
              fontSize: vars.fontSize.xs,
              backgroundColor: vars.color.successLight,
              color: vars.color.success,
              borderRadius: vars.borderRadius.sm,
              fontWeight: vars.fontWeight.medium,
            }}
          >
            {badge}
          </span>
        )}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: vars.fontSize.xs, color: vars.color.error }}>
          {error}
        </span>
      )}
      {helpText && !error && (
        <span style={{ fontSize: vars.fontSize.xs, color: vars.color.textMuted }}>
          {helpText}
        </span>
      )}
    </div>
  );
}

interface FormRowProps {
  children: ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: vars.space.md,
      }}
    >
      {children}
    </div>
  );
}
