// Israeli Tax Constants for 2025

// Tax Brackets (Annual Income in NIS)
export interface TaxBracket {
  floor: number;
  ceiling: number;
  rate: number;
}

export const TAX_BRACKETS: TaxBracket[] = [
  { floor: 0, ceiling: 83_880, rate: 0.10 },
  { floor: 83_880, ceiling: 120_720, rate: 0.14 },
  { floor: 120_720, ceiling: 193_800, rate: 0.20 },
  { floor: 193_800, ceiling: 269_280, rate: 0.31 },
  { floor: 269_280, ceiling: 560_280, rate: 0.35 },
  { floor: 560_280, ceiling: 721_560, rate: 0.47 },
  { floor: 721_560, ceiling: Infinity, rate: 0.50 },
];

// Credit Points (Nekudot Zikuy)
export const CREDIT_POINT_VALUE = 2_784; // NIS per point per year

// Bituah Leumi (Social Security) rates
export const BITUAH_LEUMI = {
  // General rate (employee portion)
  generalRate: 0.07,
  // Health insurance rate
  healthRate: 0.05,
  // Ceiling for general rate calculations
  ceiling: 560_280,
};

// Capital Gains Tax
export const CAPITAL_GAINS = {
  // Base rate
  baseRate: 0.25,
  // Smotrich surtax rate (added on top)
  surtaxRate: 0.05,
  // Threshold for surtax
  surtaxThreshold: 721_560,
  // Effective rate (base + surtax for high gains)
  effectiveRate: 0.30,
};

// Default values for personal info
export const DEFAULTS = {
  creditPoints: 2.25,
  exchangeRate: 3.20,
};
