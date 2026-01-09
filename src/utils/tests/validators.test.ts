import { describe, it, expect } from 'vitest';
import {
  personalInfoSchema,
  stockOptionSchema,
  rsuSchema,
  validatePersonalInfo,
  validateStockOption,
  validateRSU,
  getErrorMessages,
} from '../validators';
import { z } from 'zod';

describe('validators', () => {
  describe('personalInfoSchema', () => {
    it('should validate correct personal info', () => {
      const validData = {
        monthlySalary: 25000,
        creditPoints: 2.25,
        exchangeRate: 3.5,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative monthly salary', () => {
      const invalidData = {
        monthlySalary: -1000,
        creditPoints: 2.25,
        exchangeRate: 3.5,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject credit points below 0', () => {
      const invalidData = {
        monthlySalary: 25000,
        creditPoints: -1,
        exchangeRate: 3.5,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject credit points above 20', () => {
      const invalidData = {
        monthlySalary: 25000,
        creditPoints: 25,
        exchangeRate: 3.5,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject exchange rate below 1', () => {
      const invalidData = {
        monthlySalary: 25000,
        creditPoints: 2.25,
        exchangeRate: 0.5,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject exchange rate above 10', () => {
      const invalidData = {
        monthlySalary: 25000,
        creditPoints: 2.25,
        exchangeRate: 15,
        stockPrice: 20,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject zero stock price', () => {
      const invalidData = {
        monthlySalary: 25000,
        creditPoints: 2.25,
        exchangeRate: 3.5,
        stockPrice: 0,
      };
      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('stockOptionSchema', () => {
    const validOption = {
      name: 'Option Grant 1',
      totalQuantity: 1000,
      usedQuantity: 0,
      exercisePrice: 10,
      averagePrice: 15,
      firstVestingDate: '2022-01-01',
    };

    it('should validate correct stock option', () => {
      const result = stockOptionSchema.safeParse(validOption);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = stockOptionSchema.safeParse({ ...validOption, name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 50 characters', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        name: 'A'.repeat(51) 
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        totalQuantity: -100 
      });
      expect(result.success).toBe(false);
    });

    it('should reject decimal quantity', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        totalQuantity: 100.5 
      });
      expect(result.success).toBe(false);
    });

    it('should reject usedQuantity greater than totalQuantity', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        totalQuantity: 100,
        usedQuantity: 200 
      });
      expect(result.success).toBe(false);
    });

    it('should reject usedQuantity greater than vestedQuantity', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        vestedQuantity: 50,
        usedQuantity: 100 
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative exercise price', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        exercisePrice: -10 
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty first vesting date', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        firstVestingDate: '' 
      });
      expect(result.success).toBe(false);
    });

    it('should apply default vesting duration of 4 years', () => {
      const result = stockOptionSchema.safeParse(validOption);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.vestingDurationYears).toBe(4);
      }
    });

    it('should apply default vesting frequency of quarterly', () => {
      const result = stockOptionSchema.safeParse(validOption);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.vestingFrequency).toBe('quarterly');
      }
    });

    it('should reject vesting duration less than 1 year', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        vestingDurationYears: 0 
      });
      expect(result.success).toBe(false);
    });

    it('should reject vesting duration greater than 10 years', () => {
      const result = stockOptionSchema.safeParse({ 
        ...validOption, 
        vestingDurationYears: 15 
      });
      expect(result.success).toBe(false);
    });
  });

  describe('rsuSchema', () => {
    const validRSU = {
      name: 'RSU Grant 1',
      totalQuantity: 500,
      usedQuantity: 0,
      averageVestingPrice: 15,
      firstVestingDate: '2022-01-01',
    };

    it('should validate correct RSU', () => {
      const result = rsuSchema.safeParse(validRSU);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = rsuSchema.safeParse({ ...validRSU, name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject vestedQuantity greater than totalQuantity', () => {
      const result = rsuSchema.safeParse({ 
        ...validRSU, 
        totalQuantity: 100,
        vestedQuantity: 200 
      });
      expect(result.success).toBe(false);
    });

    it('should reject usedQuantity greater than vestedQuantity', () => {
      const result = rsuSchema.safeParse({ 
        ...validRSU, 
        vestedQuantity: 50,
        usedQuantity: 100 
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative average vesting price', () => {
      const result = rsuSchema.safeParse({ 
        ...validRSU, 
        averageVestingPrice: -10 
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validatePersonalInfo', () => {
    it('should return success for valid data', () => {
      const result = validatePersonalInfo({
        monthlySalary: 25000,
        creditPoints: 2.25,
        exchangeRate: 3.5,
        stockPrice: 20,
      });
      expect(result.success).toBe(true);
    });

    it('should return error for invalid data', () => {
      const result = validatePersonalInfo({
        monthlySalary: -1000,
        creditPoints: 2.25,
        exchangeRate: 3.5,
        stockPrice: 20,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateStockOption', () => {
    it('should return success for valid data', () => {
      const result = validateStockOption({
        name: 'Option',
        totalQuantity: 100,
        usedQuantity: 0,
        exercisePrice: 10,
        averagePrice: 15,
        firstVestingDate: '2022-01-01',
      });
      expect(result.success).toBe(true);
    });

    it('should return error for invalid data', () => {
      const result = validateStockOption({
        name: '',
        totalQuantity: 100,
        usedQuantity: 0,
        exercisePrice: 10,
        averagePrice: 15,
        firstVestingDate: '2022-01-01',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateRSU', () => {
    it('should return success for valid data', () => {
      const result = validateRSU({
        name: 'RSU',
        totalQuantity: 100,
        usedQuantity: 0,
        averageVestingPrice: 15,
        firstVestingDate: '2022-01-01',
      });
      expect(result.success).toBe(true);
    });

    it('should return error for invalid data', () => {
      const result = validateRSU({
        name: '',
        totalQuantity: 100,
        usedQuantity: 0,
        averageVestingPrice: 15,
        firstVestingDate: '2022-01-01',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('getErrorMessages', () => {
    it('should extract error messages from ZodError', () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.number().positive('Age must be positive'),
      });
      const result = schema.safeParse({ name: '', age: -5 });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = getErrorMessages(result.error);
        expect(errors.name).toBe('Name is required');
        expect(errors.age).toBe('Age must be positive');
      }
    });

    it('should handle nested paths', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email('Invalid email'),
        }),
      });
      const result = schema.safeParse({ user: { email: 'invalid' } });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = getErrorMessages(result.error);
        expect(errors['user.email']).toBe('Invalid email');
      }
    });

    it('should keep only first error for each path', () => {
      const schema = z.object({
        name: z.string().min(3, 'Too short').max(5, 'Too long'),
      });
      const result = schema.safeParse({ name: '' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = getErrorMessages(result.error);
        expect(Object.keys(errors).length).toBe(1);
        expect(errors.name).toBe('Too short');
      }
    });

    it('should keep only first error when multiple errors exist for same path via refinements', () => {
      // Manually create a ZodError with duplicate paths to test the if condition
      const zodError = new z.ZodError([
        { code: 'custom', path: ['field'], message: 'First error' },
        { code: 'custom', path: ['field'], message: 'Second error' },
        { code: 'custom', path: ['other'], message: 'Other error' },
      ]);
      
      const errors = getErrorMessages(zodError);
      
      // Should only keep the first error for 'field' path
      expect(errors.field).toBe('First error');
      expect(errors.other).toBe('Other error');
      expect(Object.keys(errors).length).toBe(2);
    });
  });
});
