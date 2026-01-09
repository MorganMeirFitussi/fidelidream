import { z } from 'zod';

// Personal Info Schema
export const personalInfoSchema = z.object({
  monthlySalary: z
    .number({ required_error: 'Monthly salary is required' })
    .positive('Monthly salary must be positive'),
  creditPoints: z
    .number({ required_error: 'Credit points are required' })
    .min(0, 'Credit points cannot be negative')
    .max(20, 'Credit points cannot exceed 20'),
  exchangeRate: z
    .number({ required_error: 'Exchange rate is required' })
    .min(1, 'Exchange rate must be at least 1')
    .max(10, 'Exchange rate cannot exceed 10'),
  stockPrice: z
    .number({ required_error: 'Stock price is required' })
    .positive('Stock price must be positive'),
});

// Stock Option Package Schema
export const stockOptionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  totalQuantity: z
    .number({ required_error: 'Total quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  vestedQuantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Vested quantity cannot be negative')
    .optional(),
  usedQuantity: z
    .number({ required_error: 'Used quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Used quantity cannot be negative'),
  exercisePrice: z
    .number({ required_error: 'Exercise price is required' })
    .min(0, 'Exercise price cannot be negative'),
  averagePrice: z
    .number({ required_error: 'Average price is required' })
    .min(0, 'Average price cannot be negative'),
  firstVestingDate: z
    .string({ required_error: 'First vesting date is required' })
    .min(1, 'First vesting date is required'),
  vestingDurationYears: z
    .number()
    .int()
    .min(1, 'Vesting duration must be at least 1 year')
    .max(10, 'Vesting duration cannot exceed 10 years')
    .default(4),
  vestingFrequency: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('quarterly'),
}).refine(
  (data) => data.usedQuantity <= data.totalQuantity,
  {
    message: 'Used quantity cannot exceed total quantity',
    path: ['usedQuantity'],
  }
).refine(
  (data) => !data.vestedQuantity || data.usedQuantity <= data.vestedQuantity,
  {
    message: 'Used quantity cannot exceed vested quantity',
    path: ['usedQuantity'],
  }
);

// RSU Package Schema
export const rsuSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  totalQuantity: z
    .number({ required_error: 'Total quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  vestedQuantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Vested quantity cannot be negative')
    .optional(),
  usedQuantity: z
    .number({ required_error: 'Used quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Used quantity cannot be negative'),
  averageVestingPrice: z
    .number({ required_error: 'Average vesting price is required' })
    .min(0, 'Average vesting price cannot be negative'),
  firstVestingDate: z
    .string({ required_error: 'First vesting date is required' })
    .min(1, 'First vesting date is required'),
  vestingDurationYears: z
    .number()
    .int()
    .min(1, 'Vesting duration must be at least 1 year')
    .max(10, 'Vesting duration cannot exceed 10 years')
    .default(4),
  vestingFrequency: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('quarterly'),
}).refine(
  (data) => !data.vestedQuantity || data.vestedQuantity <= data.totalQuantity,
  {
    message: 'Vested quantity cannot exceed total quantity',
    path: ['vestedQuantity'],
  }
).refine(
  (data) => !data.vestedQuantity || data.usedQuantity <= data.vestedQuantity,
  {
    message: 'Used quantity cannot exceed vested quantity',
    path: ['usedQuantity'],
  }
);

// Type exports for form handling
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type StockOptionInput = z.infer<typeof stockOptionSchema>;
export type RSUInput = z.infer<typeof rsuSchema>;

// Validation helper functions
export function validatePersonalInfo(data: unknown) {
  return personalInfoSchema.safeParse(data);
}

export function validateStockOption(data: unknown) {
  return stockOptionSchema.safeParse(data);
}

export function validateRSU(data: unknown) {
  return rsuSchema.safeParse(data);
}

// Extract error messages from Zod error
export function getErrorMessages(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
