import { useEffect, type ReactNode } from 'react';
import { vars } from '../../styles/theme.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: vars.space.md,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: vars.color.surface,
          borderRadius: vars.borderRadius.lg,
          boxShadow: vars.shadow.xl,
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: vars.space.lg,
            borderBottom: `1px solid ${vars.color.border}`,
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              fontSize: vars.fontSize.xl,
              fontWeight: vars.fontWeight.semibold,
              color: vars.color.text,
              margin: 0,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: vars.space.xs,
              borderRadius: vars.borderRadius.sm,
              color: vars.color.textMuted,
              fontSize: '24px',
              lineHeight: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: vars.space.lg,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: vars.space.sm,
              padding: vars.space.lg,
              borderTop: `1px solid ${vars.color.border}`,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
