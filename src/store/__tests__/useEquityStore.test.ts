import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useEquityStore } from '../useEquityStore';
import { DEFAULTS } from '../../lib/constants';

// Helper to create a stock option with required fields
const createStockOption = (overrides = {}) => ({
  name: 'Grant 1',
  totalQuantity: 1000,
  vestedQuantity: 500,
  usedQuantity: 0,
  exercisePrice: 10,
  averagePrice: 15,
  firstVestingDate: '2022-01-01',
  vestingDurationYears: 4,
  vestingFrequency: 'quarterly' as const,
  ...overrides,
});

// Helper to create an RSU with required fields
const createRSU = (overrides = {}) => ({
  name: 'RSU Grant 1',
  totalQuantity: 500,
  vestedQuantity: 250,
  usedQuantity: 0,
  averageVestingPrice: 15,
  firstVestingDate: '2022-01-01',
  vestingDurationYears: 4,
  vestingFrequency: 'quarterly' as const,
  ...overrides,
});

describe('useEquityStore', () => {
  beforeEach(() => {
    act(() => {
      useEquityStore.getState().clearAll();
    });
  });

  describe('initial state', () => {
    it('should have default personal info', () => {
      const state = useEquityStore.getState();
      expect(state.personalInfo.monthlySalary).toBe(0);
      expect(state.personalInfo.creditPoints).toBe(DEFAULTS.creditPoints);
      expect(state.personalInfo.exchangeRate).toBe(DEFAULTS.exchangeRate);
      expect(state.personalInfo.stockPrice).toBe(0);
    });

    it('should have empty stock options', () => {
      expect(useEquityStore.getState().stockOptions).toEqual([]);
    });

    it('should have empty RSUs', () => {
      expect(useEquityStore.getState().rsus).toEqual([]);
    });

    it('should have null calculation result', () => {
      expect(useEquityStore.getState().calculationResult).toBeNull();
    });
  });

  describe('updatePersonalInfo', () => {
    it('should update personal info fields', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({
          monthlySalary: 25000,
          stockPrice: 20,
        });
      });
      const state = useEquityStore.getState();
      expect(state.personalInfo.monthlySalary).toBe(25000);
      expect(state.personalInfo.stockPrice).toBe(20);
    });

    it('should preserve existing fields when updating', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({ monthlySalary: 25000 });
      });
      const state = useEquityStore.getState();
      expect(state.personalInfo.creditPoints).toBe(DEFAULTS.creditPoints);
      expect(state.personalInfo.exchangeRate).toBe(DEFAULTS.exchangeRate);
    });

    it('should clear calculation result when updating', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({ stockPrice: 20, monthlySalary: 25000, exchangeRate: 3.5 });
        useEquityStore.getState().addStockOption(createStockOption());
        useEquityStore.getState().calculate();
      });
      expect(useEquityStore.getState().calculationResult).not.toBeNull();

      act(() => {
        useEquityStore.getState().updatePersonalInfo({ monthlySalary: 30000 });
      });
      expect(useEquityStore.getState().calculationResult).toBeNull();
    });
  });

  describe('stock options', () => {
    it('should add a stock option', () => {
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption());
      });
      const state = useEquityStore.getState();
      expect(state.stockOptions).toHaveLength(1);
      expect(state.stockOptions[0].name).toBe('Grant 1');
      expect(state.stockOptions[0].id).toBeDefined();
      expect(state.stockOptions[0].createdAt).toBeDefined();
    });

    it('should update a stock option', () => {
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption());
      });
      const id = useEquityStore.getState().stockOptions[0].id;
      act(() => {
        useEquityStore.getState().updateStockOption(id, { name: 'Updated Grant' });
      });
      const state = useEquityStore.getState();
      expect(state.stockOptions[0].name).toBe('Updated Grant');
      expect(state.stockOptions[0].totalQuantity).toBe(1000);
    });

    it('should update only the matching stock option when multiple exist', () => {
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption({ name: 'Grant 1' }));
      });
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption({ name: 'Grant 2', totalQuantity: 500 }));
      });
      const options = useEquityStore.getState().stockOptions;
      expect(options).toHaveLength(2);
      const id = options[0].id;

      act(() => {
        useEquityStore.getState().updateStockOption(id, { name: 'Updated Grant 1' });
      });
      const state = useEquityStore.getState();
      expect(state.stockOptions[0].name).toBe('Updated Grant 1');
      expect(state.stockOptions[1].name).toBe('Grant 2');
    });

    it('should delete a stock option', () => {
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption());
      });
      const id = useEquityStore.getState().stockOptions[0].id;
      act(() => {
        useEquityStore.getState().deleteStockOption(id);
      });
      expect(useEquityStore.getState().stockOptions).toHaveLength(0);
    });

    it('should delete only the matching stock option when multiple exist', () => {
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption({ name: 'Grant 1' }));
      });
      act(() => {
        useEquityStore.getState().addStockOption(createStockOption({ name: 'Grant 2' }));
      });
      const options = useEquityStore.getState().stockOptions;
      expect(options).toHaveLength(2);
      const id = options[0].id;

      act(() => {
        useEquityStore.getState().deleteStockOption(id);
      });
      const state = useEquityStore.getState();
      expect(state.stockOptions).toHaveLength(1);
      expect(state.stockOptions[0].name).toBe('Grant 2');
    });

    it('should clear calculation result when adding', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({ stockPrice: 20, monthlySalary: 25000, exchangeRate: 3.5 });
        useEquityStore.getState().addStockOption(createStockOption());
        useEquityStore.getState().calculate();
      });
      expect(useEquityStore.getState().calculationResult).not.toBeNull();

      act(() => {
        useEquityStore.getState().addStockOption(createStockOption({ name: 'Grant 2' }));
      });
      expect(useEquityStore.getState().calculationResult).toBeNull();
    });
  });

  describe('RSUs', () => {
    it('should add an RSU', () => {
      act(() => {
        useEquityStore.getState().addRSU(createRSU());
      });
      const state = useEquityStore.getState();
      expect(state.rsus).toHaveLength(1);
      expect(state.rsus[0].name).toBe('RSU Grant 1');
      expect(state.rsus[0].id).toBeDefined();
      expect(state.rsus[0].createdAt).toBeDefined();
    });

    it('should update an RSU', () => {
      act(() => {
        useEquityStore.getState().addRSU(createRSU());
      });
      const id = useEquityStore.getState().rsus[0].id;
      act(() => {
        useEquityStore.getState().updateRSU(id, { name: 'Updated RSU' });
      });
      const state = useEquityStore.getState();
      expect(state.rsus[0].name).toBe('Updated RSU');
      expect(state.rsus[0].totalQuantity).toBe(500);
    });

    it('should update only the matching RSU when multiple exist', () => {
      act(() => {
        useEquityStore.getState().addRSU(createRSU({ name: 'RSU Grant 1' }));
      });
      act(() => {
        useEquityStore.getState().addRSU(createRSU({ name: 'RSU Grant 2' }));
      });
      const rsus = useEquityStore.getState().rsus;
      expect(rsus).toHaveLength(2);
      const id = rsus[0].id;

      act(() => {
        useEquityStore.getState().updateRSU(id, { name: 'Updated RSU 1' });
      });
      const state = useEquityStore.getState();
      expect(state.rsus[0].name).toBe('Updated RSU 1');
      expect(state.rsus[1].name).toBe('RSU Grant 2');
    });

    it('should delete an RSU', () => {
      act(() => {
        useEquityStore.getState().addRSU(createRSU());
      });
      const id = useEquityStore.getState().rsus[0].id;
      act(() => {
        useEquityStore.getState().deleteRSU(id);
      });
      expect(useEquityStore.getState().rsus).toHaveLength(0);
    });

    it('should delete only the matching RSU when multiple exist', () => {
      act(() => {
        useEquityStore.getState().addRSU(createRSU({ name: 'RSU Grant 1' }));
      });
      act(() => {
        useEquityStore.getState().addRSU(createRSU({ name: 'RSU Grant 2' }));
      });
      const rsus = useEquityStore.getState().rsus;
      expect(rsus).toHaveLength(2);
      const id = rsus[0].id;

      act(() => {
        useEquityStore.getState().deleteRSU(id);
      });
      const state = useEquityStore.getState();
      expect(state.rsus).toHaveLength(1);
      expect(state.rsus[0].name).toBe('RSU Grant 2');
    });
  });

  describe('calculate', () => {
    it('should calculate and store result', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({
          stockPrice: 20,
          monthlySalary: 25000,
          exchangeRate: 3.5,
          creditPoints: 2.25,
        });
        useEquityStore.getState().addStockOption(createStockOption());
        useEquityStore.getState().calculate();
      });
      const state = useEquityStore.getState();
      expect(state.calculationResult).not.toBeNull();
      expect(state.calculationResult?.packages).toHaveLength(1);
      expect(state.calculationResult?.totals.grossValueNIS).toBeGreaterThan(0);
    });

    it('should handle empty packages', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({
          stockPrice: 20,
          monthlySalary: 25000,
          exchangeRate: 3.5,
        });
        useEquityStore.getState().calculate();
      });
      const state = useEquityStore.getState();
      expect(state.calculationResult).not.toBeNull();
      expect(state.calculationResult?.packages).toHaveLength(0);
    });
  });

  describe('clearResult', () => {
    it('should clear calculation result', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({ stockPrice: 20, monthlySalary: 25000, exchangeRate: 3.5 });
        useEquityStore.getState().addStockOption(createStockOption());
        useEquityStore.getState().calculate();
      });
      expect(useEquityStore.getState().calculationResult).not.toBeNull();

      act(() => {
        useEquityStore.getState().clearResult();
      });
      expect(useEquityStore.getState().calculationResult).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should reset all state to initial values', () => {
      act(() => {
        useEquityStore.getState().updatePersonalInfo({ stockPrice: 20, monthlySalary: 25000 });
        useEquityStore.getState().addStockOption(createStockOption());
        useEquityStore.getState().addRSU(createRSU());
        useEquityStore.getState().calculate();
      });

      act(() => {
        useEquityStore.getState().clearAll();
      });

      const state = useEquityStore.getState();
      expect(state.personalInfo.monthlySalary).toBe(0);
      expect(state.personalInfo.stockPrice).toBe(0);
      expect(state.stockOptions).toHaveLength(0);
      expect(state.rsus).toHaveLength(0);
      expect(state.calculationResult).toBeNull();
    });
  });
});
