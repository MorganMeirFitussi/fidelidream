import { useState, useCallback } from 'react';

interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: () => void;
  close: () => void;
  openWith: (data: T) => void;
}

/**
 * Generic hook for modal state management
 * @returns Modal state and control functions
 */
export function useModal<T = unknown>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback(() => {
    setData(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const openWith = useCallback((newData: T) => {
    setData(newData);
    setIsOpen(true);
  }, []);

  return { isOpen, data, open, close, openWith };
}
