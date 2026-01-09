import { describe, it, expect } from 'vitest';
import {
  detectTaxRoute,
  getAvailableQuantity,
  calculateStockOptionResult,
} from '../optionsCalculations';
import type { StockOptionPackage } from '../../types';

describe('optionsCalculations', () => {
  describe('detectTaxRoute', () => {
    it('should return capital_gain when exercisePrice >= averagePrice', () => {
      expect(detectTaxRoute(10, 10)).toBe('capital_gain');
      expect(detectTaxRoute(15, 10)).toBe('capital_gain');
    });

    it('should return ordinary_income when exercisePrice < averagePrice', () => {
      expect(detectTaxRoute(5, 10)).toBe('ordinary_income');
    });
  });

  describe('getAvailableQuantity', () => {
    it('should return difference between vested and used', () => {
      expect(getAvailableQuantity(1000, 200)).toBe(800);
    });

    it('should return 0 when used exceeds vested', () => {
      expect(getAvailableQuantity(100, 200)).toBe(0);
    });

    it('should return 0 when vested equals used', () => {
      expect(getAvailableQuantity(100, 100)).toBe(0);
    });
  });

  describe('calculateStockOptionResult', () => {
    const baseOption: StockOptionPackage = {
      id: 'test-option-1',
      name: 'Test Option',
      totalQuantity: 1000,
      vestedQuantity: 800,
      usedQuantity: 200,
      exercisePrice: 10,
      averagePrice: 10, // Capital gain route
      firstVestingDate: '2022-01-01',
      vestingDurationYears: 4,
      vestingFrequency: 'quarterly',
      createdAt: '2022-01-01',
    };

    it('should calculate gross value correctly', () => {
      const result = calculateStockOptionResult(baseOption, 20, 3.5, 300_000, 2.25);
      // Available: totalQuantity - usedQuantity = 1000 - 200 = 800
      // Gross profit per share: 20 - 10 = 10 USD
      // Gross USD: 800 * 10 = 8000 USD
      // Gross NIS: 8000 * 3.5 = 28000 NIS
      expect(result.grossValueUSD).toBe(8000);
      expect(result.grossValueNIS).toBe(28000);
    });

    it('should handle capital gain route (exercisePrice >= averagePrice)', () => {
      const result = calculateStockOptionResult(baseOption, 20, 3.5, 300_000, 2.25);
      expect(result.route).toBe('capital_gain');
      expect(result.workIncomeNIS).toBe(0);
      // Capital gain = gross value = 28000 NIS
      expect(result.capitalGainNIS).toBe(28000);
    });

    it('should handle ordinary income route (exercisePrice < averagePrice)', () => {
      const ordinaryIncomeOption: StockOptionPackage = {
        ...baseOption,
        exercisePrice: 5,
        averagePrice: 15,
      };
      const result = calculateStockOptionResult(ordinaryIncomeOption, 20, 3.5, 300_000, 2.25);
      expect(result.route).toBe('ordinary_income');
      // Available: 1000 - 200 = 800
      // Work income: (15 - 5) * 800 * 3.5 = 28000 NIS
      expect(result.workIncomeNIS).toBe(28000);
      // Capital gain: (20 - 15) * 800 * 3.5 = 14000 NIS
      expect(result.capitalGainNIS).toBe(14000);
    });

    it('should calculate taxes for capital gain route', () => {
      const result = calculateStockOptionResult(baseOption, 20, 3.5, 300_000, 2.25);
      expect(result.taxBreakdown.incomeTax).toBe(0);
      expect(result.taxBreakdown.bituahLeumi).toBe(0);
      expect(result.taxBreakdown.healthInsurance).toBe(0);
      expect(result.taxBreakdown.capitalGainsTax).toBeGreaterThan(0);
    });

    it('should calculate net value correctly', () => {
      const result = calculateStockOptionResult(baseOption, 20, 3.5, 300_000, 2.25);
      expect(result.netValueNIS).toBe(result.grossValueNIS - result.taxBreakdown.totalTax);
      expect(result.netValueUSD).toBeCloseTo(result.netValueNIS / 3.5, 2);
    });

    it('should return correct package metadata', () => {
      const result = calculateStockOptionResult(baseOption, 20, 3.5, 300_000, 2.25);
      expect(result.id).toBe('test-option-1');
      expect(result.name).toBe('Test Option');
      expect(result.type).toBe('option');
    });

    it('should handle zero profit scenario', () => {
      const result = calculateStockOptionResult(baseOption, 10, 3.5, 300_000, 2.25);
      expect(result.grossValueUSD).toBe(0);
      expect(result.grossValueNIS).toBe(0);
      expect(result.netValueUSD).toBe(0);
    });

    it('should handle underwater options (stock price < exercise price)', () => {
      const result = calculateStockOptionResult(baseOption, 5, 3.5, 300_000, 2.25);
      expect(result.grossValueUSD).toBe(0);
      expect(result.grossValueNIS).toBe(0);
    });

    it('should handle ordinary income route with no capital gain (stock price <= average price)', () => {
      const ordinaryIncomeOption: StockOptionPackage = {
        ...baseOption,
        exercisePrice: 5,
        averagePrice: 25, // Average is higher than current stock price (20)
      };
      const result = calculateStockOptionResult(ordinaryIncomeOption, 20, 3.5, 300_000, 2.25);
      expect(result.route).toBe('ordinary_income');
      // Work income: (25 - 5) * 800 * 3.5 = 56000 NIS
      expect(result.workIncomeNIS).toBe(56000);
      // Capital gain: (20 - 25) = negative, so 0
      expect(result.capitalGainNIS).toBe(0);
      expect(result.taxBreakdown.capitalGainsTax).toBe(0);
    });
  });
});
