import { describe, it, expect } from 'vitest';
import {
  TAX_BRACKETS,
  CREDIT_POINT_VALUE,
  BITUAH_LEUMI,
  CAPITAL_GAINS,
  DEFAULTS,
} from '../constants';

describe('constants', () => {
  describe('TAX_BRACKETS', () => {
    it('should have 7 tax brackets', () => {
      expect(TAX_BRACKETS).toHaveLength(7);
    });

    it('should have ascending ceilings', () => {
      for (let i = 1; i < TAX_BRACKETS.length; i++) {
        expect(TAX_BRACKETS[i].floor).toBeGreaterThanOrEqual(TAX_BRACKETS[i - 1].ceiling);
      }
    });

    it('should have ascending rates', () => {
      for (let i = 1; i < TAX_BRACKETS.length; i++) {
        expect(TAX_BRACKETS[i].rate).toBeGreaterThan(TAX_BRACKETS[i - 1].rate);
      }
    });

    it('should start at 0 and end at Infinity', () => {
      expect(TAX_BRACKETS[0].floor).toBe(0);
      expect(TAX_BRACKETS[TAX_BRACKETS.length - 1].ceiling).toBe(Infinity);
    });

    it('should have first bracket at 10%', () => {
      expect(TAX_BRACKETS[0].rate).toBe(0.10);
    });

    it('should have last bracket at 50%', () => {
      expect(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate).toBe(0.50);
    });
  });

  describe('CREDIT_POINT_VALUE', () => {
    it('should be 2784 NIS', () => {
      expect(CREDIT_POINT_VALUE).toBe(2784);
    });
  });

  describe('BITUAH_LEUMI', () => {
    it('should have general rate of 7%', () => {
      expect(BITUAH_LEUMI.generalRate).toBe(0.07);
    });

    it('should have health rate of 5%', () => {
      expect(BITUAH_LEUMI.healthRate).toBe(0.05);
    });

    it('should have ceiling of 560,280 NIS', () => {
      expect(BITUAH_LEUMI.ceiling).toBe(560_280);
    });
  });

  describe('CAPITAL_GAINS', () => {
    it('should have base rate of 25%', () => {
      expect(CAPITAL_GAINS.baseRate).toBe(0.25);
    });

    it('should have surtax rate of 5%', () => {
      expect(CAPITAL_GAINS.surtaxRate).toBe(0.05);
    });

    it('should have effective rate of 30%', () => {
      expect(CAPITAL_GAINS.effectiveRate).toBe(0.30);
    });

    it('should have surtax threshold of 721,560 NIS', () => {
      expect(CAPITAL_GAINS.surtaxThreshold).toBe(721_560);
    });
  });

  describe('DEFAULTS', () => {
    it('should have default credit points of 2.25', () => {
      expect(DEFAULTS.creditPoints).toBe(2.25);
    });

    it('should have default exchange rate of 3.20', () => {
      expect(DEFAULTS.exchangeRate).toBe(3.20);
    });
  });
});
