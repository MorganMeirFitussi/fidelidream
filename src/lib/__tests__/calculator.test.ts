import { describe, it, expect } from 'vitest';
import { calculateEquity } from '../calculator';
import type { PersonalInfo, StockOptionPackage, RSUPackage } from '../../types';

describe('calculator', () => {
  const basePersonalInfo: PersonalInfo = {
    stockPrice: 20,
    exchangeRate: 3.5,
    monthlySalary: 25_000, // 300k annual
    creditPoints: 2.25,
  };

  const baseStockOption: StockOptionPackage = {
    id: 'option-1',
    name: 'Option Grant 1',
    totalQuantity: 1000,
    vestedQuantity: 800,
    usedQuantity: 200,
    exercisePrice: 10,
    averagePrice: 10,
    firstVestingDate: '2022-01-01',
    vestingDurationYears: 4,
    vestingFrequency: 'quarterly',
    createdAt: '2022-01-01',
  };

  const baseRSU: RSUPackage = {
    id: 'rsu-1',
    name: 'RSU Grant 1',
    totalQuantity: 500,
    vestedQuantity: 300,
    usedQuantity: 0,
    averageVestingPrice: 15,
    firstVestingDate: '2022-01-01',
    vestingDurationYears: 4,
    vestingFrequency: 'quarterly',
    createdAt: '2022-01-01',
  };

  describe('calculateEquity', () => {
    it('should calculate results for stock options only', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], []);
      
      expect(result.packages).toHaveLength(1);
      expect(result.packages[0].type).toBe('option');
      expect(result.totals.grossValueNIS).toBeGreaterThan(0);
      expect(result.totals.netValueNIS).toBeLessThan(result.totals.grossValueNIS);
    });

    it('should calculate results for RSUs only', () => {
      const result = calculateEquity(basePersonalInfo, [], [baseRSU]);
      
      expect(result.packages).toHaveLength(1);
      expect(result.packages[0].type).toBe('rsu');
      expect(result.totals.grossValueNIS).toBeGreaterThan(0);
    });

    it('should calculate combined results for options and RSUs', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], [baseRSU]);
      
      expect(result.packages).toHaveLength(2);
      expect(result.totals.grossValueNIS).toBeGreaterThan(0);
    });

    it('should include personal info in result', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], []);
      
      expect(result.personalInfo).toEqual(basePersonalInfo);
      expect(result.annualSalary).toBe(basePersonalInfo.monthlySalary * 12);
    });

    it('should calculate marginal tax rate', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], []);
      
      expect(result.marginalTaxRate).toBeGreaterThan(0);
      expect(result.marginalTaxRate).toBeLessThanOrEqual(50);
    });

    it('should calculate tax breakdown', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], [baseRSU]);
      const { taxBreakdown } = result.totals;
      
      expect(taxBreakdown.incomeTax).toBeGreaterThanOrEqual(0);
      expect(taxBreakdown.capitalGainsTax).toBeGreaterThanOrEqual(0);
      expect(taxBreakdown.bituahLeumi).toBeGreaterThanOrEqual(0);
      expect(taxBreakdown.healthInsurance).toBeGreaterThanOrEqual(0);
      expect(taxBreakdown.creditPointsReduction).toBeGreaterThanOrEqual(0);
      expect(taxBreakdown.totalTax).toBeGreaterThanOrEqual(0);
    });

    it('should calculate effective tax rate', () => {
      const result = calculateEquity(basePersonalInfo, [baseStockOption], []);
      
      expect(result.totals.effectiveTaxRate).toBeGreaterThan(0);
      expect(result.totals.effectiveTaxRate).toBeLessThan(100);
    });

    it('should handle capital gain route for options', () => {
      const capitalGainOption: StockOptionPackage = {
        ...baseStockOption,
        exercisePrice: 15,
        averagePrice: 10, // Exercise >= average
      };
      const result = calculateEquity(basePersonalInfo, [capitalGainOption], []);
      
      expect(result.packages[0].route).toBe('capital_gain');
    });

    it('should handle ordinary income route for options', () => {
      const ordinaryIncomeOption: StockOptionPackage = {
        ...baseStockOption,
        exercisePrice: 5,
        averagePrice: 15, // Exercise < average
      };
      const result = calculateEquity(basePersonalInfo, [ordinaryIncomeOption], []);
      
      expect(result.packages[0].route).toBe('ordinary_income');
    });

    it('should handle underwater options', () => {
      const underwaterOption: StockOptionPackage = {
        ...baseStockOption,
        exercisePrice: 25, // Higher than current price (20)
      };
      const result = calculateEquity(basePersonalInfo, [underwaterOption], []);
      
      expect(result.packages[0].isUnderwater).toBe(true);
      expect(result.packages[0].grossValueNIS).toBe(0);
    });

    it('should handle empty packages', () => {
      const result = calculateEquity(basePersonalInfo, [], []);
      
      expect(result.packages).toHaveLength(0);
      expect(result.totals.grossValueNIS).toBe(0);
      expect(result.totals.netValueNIS).toBe(0);
    });

    it('should handle RSUs with usedQuantity', () => {
      const partiallyUsedRSU: RSUPackage = {
        ...baseRSU,
        vestedQuantity: 500,
        usedQuantity: 300, // 200 available
      };
      const result = calculateEquity(basePersonalInfo, [], [partiallyUsedRSU]);
      
      // Should calculate based on available quantity (200)
      expect(result.packages).toHaveLength(1);
      expect(result.totals.grossValueNIS).toBeGreaterThan(0);
    });

    it('should skip RSUs with no available quantity', () => {
      const fullyUsedRSU: RSUPackage = {
        ...baseRSU,
        vestedQuantity: 500,
        usedQuantity: 500, // 0 available
      };
      const result = calculateEquity(basePersonalInfo, [], [fullyUsedRSU]);
      
      expect(result.packages).toHaveLength(0);
    });

    it('should apply credit points reduction', () => {
      const resultWithCredits = calculateEquity(
        { ...basePersonalInfo, creditPoints: 5 },
        [baseStockOption],
        [baseRSU]
      );
      const resultWithoutCredits = calculateEquity(
        { ...basePersonalInfo, creditPoints: 0 },
        [baseStockOption],
        [baseRSU]
      );
      
      expect(resultWithCredits.totals.taxBreakdown.totalTax).toBeLessThan(
        resultWithoutCredits.totals.taxBreakdown.totalTax
      );
    });

    it('should handle multiple packages', () => {
      const option2: StockOptionPackage = {
        ...baseStockOption,
        id: 'option-2',
        name: 'Option Grant 2',
      };
      const rsu2: RSUPackage = {
        ...baseRSU,
        id: 'rsu-2',
        name: 'RSU Grant 2',
      };
      
      const result = calculateEquity(
        basePersonalInfo,
        [baseStockOption, option2],
        [baseRSU, rsu2]
      );
      
      expect(result.packages).toHaveLength(4);
    });

    it('should fallback to totalQuantity if vestedQuantity is undefined', () => {
      const optionWithoutVested: StockOptionPackage = {
        ...baseStockOption,
        vestedQuantity: undefined as unknown as number, // Simulate missing field
      };
      
      // This should not throw and should use totalQuantity
      const result = calculateEquity(basePersonalInfo, [optionWithoutVested], []);
      expect(result.packages).toHaveLength(1);
    });
  });
});
