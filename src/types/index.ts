// Personal Information
export interface PersonalInfo {
  monthlySalary: number; // NIS
  creditPoints: number; // Nekudot Zikuy
  exchangeRate: number; // USD/NIS
  stockPrice: number; // Current stock price in USD
}

// Stock Option Package
export interface StockOptionPackage {
  id: string;
  name: string;
  totalQuantity: number;
  vestedQuantity: number; // Calculated based on vesting schedule
  usedQuantity: number; // Already exercised
  exercisePrice: number; // USD
  averagePrice: number; // 30-day average at grant date, USD
  firstVestingDate: string; // ISO format (grant date)
  vestingDurationYears: number; // Default: 4
  vestingFrequency: VestingFrequency; // Default: 'quarterly'
  createdAt: string; // ISO format
}

// Vesting frequency options
export type VestingFrequency = 'monthly' | 'quarterly' | 'annually';

// RSU Package
export interface RSUPackage {
  id: string;
  name: string;
  totalQuantity: number;
  vestedQuantity: number; // Calculated or manually overridden
  averageVestingPrice: number; // USD
  firstVestingDate: string; // ISO format (grant date for vesting calculation)
  vestingDurationYears: number; // Default: 4
  vestingFrequency: VestingFrequency; // Default: 'quarterly'
  createdAt: string; // ISO format
}

// Tax Route for Stock Options
export type TaxRoute = 'capital_gain' | 'ordinary_income';

// Tax Breakdown
export interface TaxBreakdown {
  incomeTax: number; // NIS
  capitalGainsTax: number; // NIS
  bituahLeumi: number; // NIS (Social Security)
  healthInsurance: number; // NIS
  creditPointsReduction: number; // NIS
  surtax: number; // NIS (Smotrich surtax)
  totalTax: number; // NIS
}

// Per-Package Result
export interface PackageResult {
  id: string;
  name: string;
  type: 'option' | 'rsu';
  grossValueUSD: number;
  grossValueNIS: number;
  taxBreakdown: TaxBreakdown;
  netValueUSD: number;
  netValueNIS: number;
  route?: TaxRoute; // Only for options
  workIncomeNIS?: number; // Work income portion
  capitalGainNIS?: number; // Capital gain portion
  isUnderwater?: boolean; // True if options are underwater (exercise > current price)
}

// Complete Calculation Result
export interface CalculationResult {
  personalInfo: PersonalInfo;
  annualSalary: number; // NIS
  marginalTaxRate: number; // percentage
  packages: PackageResult[];
  totals: {
    grossValueUSD: number;
    grossValueNIS: number;
    taxBreakdown: TaxBreakdown;
    netValueUSD: number;
    netValueNIS: number;
    effectiveTaxRate: number; // percentage
  };
}

// localStorage Schema
export interface StoredData {
  version: number;
  lastUpdated: string; // ISO format
  personalInfo: PersonalInfo;
  stockOptions: StockOptionPackage[];
  rsus: RSUPackage[];
}

// Form types for creating/editing packages
export interface StockOptionFormData {
  name: string;
  totalQuantity: number;
  vestedQuantity?: number; // Calculated automatically
  usedQuantity: number;
  exercisePrice: number;
  averagePrice: number;
  firstVestingDate: string;
  vestingDurationYears: number;
  vestingFrequency: VestingFrequency;
}

export interface RSUFormData {
  name: string;
  totalQuantity: number;
  vestedQuantity?: number; // Optional - calculated automatically if not provided
  averageVestingPrice: number;
  firstVestingDate: string;
  vestingDurationYears: number;
  vestingFrequency: VestingFrequency;
}

// Package type union for modal
export type PackageType = 'option' | 'rsu';
