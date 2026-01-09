import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePackageForm } from '../usePackageForm';
import type { StockOptionPackage, RSUPackage } from '../../types';

// Mock the store
const mockAddStockOption = vi.fn();
const mockUpdateStockOption = vi.fn();
const mockAddRSU = vi.fn();
const mockUpdateRSU = vi.fn();

vi.mock('../../store/useEquityStore', () => ({
  useEquityStore: (selector: (state: unknown) => unknown) => {
    const state = {
      addStockOption: mockAddStockOption,
      updateStockOption: mockUpdateStockOption,
      addRSU: mockAddRSU,
      updateRSU: mockUpdateRSU,
    };
    return selector(state);
  },
}));

// Mock calculateVestedQuantity to return predictable values
vi.mock('../../utils/formatters', () => ({
  calculateVestedQuantity: vi.fn((total: number, date: string) => {
    if (!date || total <= 0) return 0;
    return Math.floor(total * 0.5); // Return 50% for testing
  }),
}));

describe('usePackageForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with empty state for new option', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      expect(result.current.state.name).toBe('');
      expect(result.current.state.totalQuantity).toBe('');
      expect(result.current.state.vestingDurationYears).toBe('4');
      expect(result.current.state.vestingFrequency).toBe('quarterly');
      expect(result.current.isEditing).toBe(false);
    });

    it('should initialize with empty state for new RSU', () => {
      const { result } = renderHook(() => 
        usePackageForm('rsu', null, mockOnSuccess)
      );

      expect(result.current.state.name).toBe('');
      expect(result.current.isEditing).toBe(false);
    });

    it('should populate form when editing option', () => {
      const editingOption: StockOptionPackage = {
        id: 'opt-1',
        name: 'Test Option',
        totalQuantity: 1000,
        vestedQuantity: 500,
        usedQuantity: 100,
        exercisePrice: 10,
        averagePrice: 15,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: 4,
        vestingFrequency: 'quarterly',
        createdAt: '2022-01-01',
      };

      const { result } = renderHook(() => 
        usePackageForm('option', editingOption, mockOnSuccess)
      );

      expect(result.current.state.name).toBe('Test Option');
      expect(result.current.state.totalQuantity).toBe('1000');
      expect(result.current.state.usedQuantity).toBe('100');
      expect(result.current.state.exercisePrice).toBe('10');
      expect(result.current.state.averagePrice).toBe('15');
      expect(result.current.isEditing).toBe(true);
    });

    it('should use defaults when editing option with undefined vesting fields', () => {
      const editingOption = {
        id: 'opt-1',
        name: 'Test Option',
        totalQuantity: 1000,
        vestedQuantity: 500,
        usedQuantity: 100,
        exercisePrice: 10,
        averagePrice: 15,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: undefined,
        vestingFrequency: undefined,
        createdAt: '2022-01-01',
      } as unknown as StockOptionPackage;

      const { result } = renderHook(() => 
        usePackageForm('option', editingOption, mockOnSuccess)
      );

      expect(result.current.state.vestingDurationYears).toBe('4');
      expect(result.current.state.vestingFrequency).toBe('quarterly');
    });

    it('should populate form when editing RSU', () => {
      const editingRSU: RSUPackage = {
        id: 'rsu-1',
        name: 'Test RSU',
        totalQuantity: 500,
        vestedQuantity: 250,
        usedQuantity: 50,
        averageVestingPrice: 20,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: 4,
        vestingFrequency: 'monthly',
        createdAt: '2022-01-01',
      };

      const { result } = renderHook(() => 
        usePackageForm('rsu', editingRSU, mockOnSuccess)
      );

      expect(result.current.state.name).toBe('Test RSU');
      expect(result.current.state.totalQuantity).toBe('500');
      expect(result.current.state.usedQuantity).toBe('50');
      expect(result.current.state.averageVestingPrice).toBe('20');
      expect(result.current.state.vestingFrequency).toBe('monthly');
      expect(result.current.isEditing).toBe(true);
    });

    it('should use defaults when editing RSU with undefined vesting fields', () => {
      const editingRSU = {
        id: 'rsu-1',
        name: 'Test RSU',
        totalQuantity: 500,
        vestedQuantity: 250,
        usedQuantity: 50,
        averageVestingPrice: 20,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: undefined,
        vestingFrequency: undefined,
        createdAt: '2022-01-01',
      } as unknown as RSUPackage;

      const { result } = renderHook(() => 
        usePackageForm('rsu', editingRSU, mockOnSuccess)
      );

      expect(result.current.state.vestingDurationYears).toBe('4');
      expect(result.current.state.vestingFrequency).toBe('quarterly');
    });
  });

  describe('updateField', () => {
    it('should update field value', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'New Name');
      });

      expect(result.current.state.name).toBe('New Name');
    });

    it('should clear errors when updating field', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      // First, trigger validation to get errors
      act(() => {
        result.current.submit();
      });

      expect(Object.keys(result.current.state.errors).length).toBeGreaterThan(0);

      // Update a field
      act(() => {
        result.current.updateField('name', 'New Name');
      });

      expect(result.current.state.errors).toEqual({});
    });
  });

  describe('calculated values', () => {
    it('should calculate vested quantity', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('totalQuantity', '1000');
        result.current.updateField('firstVestingDate', '2022-01-01');
      });

      expect(result.current.vestedQuantity).toBe(500); // 50% mock
    });

    it('should calculate available quantity', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('totalQuantity', '1000');
        result.current.updateField('firstVestingDate', '2022-01-01');
        result.current.updateField('usedQuantity', '200');
      });

      // 500 vested - 200 used = 300 available
      expect(result.current.availableQuantity).toBe(300);
    });

    it('should handle empty vestingDurationYears with default value', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('totalQuantity', '1000');
        result.current.updateField('firstVestingDate', '2022-01-01');
        result.current.updateField('vestingDurationYears', '');
      });

      // Should use default of 4 years in calculation
      expect(result.current.vestedQuantity).toBe(500); // Mock returns 50%
    });
  });

  describe('submit', () => {
    it('should validate and return false on invalid stock option data', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(false);
      expect(mockAddStockOption).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should validate and return false on invalid RSU data', () => {
      const { result } = renderHook(() => 
        usePackageForm('rsu', null, mockOnSuccess)
      );

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(false);
      expect(mockAddRSU).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(Object.keys(result.current.state.errors).length).toBeGreaterThan(0);
    });

    it('should add new stock option on valid submit', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'New Option');
        result.current.updateField('totalQuantity', '1000');
        result.current.updateField('usedQuantity', '0');
        result.current.updateField('exercisePrice', '10');
        result.current.updateField('averagePrice', '15');
        result.current.updateField('firstVestingDate', '2022-01-01');
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockAddStockOption).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should use default values for empty vestingDurationYears in stock option submit', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'New Option');
        result.current.updateField('totalQuantity', '1000');
        result.current.updateField('usedQuantity', '0');
        result.current.updateField('exercisePrice', '10');
        result.current.updateField('averagePrice', '15');
        result.current.updateField('firstVestingDate', '2022-01-01');
        result.current.updateField('vestingDurationYears', ''); // Empty to trigger || 4
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockAddStockOption).toHaveBeenCalledWith(
        expect.objectContaining({
          vestingDurationYears: 4, // Default fallback
        })
      );
    });

    it('should update existing stock option on edit', () => {
      const editingOption: StockOptionPackage = {
        id: 'opt-1',
        name: 'Test Option',
        totalQuantity: 1000,
        vestedQuantity: 500,
        usedQuantity: 100,
        exercisePrice: 10,
        averagePrice: 15,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: 4,
        vestingFrequency: 'quarterly',
        createdAt: '2022-01-01',
      };

      const { result } = renderHook(() => 
        usePackageForm('option', editingOption, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'Updated Option');
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockUpdateStockOption).toHaveBeenCalledWith('opt-1', expect.any(Object));
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should add new RSU on valid submit', () => {
      const { result } = renderHook(() => 
        usePackageForm('rsu', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'New RSU');
        result.current.updateField('totalQuantity', '500');
        result.current.updateField('usedQuantity', '0');
        result.current.updateField('averageVestingPrice', '20');
        result.current.updateField('firstVestingDate', '2022-01-01');
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockAddRSU).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should use default values for empty vestingDurationYears in RSU submit', () => {
      const { result } = renderHook(() => 
        usePackageForm('rsu', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'New RSU');
        result.current.updateField('totalQuantity', '500');
        result.current.updateField('usedQuantity', '0');
        result.current.updateField('averageVestingPrice', '20');
        result.current.updateField('firstVestingDate', '2022-01-01');
        result.current.updateField('vestingDurationYears', ''); // Empty to trigger || 4
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockAddRSU).toHaveBeenCalledWith(
        expect.objectContaining({
          vestingDurationYears: 4, // Default fallback
        })
      );
    });

    it('should update existing RSU on edit', () => {
      const editingRSU: RSUPackage = {
        id: 'rsu-1',
        name: 'Test RSU',
        totalQuantity: 500,
        vestedQuantity: 250,
        usedQuantity: 0,
        averageVestingPrice: 20,
        firstVestingDate: '2022-01-01',
        vestingDurationYears: 4,
        vestingFrequency: 'quarterly',
        createdAt: '2022-01-01',
      };

      const { result } = renderHook(() => 
        usePackageForm('rsu', editingRSU, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'Updated RSU');
      });

      let submitResult: boolean;
      act(() => {
        submitResult = result.current.submit();
      });

      expect(submitResult!).toBe(true);
      expect(mockUpdateRSU).toHaveBeenCalledWith('rsu-1', expect.any(Object));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset form to initial state', () => {
      const { result } = renderHook(() => 
        usePackageForm('option', null, mockOnSuccess)
      );

      act(() => {
        result.current.updateField('name', 'Test Name');
        result.current.updateField('totalQuantity', '1000');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.state.name).toBe('');
      expect(result.current.state.totalQuantity).toBe('');
    });
  });
});
