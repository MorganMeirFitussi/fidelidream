import type { StockOptionPackage, TaxRoute, TaxBreakdown, PackageResult } from '../types';
import { 
  calculateCapitalGainsTax,
  calculateBituahLeumi,
  calculateHealthInsurance,
  calculateEquityIncomeTax
} from './taxCalculations';

/**
 * Determine the tax route for stock options based on Article 102
 * Route A (Capital Gain): exercisePrice >= averagePrice
 * Route B (Ordinary Income): exercisePrice < averagePrice
 */
export function detectTaxRoute(exercisePrice: number, averagePrice: number): TaxRoute {
  return exercisePrice >= averagePrice ? 'capital_gain' : 'ordinary_income';
}

/**
 * Calculate available quantity (vested but not yet exercised)
 * @param vestedQuantity - Number of shares that have vested
 * @param usedQuantity - Number of shares already exercised
 */
export function getAvailableQuantity(vestedQuantity: number, usedQuantity: number): number {
  return Math.max(0, vestedQuantity - usedQuantity);
}

/**
 * Calculate stock option profit and taxes
 * @param option - Stock option package
 * @param currentStockPrice - Current stock price in USD
 * @param exchangeRate - USD to NIS exchange rate
 * @param annualSalary - Annual salary for marginal rate calculation
 * @param creditPoints - Credit points for tax reduction
 */
export function calculateStockOptionResult(
  option: StockOptionPackage,
  currentStockPrice: number,
  exchangeRate: number,
  annualSalary: number,
  creditPoints: number
): PackageResult {
  const availableQuantity = getAvailableQuantity(option.totalQuantity, option.usedQuantity);
  
  // Gross profit in USD
  const grossProfitPerShare = currentStockPrice - option.exercisePrice;
  const grossValueUSD = grossProfitPerShare * availableQuantity;
  const grossValueNIS = grossValueUSD * exchangeRate;
  
  // Detect tax route
  const route = detectTaxRoute(option.exercisePrice, option.averagePrice);
  
  let workIncomeNIS = 0;
  let capitalGainNIS = 0;
  let incomeTax = 0;
  let capitalGainsTax = 0;
  let bituahLeumi = 0;
  let healthInsurance = 0;
  let surtax = 0;
  let creditPointsReduction = 0;
  
  if (route === 'capital_gain') {
    // Route A: All profit taxed as capital gain at 30%
    capitalGainNIS = grossValueNIS;
    const cgTax = calculateCapitalGainsTax(capitalGainNIS);
    capitalGainsTax = cgTax.baseTax;
    surtax = cgTax.surtax;
  } else {
    // Route B: Split between work income and capital gain
    // Part 1: (averagePrice - exercisePrice) × quantity = work income
    const workIncomePerShare = option.averagePrice - option.exercisePrice;
    const workIncomeUSD = workIncomePerShare * availableQuantity;
    workIncomeNIS = workIncomeUSD * exchangeRate;
    
    // Part 2: (sellPrice - averagePrice) × quantity = capital gain
    const capitalGainPerShare = currentStockPrice - option.averagePrice;
    const capitalGainUSD = capitalGainPerShare * availableQuantity;
    capitalGainNIS = Math.max(0, capitalGainUSD * exchangeRate);
    
    // Calculate income tax on work income portion using proper credit point handling
    // Credit points are applied to TOTAL tax (salary + equity), so if salary already
    // consumes all credit points, equity income tax gets no reduction
    const taxResult = calculateEquityIncomeTax(workIncomeNIS, annualSalary, creditPoints);
    incomeTax = taxResult.incomeTax;
    creditPointsReduction = taxResult.creditPointsReduction;
    
    // Bituah Leumi only on work income, considering salary already uses part of ceiling
    // If salary >= 560,280 NIS, no additional Bituah Leumi on equity work income
    bituahLeumi = calculateBituahLeumi(workIncomeNIS, annualSalary);
    
    // Health Insurance only on work income (no ceiling, applies to all work income)
    healthInsurance = calculateHealthInsurance(workIncomeNIS);
    
    // Capital gains tax on the capital gain portion (credit points do NOT reduce this)
    if (capitalGainNIS > 0) {
      const cgTax = calculateCapitalGainsTax(capitalGainNIS);
      capitalGainsTax = cgTax.baseTax;
      surtax = cgTax.surtax;
    }
  }
  
  const totalTax = incomeTax + capitalGainsTax + bituahLeumi + healthInsurance + surtax;
  const netValueNIS = grossValueNIS - totalTax;
  const netValueUSD = netValueNIS / exchangeRate;
  
  const taxBreakdown: TaxBreakdown = {
    incomeTax,
    capitalGainsTax,
    bituahLeumi,
    healthInsurance,
    creditPointsReduction,
    surtax,
    totalTax,
  };
  
  return {
    id: option.id,
    name: option.name,
    type: 'option',
    grossValueUSD: Math.max(0, grossValueUSD),
    grossValueNIS: Math.max(0, grossValueNIS),
    taxBreakdown,
    netValueUSD: Math.max(0, netValueUSD),
    netValueNIS: Math.max(0, netValueNIS),
    route,
    workIncomeNIS,
    capitalGainNIS,
  };
}
