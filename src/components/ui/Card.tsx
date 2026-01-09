import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: vars.color.surface,
        borderRadius: vars.borderRadius.lg,
        padding: vars.space.lg,
        boxShadow: vars.shadow.md,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: string;
  action?: ReactNode;
}

export function CardHeader({ title, icon, action }: CardHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vars.space.lg,
      }}
    >
      <h2
        style={{
          fontSize: vars.fontSize.xl,
          fontWeight: vars.fontWeight.semibold,
          color: vars.color.text,
          display: 'flex',
          alignItems: 'center',
          gap: vars.space.sm,
          margin: 0,
        }}
      >
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {action}
    </div>
  );
}
