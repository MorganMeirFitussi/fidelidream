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

    describe('with simulation parameters', () => {
      it('should use simulation stock price', () => {
        const resultNoSim = calculateEquity(basePersonalInfo, [baseStockOption], []);
        const resultWithSim = calculateEquity(basePersonalInfo, [baseStockOption], [], {
          targetDate: '2025-01-01',
          stockPrice: 40, // Double the current price
        });
        
        // Higher stock price should result in higher gross value
        expect(resultWithSim.totals.grossValueNIS).toBeGreaterThan(resultNoSim.totals.grossValueNIS);
        // Personal info should reflect simulation values
        expect(resultWithSim.personalInfo.stockPrice).toBe(40);
      });

      it('should use simulation exchange rate when provided', () => {
        const resultWithSim = calculateEquity(basePersonalInfo, [baseStockOption], [], {
          targetDate: '2025-01-01',
          stockPrice: 20,
          exchangeRate: 4.0, // Higher exchange rate
        });
        
        expect(resultWithSim.personalInfo.exchangeRate).toBe(4.0);
      });

      it('should keep original exchange rate when not provided in simulation', () => {
        const resultWithSim = calculateEquity(basePersonalInfo, [baseStockOption], [], {
          targetDate: '2025-01-01',
          stockPrice: 20,
        });
        
        expect(resultWithSim.personalInfo.exchangeRate).toBe(basePersonalInfo.exchangeRate);
      });

      it('should recalculate vested quantities for future date', () => {
        // Create an option that is partially vested today
        const recentOption: StockOptionPackage = {
          ...baseStockOption,
          totalQuantity: 1000,
          vestedQuantity: 100, // Currently vested
          usedQuantity: 0,
          firstVestingDate: '2024-01-01',
          vestingDurationYears: 4,
          vestingFrequency: 'quarterly',
        };
        
        const resultNoSim = calculateEquity(basePersonalInfo, [recentOption], []);
        const resultWithSim = calculateEquity(basePersonalInfo, [recentOption], [], {
          targetDate: '2028-01-01', // 4 years after grant - fully vested
          stockPrice: 20,
        });
        
        // Future date should have more vested (up to 1000)
        expect(resultWithSim.totals.grossValueNIS).toBeGreaterThan(resultNoSim.totals.grossValueNIS);
      });

      it('should recalculate RSU vested quantities for future date', () => {
        const recentRSU: RSUPackage = {
          ...baseRSU,
          totalQuantity: 1000,
          vestedQuantity: 100, // Currently vested
          usedQuantity: 0,
          firstVestingDate: '2024-01-01',
          vestingDurationYears: 4,
          vestingFrequency: 'quarterly',
        };
        
        const resultNoSim = calculateEquity(basePersonalInfo, [], [recentRSU]);
        const resultWithSim = calculateEquity(basePersonalInfo, [], [recentRSU], {
          targetDate: '2028-01-01', // 4 years after grant
          stockPrice: 20,
        });
        
        // Future date should have more vested
        expect(resultWithSim.totals.grossValueNIS).toBeGreaterThan(resultNoSim.totals.grossValueNIS);
      });

      it('should use default vesting duration and frequency for options when missing', () => {
        const optionWithMissingVesting: StockOptionPackage = {
          ...baseStockOption,
          vestingDurationYears: undefined as unknown as number,
          vestingFrequency: undefined as unknown as 'quarterly',
          firstVestingDate: '2020-01-01', // Old date so plenty is vested
        };
        
        const result = calculateEquity(basePersonalInfo, [optionWithMissingVesting], [], {
          targetDate: '2025-01-01',
          stockPrice: 20,
        });
        
        // Should not crash and should calculate some value
        expect(result.packages).toHaveLength(1);
      });

      it('should use default vesting duration and frequency for RSUs when missing', () => {
        const rsuWithMissingVesting: RSUPackage = {
          ...baseRSU,
          vestingDurationYears: undefined as unknown as number,
          vestingFrequency: undefined as unknown as 'quarterly',
          firstVestingDate: '2020-01-01', // Old date so plenty is vested
        };
        
        const result = calculateEquity(basePersonalInfo, [], [rsuWithMissingVesting], {
          targetDate: '2025-01-01',
          stockPrice: 20,
        });
        
        // Should not crash and should calculate some value
        expect(result.packages).toHaveLength(1);
      });
    });
  });
});
