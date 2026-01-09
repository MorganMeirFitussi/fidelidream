import { useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme.css';

/**
 * Hook that returns the appropriate theme class based on system preference.
 * Listens for changes in prefers-color-scheme and updates automatically.
 */
export function useTheme(): string {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    // Set initial value
    setIsDark(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDark ? darkTheme : lightTheme;
}
