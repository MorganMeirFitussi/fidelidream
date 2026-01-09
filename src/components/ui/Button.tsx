import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { vars } from '../../styles/theme.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: vars.color.primary,
    color: vars.color.textInverse,
  },
  secondary: {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: vars.color.text,
  },
  danger: {
    backgroundColor: vars.color.error,
    color: vars.color.textInverse,
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 12px', fontSize: vars.fontSize.sm },
  md: { padding: '8px 16px', fontSize: vars.fontSize.md },
  lg: { padding: '12px 24px', fontSize: vars.fontSize.lg },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      style={{
        border: 'none',
        borderRadius: vars.borderRadius.md,
        fontWeight: vars.fontWeight.medium,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: vars.space.sm,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {isLoading && <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>}
      {children}
    </button>
  );
}
