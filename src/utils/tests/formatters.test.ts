import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatUSD,
  formatNIS,
  formatNumber,
  formatPercentage,
  formatDate,
  parseNumberInput,
  formatInputValue,
  calculateVestedQuantity,
} from '../formatters';

describe('formatters', () => {
  describe('formatUSD', () => {
    it('should format positive amounts correctly', () => {
      expect(formatUSD(1234.56)).toBe('$1,234.56');
    });

    it('should format zero', () => {
      expect(formatUSD(0)).toBe('$0.00');
    });

    it('should format negative amounts', () => {
      expect(formatUSD(-500)).toBe('-$500.00');
    });

    it('should round to 2 decimal places', () => {
      expect(formatUSD(123.456)).toBe('$123.46');
    });
  });

  describe('formatNIS', () => {
    it('should format positive amounts correctly', () => {
      const result = formatNIS(1234);
      expect(result).toContain('1,234');
    });

    it('should format zero', () => {
      const result = formatNIS(0);
      expect(result).toContain('0');
    });

    it('should round to whole numbers', () => {
      const result = formatNIS(1234.56);
      expect(result).toContain('1,235');
    });
  });

  describe('formatNumber', () => {
    it('should format with default decimals (0)', () => {
      expect(formatNumber(1234.56)).toBe('1,235');
    });

    it('should format with specified decimals', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format with default 1 decimal', () => {
      expect(formatPercentage(25.55)).toBe('25.6%');
    });

    it('should format with specified decimals', () => {
      expect(formatPercentage(25.567, 2)).toBe('25.57%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format full datetime string', () => {
      const result = formatDate('2024-06-20T10:30:00');
      expect(result).toContain('Jun');
      expect(result).toContain('20');
      expect(result).toContain('2024');
    });
  });

  describe('parseNumberInput', () => {
    it('should parse plain numbers', () => {
      expect(parseNumberInput('1234.56')).toBe(1234.56);
    });

    it('should remove dollar signs', () => {
      expect(parseNumberInput('$1,234.56')).toBe(1234.56);
    });

    it('should remove shekel signs', () => {
      expect(parseNumberInput('₪1,234')).toBe(1234);
    });

    it('should remove commas', () => {
      expect(parseNumberInput('1,000,000')).toBe(1000000);
    });

    it('should remove spaces', () => {
      expect(parseNumberInput('1 234 567')).toBe(1234567);
    });

    it('should return 0 for invalid input', () => {
      expect(parseNumberInput('abc')).toBe(0);
    });

    it('should return 0 for empty string', () => {
      expect(parseNumberInput('')).toBe(0);
    });
  });

  describe('formatInputValue', () => {
    it('should return empty string for undefined', () => {
      expect(formatInputValue(undefined)).toBe('');
    });

    it('should return empty string for zero', () => {
      expect(formatInputValue(0)).toBe('');
    });

    it('should format value without prefix', () => {
      expect(formatInputValue(1234.56)).toBe('1,234.56');
    });

    it('should format value with prefix', () => {
      expect(formatInputValue(1234.56, '$')).toBe('$1,234.56');
    });
  });

  describe('calculateVestedQuantity', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return 0 for empty date', () => {
      expect(calculateVestedQuantity(1000, '', 4, 'quarterly')).toBe(0);
    });

    it('should return 0 for zero quantity', () => {
      expect(calculateVestedQuantity(0, '2022-01-01', 4, 'quarterly')).toBe(0);
    });

    it('should return 0 for negative quantity', () => {
      expect(calculateVestedQuantity(-100, '2022-01-01', 4, 'quarterly')).toBe(0);
    });

    it('should return 0 for zero duration', () => {
      expect(calculateVestedQuantity(1000, '2022-01-01', 0, 'quarterly')).toBe(0);
    });

    it('should return 0 for future grant date', () => {
      vi.setSystemTime(new Date('2024-01-01'));
      expect(calculateVestedQuantity(1000, '2025-01-01', 4, 'quarterly')).toBe(0);
    });

    it('should calculate quarterly vesting correctly', () => {
      // Set current date to exactly 1 year after grant (365 days)
      vi.setSystemTime(new Date('2023-01-01'));
      const result = calculateVestedQuantity(1000, '2022-01-01', 4, 'quarterly');
      // Days since grant: 365
      // Days per quarter: 365.25 / 4 = 91.3125
      // Completed quarters: floor(365 / 91.3125) = floor(3.99) = 3
      // Vested: round(1000 * 3/16) = round(187.5) = 188
      expect(result).toBe(188);
    });

    it('should calculate monthly vesting correctly', () => {
      vi.setSystemTime(new Date('2023-01-01'));
      const result = calculateVestedQuantity(1200, '2022-01-01', 4, 'monthly');
      // Days since grant: 365
      // Days per month: 365.25 / 12 = 30.4375
      // Completed months: floor(365 / 30.4375) = floor(11.99) = 11
      // Vested: round(1200 * 11/48) = round(275) = 275
      expect(result).toBe(275);
    });

    it('should calculate annual vesting correctly', () => {
      vi.setSystemTime(new Date('2024-01-01'));
      const result = calculateVestedQuantity(1000, '2022-01-01', 4, 'annually');
      // Days since grant: 730 (2 years)
      // Days per year: 365.25
      // Completed years: floor(730 / 365.25) = floor(1.998) = 1
      // Vested: round(1000 * 1/4) = 250
      expect(result).toBe(250);
    });

    it('should cap at total quantity when fully vested', () => {
      vi.setSystemTime(new Date('2030-01-01')); // Well past vesting period
      const result = calculateVestedQuantity(1000, '2022-01-01', 4, 'quarterly');
      expect(result).toBe(1000);
    });

    it('should handle partial periods (round to nearest)', () => {
      // Test a date that results in a fractional share
      vi.setSystemTime(new Date('2022-04-15'));
      const result = calculateVestedQuantity(1000, '2022-01-01', 4, 'quarterly');
      // After ~3.5 months, only 1 full quarter completed = 1/16 = 62.5 -> 63 rounded
      expect(result).toBe(63);
    });
  });
});
