import { useState, useCallback } from 'react';

interface UseDragAndDropResult {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  handleDragStart: (index: number) => (e: React.DragEvent) => void;
  handleDragOver: (index: number) => (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (index: number) => (e: React.DragEvent) => void;
  handleDragEnd: () => void;
}

/**
 * Hook for managing drag and drop state and handlers for reorderable lists.
 * @param onReorder - Callback function called when items are reordered
 */
export function useDragAndDrop(
  onReorder: (fromIndex: number, toIndex: number) => void
): UseDragAndDropResult {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    
    // Add a slight delay to allow the drag image to be captured
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.5';
    }, 0);
  }, []);

  const handleDragOver = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && index !== draggedIndex) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, onReorder]);

  const handleDragEnd = useCallback(() => {
    // Reset opacity on the dragged element
    const draggedElements = document.querySelectorAll('[draggable="true"]');
    draggedElements.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
