import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the theme.css.ts module to avoid Vanilla Extract processing issues
vi.mock('../../styles/theme.css', () => ({
  lightTheme: 'light-theme-class',
  darkTheme: 'dark-theme-class',
}));

import { useTheme } from '../useTheme';

describe('useTheme', () => {
  let matchMediaListeners: Array<(event: MediaQueryListEvent) => void> = [];
  let mockMatches = false;

  const createMockMatchMedia = (matches: boolean) => {
    mockMatches = matches;
    return vi.fn().mockImplementation((query: string) => ({
      matches: mockMatches,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, callback: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners.push(callback);
        }
      }),
      removeEventListener: vi.fn((event: string, callback: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners = matchMediaListeners.filter(cb => cb !== callback);
        }
      }),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  };

  beforeEach(() => {
    matchMediaListeners = [];
    mockMatches = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return darkTheme when system prefers dark mode', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() => useTheme());
    
    expect(result.current).toBe('dark-theme-class');
  });

  it('should return lightTheme when system prefers light mode', () => {
    window.matchMedia = createMockMatchMedia(false);

    const { result } = renderHook(() => useTheme());
    
    expect(result.current).toBe('light-theme-class');
  });

  it('should update theme when system preference changes from light to dark', () => {
    window.matchMedia = createMockMatchMedia(false);

    const { result } = renderHook(() => useTheme());
    
    expect(result.current).toBe('light-theme-class');

    // Simulate system preference change to dark
    act(() => {
      matchMediaListeners.forEach(listener => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe('dark-theme-class');
  });

  it('should update theme when system preference changes from dark to light', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() => useTheme());
    
    expect(result.current).toBe('dark-theme-class');

    // Simulate system preference change to light
    act(() => {
      matchMediaListeners.forEach(listener => {
        listener({ matches: false } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe('light-theme-class');
  });

  it('should cleanup event listener on unmount', () => {
    const mockRemoveEventListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, callback: (event: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners.push(callback);
        }
      }),
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { unmount } = renderHook(() => useTheme());
    
    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
