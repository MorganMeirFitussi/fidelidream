import { forwardRef, type SelectHTMLAttributes } from 'react';
import { vars } from '../../styles/theme.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, style, ...props }, ref) => {
    return (
      <select
        ref={ref}
        style={{
          width: '100%',
          padding: vars.space.md,
          fontSize: vars.fontSize.md,
          border: `1px solid ${vars.color.border}`,
          borderRadius: vars.borderRadius.md,
          backgroundColor: vars.color.surface,
          color: vars.color.text,
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
          outline: 'none',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: vars.space.xl,
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
