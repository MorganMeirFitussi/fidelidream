import { forwardRef, type InputHTMLAttributes } from 'react';
import { vars } from '../../styles/theme.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ prefix, error, style, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: vars.space.md,
      paddingLeft: prefix ? vars.space.xl : vars.space.md,
      fontSize: vars.fontSize.md,
      border: `1px solid ${error ? vars.color.error : vars.color.border}`,
      borderRadius: vars.borderRadius.md,
      backgroundColor: vars.color.surface,
      color: vars.color.text,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      ...style,
    };

    if (prefix) {
      return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              position: 'absolute',
              left: vars.space.md,
              color: vars.color.textMuted,
              fontSize: vars.fontSize.md,
              fontWeight: vars.fontWeight.medium,
              pointerEvents: 'none',
            }}
          >
            {prefix}
          </span>
          <input ref={ref} style={inputStyle} {...props} />
        </div>
      );
    }

    return <input ref={ref} style={inputStyle} {...props} />;
  }
);

Input.displayName = 'Input';
