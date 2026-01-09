import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';

describe('useDragAndDrop', () => {
  const createMockDragEvent = (overrides = {}): React.DragEvent => ({
    preventDefault: vi.fn(),
    dataTransfer: {
      effectAllowed: '',
      dropEffect: '',
      setData: vi.fn(),
    },
    currentTarget: {
      style: { opacity: '1' },
    },
    ...overrides,
  } as unknown as React.DragEvent);

  it('should initialize with null indices', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));

    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should set draggedIndex on drag start', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    act(() => {
      result.current.handleDragStart(2)(mockEvent);
    });

    expect(result.current.draggedIndex).toBe(2);
    expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
  });

  it('should set dragOverIndex on drag over different index', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // First start dragging from index 0
    act(() => {
      result.current.handleDragStart(0)(mockEvent);
    });

    // Then drag over index 2
    act(() => {
      result.current.handleDragOver(2)(mockEvent);
    });

    expect(result.current.dragOverIndex).toBe(2);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.dataTransfer.dropEffect).toBe('move');
  });

  it('should not set dragOverIndex when dragging over same index', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Start dragging from index 1
    act(() => {
      result.current.handleDragStart(1)(mockEvent);
    });

    // Drag over same index 1
    act(() => {
      result.current.handleDragOver(1)(mockEvent);
    });

    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should reset dragOverIndex on drag leave', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Start drag
    act(() => {
      result.current.handleDragStart(0)(mockEvent);
    });

    // Drag over (need fresh handler after state change)
    act(() => {
      result.current.handleDragOver(2)(mockEvent);
    });

    expect(result.current.dragOverIndex).toBe(2);

    // Leave
    act(() => {
      result.current.handleDragLeave();
    });

    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should call onReorder and reset indices on drop', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Start dragging from index 0
    act(() => {
      result.current.handleDragStart(0)(mockEvent);
    });

    // Drop on index 2
    act(() => {
      result.current.handleDrop(2)(mockEvent);
    });

    expect(onReorder).toHaveBeenCalledWith(0, 2);
    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should not call onReorder when dropping on same index', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Start dragging from index 1
    act(() => {
      result.current.handleDragStart(1)(mockEvent);
    });

    // Drop on same index 1
    act(() => {
      result.current.handleDrop(1)(mockEvent);
    });

    expect(onReorder).not.toHaveBeenCalled();
    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should reset all state on drag end', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Start drag
    act(() => {
      result.current.handleDragStart(0)(mockEvent);
    });

    // Drag over (need fresh handler after state change)
    act(() => {
      result.current.handleDragOver(2)(mockEvent);
    });

    expect(result.current.draggedIndex).toBe(0);
    expect(result.current.dragOverIndex).toBe(2);

    // End drag
    act(() => {
      result.current.handleDragEnd();
    });

    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should not set dragOverIndex when draggedIndex is null', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Drag over without starting drag
    act(() => {
      result.current.handleDragOver(2)(mockEvent);
    });

    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should not call onReorder when draggedIndex is null on drop', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));
    const mockEvent = createMockDragEvent();

    // Drop without starting drag
    act(() => {
      result.current.handleDrop(2)(mockEvent);
    });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('should reset opacity on all draggable elements on drag end', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(onReorder));

    // Create mock draggable elements in the DOM
    const div1 = document.createElement('div');
    div1.setAttribute('draggable', 'true');
    div1.style.opacity = '0.5';
    document.body.appendChild(div1);

    const div2 = document.createElement('div');
    div2.setAttribute('draggable', 'true');
    div2.style.opacity = '0.5';
    document.body.appendChild(div2);

    // Call handleDragEnd
    act(() => {
      result.current.handleDragEnd();
    });

    // Verify opacity is reset
    expect(div1.style.opacity).toBe('1');
    expect(div2.style.opacity).toBe('1');

    // Clean up
    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });
});
