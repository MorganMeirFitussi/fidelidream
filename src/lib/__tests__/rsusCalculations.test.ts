import { describe, it, expect } from 'vitest';
import { calculateRSUResult } from '../rsusCalculations';
import type { RSUPackage } from '../../types';

describe('rsusCalculations', () => {
  describe('calculateRSUResult', () => {
    const baseRSU: RSUPackage = {
      id: 'test-rsu-1',
      name: 'Test RSU',
      totalQuantity: 1000,
      vestedQuantity: 500,
      usedQuantity: 0,
      averageVestingPrice: 10,
      firstVestingDate: '2022-01-01',
      vestingDurationYears: 4,
      vestingFrequency: 'quarterly',
      createdAt: '2022-01-01',
    };

    it('should calculate gross value correctly', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      // Gross: 500 vested * 20 USD = 10000 USD
      // Gross NIS: 10000 * 3.5 = 35000 NIS
      expect(result.grossValueUSD).toBe(10000);
      expect(result.grossValueNIS).toBe(35000);
    });

    it('should calculate work income correctly', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      // Work income: vesting price * qty = 10 * 500 * 3.5 = 17500 NIS
      expect(result.workIncomeNIS).toBe(17500);
    });

    it('should calculate capital gain correctly', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      // Capital gain: (20 - 10) * 500 * 3.5 = 17500 NIS
      expect(result.capitalGainNIS).toBe(17500);
    });

    it('should handle capital loss (current price < vesting price)', () => {
      const result = calculateRSUResult(baseRSU, 5, 3.5, 300_000, 2.25);
      // Capital gain should be 0 (not negative)
      expect(result.capitalGainNIS).toBe(0);
    });

    it('should calculate income tax on work income', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      expect(result.taxBreakdown.incomeTax).toBeGreaterThan(0);
    });

    it('should calculate Bituah Leumi on work income', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 100_000, 2.25);
      expect(result.taxBreakdown.bituahLeumi).toBeGreaterThan(0);
    });

    it('should calculate Health Insurance on work income', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      expect(result.taxBreakdown.healthInsurance).toBeGreaterThan(0);
    });

    it('should calculate capital gains tax on appreciation', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      expect(result.taxBreakdown.capitalGainsTax).toBeGreaterThan(0);
    });

    it('should calculate net value correctly', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      expect(result.netValueNIS).toBe(result.grossValueNIS - result.taxBreakdown.totalTax);
      expect(result.netValueUSD).toBeCloseTo(result.netValueNIS / 3.5, 2);
    });

    it('should return correct package metadata', () => {
      const result = calculateRSUResult(baseRSU, 20, 3.5, 300_000, 2.25);
      expect(result.id).toBe('test-rsu-1');
      expect(result.name).toBe('Test RSU');
      expect(result.type).toBe('rsu');
    });

    it('should handle zero vested quantity', () => {
      const zeroVestedRSU: RSUPackage = { ...baseRSU, vestedQuantity: 0 };
      const result = calculateRSUResult(zeroVestedRSU, 20, 3.5, 300_000, 2.25);
      expect(result.grossValueUSD).toBe(0);
      expect(result.grossValueNIS).toBe(0);
    });

    it('should apply credit points to reduce tax', () => {
      const resultWithCredits = calculateRSUResult(baseRSU, 20, 3.5, 100_000, 5);
      const resultWithoutCredits = calculateRSUResult(baseRSU, 20, 3.5, 100_000, 0);
      expect(resultWithCredits.taxBreakdown.totalTax).toBeLessThanOrEqual(
        resultWithoutCredits.taxBreakdown.totalTax
      );
    });
  });
});
