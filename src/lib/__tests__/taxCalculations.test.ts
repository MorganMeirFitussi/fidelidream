import { describe, it, expect } from 'vitest';
import {
  calculateProgressiveTax,
  getMarginalTaxRate,
  calculateCreditPointsValue,
  applyCreditPoints,
  calculateEquityIncomeTax,
  calculateBituahLeumi,
  calculateHealthInsurance,
  calculateCapitalGainsTax,
  getEffectiveCapitalGainsRate,
} from '../taxCalculations';
import { CREDIT_POINT_VALUE, TAX_BRACKETS, BITUAH_LEUMI, CAPITAL_GAINS } from '../constants';

describe('taxCalculations', () => {
  describe('calculateProgressiveTax', () => {
    it('should return 0 for zero income', () => {
      expect(calculateProgressiveTax(0)).toBe(0);
    });

    it('should return 0 for negative income', () => {
      expect(calculateProgressiveTax(-1000)).toBe(0);
    });

    it('should calculate tax in first bracket (10%)', () => {
      const income = 50_000;
      expect(calculateProgressiveTax(income)).toBe(income * 0.10);
    });

    it('should calculate tax across multiple brackets', () => {
      const income = 100_000;
      // First bracket: 83,880 * 0.10 = 8,388
      // Second bracket: (100,000 - 83,880) * 0.14 = 16,120 * 0.14 = 2,256.8
      const expectedTax = 83_880 * 0.10 + (100_000 - 83_880) * 0.14;
      expect(calculateProgressiveTax(income)).toBeCloseTo(expectedTax, 2);
    });

    it('should calculate tax for very high income', () => {
      const income = 1_000_000;
      const tax = calculateProgressiveTax(income);
      expect(tax).toBeGreaterThan(0);
      // Verify the calculation goes through all brackets
      expect(tax).toBeLessThan(income * 0.50); // Max rate is 50%
    });
  });

  describe('getMarginalTaxRate', () => {
    it('should return first bracket rate for zero income', () => {
      expect(getMarginalTaxRate(0)).toBe(TAX_BRACKETS[0].rate);
    });

    it('should return first bracket rate for negative income', () => {
      expect(getMarginalTaxRate(-1000)).toBe(TAX_BRACKETS[0].rate);
    });

    it('should return 10% for income in first bracket', () => {
      expect(getMarginalTaxRate(50_000)).toBe(0.10);
    });

    it('should return 14% for income in second bracket', () => {
      expect(getMarginalTaxRate(100_000)).toBe(0.14);
    });

    it('should return 50% for very high income', () => {
      expect(getMarginalTaxRate(1_000_000)).toBe(0.50);
    });
  });

  describe('calculateCreditPointsValue', () => {
    it('should calculate correct value for default credit points', () => {
      expect(calculateCreditPointsValue(2.25)).toBe(2.25 * CREDIT_POINT_VALUE);
    });

    it('should return 0 for 0 credit points', () => {
      expect(calculateCreditPointsValue(0)).toBe(0);
    });
  });

  describe('applyCreditPoints', () => {
    it('should reduce tax by credit value', () => {
      const tax = 10_000;
      const creditPoints = 2.25;
      const result = applyCreditPoints(tax, creditPoints);
      expect(result.finalTax).toBe(tax - 2.25 * CREDIT_POINT_VALUE);
      expect(result.creditUsed).toBe(2.25 * CREDIT_POINT_VALUE);
    });

    it('should not go below zero', () => {
      const tax = 1_000;
      const creditPoints = 10; // More than enough to cover tax
      const result = applyCreditPoints(tax, creditPoints);
      expect(result.finalTax).toBe(0);
      expect(result.creditUsed).toBe(tax);
    });
  });

  describe('calculateEquityIncomeTax', () => {
    it('should return 0 for zero work income', () => {
      const result = calculateEquityIncomeTax(0, 100_000, 2.25);
      expect(result.incomeTax).toBe(0);
      expect(result.creditPointsReduction).toBe(0);
    });

    it('should return 0 for negative work income', () => {
      const result = calculateEquityIncomeTax(-1000, 100_000, 2.25);
      expect(result.incomeTax).toBe(0);
      expect(result.creditPointsReduction).toBe(0);
    });

    it('should calculate equity tax correctly', () => {
      const workIncome = 100_000;
      const salary = 200_000;
      const result = calculateEquityIncomeTax(workIncome, salary, 2.25);
      expect(result.incomeTax).toBeGreaterThanOrEqual(0);
    });

    it('should apply credit points to reduce equity tax', () => {
      const workIncome = 50_000;
      const salary = 50_000;
      const resultWithCredits = calculateEquityIncomeTax(workIncome, salary, 5);
      const resultWithoutCredits = calculateEquityIncomeTax(workIncome, salary, 0);
      expect(resultWithCredits.incomeTax).toBeLessThanOrEqual(resultWithoutCredits.incomeTax);
    });
  });

  describe('calculateBituahLeumi', () => {
    it('should return 0 for zero work income', () => {
      expect(calculateBituahLeumi(0)).toBe(0);
    });

    it('should return 0 for negative work income', () => {
      expect(calculateBituahLeumi(-1000)).toBe(0);
    });

    it('should calculate 7% of work income', () => {
      const workIncome = 100_000;
      expect(calculateBituahLeumi(workIncome, 0)).toBe(workIncome * 0.07);
    });

    it('should respect ceiling when salary uses part of it', () => {
      const salary = 500_000; // Uses 500k of 560,280 ceiling
      const workIncome = 100_000;
      const remainingCeiling = BITUAH_LEUMI.ceiling - salary;
      const expected = remainingCeiling * BITUAH_LEUMI.generalRate;
      expect(calculateBituahLeumi(workIncome, salary)).toBeCloseTo(expected, 2);
    });

    it('should return 0 when salary exceeds ceiling', () => {
      const salary = 600_000; // Exceeds ceiling
      const workIncome = 100_000;
      expect(calculateBituahLeumi(workIncome, salary)).toBe(0);
    });
  });

  describe('calculateHealthInsurance', () => {
    it('should return 0 for zero work income', () => {
      expect(calculateHealthInsurance(0)).toBe(0);
    });

    it('should return 0 for negative work income', () => {
      expect(calculateHealthInsurance(-1000)).toBe(0);
    });

    it('should calculate 5% of work income', () => {
      const workIncome = 100_000;
      expect(calculateHealthInsurance(workIncome)).toBe(workIncome * BITUAH_LEUMI.healthRate);
    });
  });

  describe('calculateCapitalGainsTax', () => {
    it('should return 0 for zero capital gain', () => {
      const result = calculateCapitalGainsTax(0);
      expect(result.baseTax).toBe(0);
      expect(result.surtax).toBe(0);
      expect(result.totalTax).toBe(0);
    });

    it('should return 0 for negative capital gain', () => {
      const result = calculateCapitalGainsTax(-1000);
      expect(result.baseTax).toBe(0);
      expect(result.surtax).toBe(0);
      expect(result.totalTax).toBe(0);
    });

    it('should calculate 25% base tax', () => {
      const gain = 100_000;
      const result = calculateCapitalGainsTax(gain);
      expect(result.baseTax).toBe(gain * 0.25);
    });

    it('should not apply surtax below threshold', () => {
      const gain = 500_000; // Below 721,560 threshold
      const result = calculateCapitalGainsTax(gain);
      expect(result.surtax).toBe(0);
    });

    it('should apply surtax above threshold', () => {
      const totalGains = 1_000_000;
      const result = calculateCapitalGainsTax(totalGains, totalGains);
      const gainAboveThreshold = totalGains - CAPITAL_GAINS.surtaxThreshold;
      expect(result.surtax).toBeCloseTo(gainAboveThreshold * 0.05, 2);
    });
  });

  describe('getEffectiveCapitalGainsRate', () => {
    it('should return 30%', () => {
      expect(getEffectiveCapitalGainsRate()).toBe(0.30);
    });
  });
});
