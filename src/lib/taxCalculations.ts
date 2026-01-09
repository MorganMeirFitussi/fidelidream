import { TAX_BRACKETS, CREDIT_POINT_VALUE, BITUAH_LEUMI, CAPITAL_GAINS } from './constants';

/**
 * Calculate progressive income tax based on Israeli tax brackets
 * @param annualIncome - Annual income in NIS
 * @returns Tax amount in NIS
 */
export function calculateProgressiveTax(annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  
  let tax = 0;
  let remaining = annualIncome;
  
  for (const bracket of TAX_BRACKETS) {
    const bracketSize = bracket.ceiling - bracket.floor;
    const taxableInBracket = Math.min(remaining, bracketSize);
    
    if (taxableInBracket <= 0) break;
    
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Find the marginal tax rate for a given income level
 * @param annualIncome - Annual income in NIS
 * @returns Marginal tax rate as a decimal (e.g., 0.35 for 35%)
 */
export function getMarginalTaxRate(annualIncome: number): number {
  if (annualIncome <= 0) return TAX_BRACKETS[0].rate;
  
  for (const bracket of TAX_BRACKETS) {
    if (annualIncome <= bracket.ceiling) {
      return bracket.rate;
    }
  }
  
  // Last bracket has ceiling: Infinity, so loop always returns
  // This line is for TypeScript completeness only
  /* istanbul ignore next -- @preserve */
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate; // unreachable
}

/**
 * Calculate credit points reduction
 * @param creditPoints - Number of credit points (Nekudot Zikuy)
 * @returns Annual credit value in NIS
 */
export function calculateCreditPointsValue(creditPoints: number): number {
  return creditPoints * CREDIT_POINT_VALUE;
}

/**
 * Apply credit points to reduce tax (cannot go below zero)
 * @param tax - Calculated tax amount in NIS
 * @param creditPoints - Number of credit points
 * @returns Reduced tax amount in NIS
 */
export function applyCreditPoints(tax: number, creditPoints: number): { 
  finalTax: number; 
  creditUsed: number;
} {
  const creditValue = calculateCreditPointsValue(creditPoints);
  const finalTax = Math.max(0, tax - creditValue);
  const creditUsed = tax - finalTax;
  
  return { finalTax, creditUsed };
}

/**
 * Calculate income tax on equity work income, properly accounting for credit points
 * Credit points reduce the TOTAL tax liability (salary + equity), not just equity tax
 * 
 * CORRECT calculation:
 * 1. Tax on salary alone (before credits)
 * 2. Tax on total income (salary + equity work income) (before credits)
 * 3. Apply credit points to BOTH
 * 4. Equity tax = (Total tax after credits) - (Salary tax after credits)
 * 
 * @param workIncomeNIS - Equity work income in NIS
 * @param annualSalary - Annual salary in NIS
 * @param creditPoints - Number of credit points
 * @returns Object with income tax and credit reduction used for equity portion
 */
export function calculateEquityIncomeTax(
  workIncomeNIS: number,
  annualSalary: number,
  creditPoints: number
): { incomeTax: number; creditPointsReduction: number } {
  if (workIncomeNIS <= 0) {
    return { incomeTax: 0, creditPointsReduction: 0 };
  }
  
  const creditValue = calculateCreditPointsValue(creditPoints);
  
  // Tax on salary alone (before credits)
  const taxOnSalaryBeforeCredits = calculateProgressiveTax(annualSalary);
  
  // Tax on total income (before credits)
  const totalIncome = annualSalary + workIncomeNIS;
  const taxOnTotalBeforeCredits = calculateProgressiveTax(totalIncome);
  
  // Apply credit points to BOTH calculations
  const taxOnSalaryAfterCredits = Math.max(0, taxOnSalaryBeforeCredits - creditValue);
  const taxOnTotalAfterCredits = Math.max(0, taxOnTotalBeforeCredits - creditValue);
  
  // The equity income tax is the difference
  const equityIncomeTax = taxOnTotalAfterCredits - taxOnSalaryAfterCredits;
  
  // Calculate how much credit was used specifically for equity portion
  // This is the difference between the "without credit" and "with credit" approaches
  const equityTaxWithoutCredits = taxOnTotalBeforeCredits - taxOnSalaryBeforeCredits;
  const creditUsedForEquity = equityTaxWithoutCredits - equityIncomeTax;
  
  return { 
    incomeTax: Math.max(0, equityIncomeTax), 
    creditPointsReduction: Math.max(0, creditUsedForEquity)
  };
}

/**
 * Calculate Bituah Leumi (Social Security) contribution
 * Only applies to work income, NOT capital gains
 * IMPORTANT: The ceiling applies to TOTAL work income (salary + equity work income)
 * 
 * @param workIncome - Additional work income in NIS (equity portion)
 * @param annualSalary - Annual salary in NIS (to calculate remaining ceiling)
 * @returns Social security contribution in NIS
 */
export function calculateBituahLeumi(workIncome: number, annualSalary: number = 0): number {
  if (workIncome <= 0) return 0;
  
  // Calculate how much of the ceiling is already used by salary
  const salaryUsedCeiling = Math.min(annualSalary, BITUAH_LEUMI.ceiling);
  const remainingCeiling = Math.max(0, BITUAH_LEUMI.ceiling - salaryUsedCeiling);
  
  // Only apply Bituah Leumi to work income up to the remaining ceiling
  const taxableWorkIncome = Math.min(workIncome, remainingCeiling);
  const contribution = taxableWorkIncome * BITUAH_LEUMI.generalRate;
  
  return contribution;
}

/**
 * Calculate Health Insurance contribution
 * IMPORTANT: Health insurance applies to work income only (no ceiling)
 * Health insurance is NOT applied to capital gains
 * 
 * @param workIncome - Additional work income in NIS (equity portion)
 * @returns Health insurance contribution in NIS
 */
export function calculateHealthInsurance(workIncome: number): number {
  if (workIncome <= 0) return 0;
  
  // Health insurance applies to all work income (no ceiling)
  return workIncome * BITUAH_LEUMI.healthRate;
}

/**
 * Calculate capital gains tax
 * Includes base rate + Smotrich surtax for high gains
 * @param capitalGain - Capital gain amount in NIS
 * @param totalCapitalGains - Total capital gains for surtax calculation
 * @returns Capital gains tax in NIS
 */
export function calculateCapitalGainsTax(
  capitalGain: number, 
  totalCapitalGains: number = capitalGain
): { baseTax: number; surtax: number; totalTax: number } {
  if (capitalGain <= 0) {
    return { baseTax: 0, surtax: 0, totalTax: 0 };
  }
  
  // Base capital gains tax at 25%
  const baseTax = capitalGain * CAPITAL_GAINS.baseRate;
  
  // Surtax only on gains above threshold
  let surtax = 0;
  if (totalCapitalGains > CAPITAL_GAINS.surtaxThreshold) {
    // Calculate how much of this gain is above threshold
    const gainAboveThreshold = Math.max(
      0, 
      Math.min(capitalGain, totalCapitalGains - CAPITAL_GAINS.surtaxThreshold)
    );
    surtax = gainAboveThreshold * CAPITAL_GAINS.surtaxRate;
  }
  
  return {
    baseTax,
    surtax,
    totalTax: baseTax + surtax,
  };
}

/**
 * Calculate effective capital gains rate for display purposes
 * Uses simplified 30% rate as per requirements
 */
export function getEffectiveCapitalGainsRate(): number {
  return CAPITAL_GAINS.effectiveRate;
}
