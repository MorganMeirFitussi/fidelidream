import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from '../useModal';

describe('useModal', () => {
  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useModal<string>());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should open modal without data', () => {
    const { result } = renderHook(() => useModal<string>());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should open modal with data', () => {
    const { result } = renderHook(() => useModal<string>());
    
    act(() => {
      result.current.openWith('test-data');
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toBe('test-data');
  });

  it('should close modal and clear data', () => {
    const { result } = renderHook(() => useModal<string>());
    
    act(() => {
      result.current.openWith('test-data');
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should clear data when opening without data after having data', () => {
    const { result } = renderHook(() => useModal<string>());
    
    act(() => {
      result.current.openWith('test-data');
    });
    
    expect(result.current.data).toBe('test-data');
    
    act(() => {
      result.current.close();
    });
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should work with complex data types', () => {
    interface TestData {
      id: number;
      name: string;
    }
    
    const { result } = renderHook(() => useModal<TestData>());
    
    act(() => {
      result.current.openWith({ id: 1, name: 'Test' });
    });
    
    expect(result.current.data).toEqual({ id: 1, name: 'Test' });
  });
});
