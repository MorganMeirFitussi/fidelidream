import type { RSUPackage, TaxBreakdown, PackageResult } from '../types';
import { 
  calculateCapitalGainsTax,
  calculateBituahLeumi,
  calculateHealthInsurance,
  calculateEquityIncomeTax
} from './taxCalculations';

/**
 * Calculate RSU profit and taxes
 * RSUs have double taxation:
 * 1. At vesting: RSU value = work income (taxed at marginal rate)
 * 2. At sale: (sellPrice - averageVesting) = capital gain (taxed at 30%)
 * 
 * @param rsu - RSU package
 * @param currentStockPrice - Current stock price in USD
 * @param exchangeRate - USD to NIS exchange rate
 * @param annualSalary - Annual salary for marginal rate calculation
 * @param creditPoints - Credit points for tax reduction
 */
export function calculateRSUResult(
  rsu: RSUPackage,
  currentStockPrice: number,
  exchangeRate: number,
  annualSalary: number,
  creditPoints: number
): PackageResult {
  const vestedQuantity = rsu.vestedQuantity;
  
  // Total value at current price
  const grossValueUSD = currentStockPrice * vestedQuantity;
  const grossValueNIS = grossValueUSD * exchangeRate;
  
  // Part 1: Work income = value at vesting (based on average vesting price)
  const workIncomeUSD = rsu.averageVestingPrice * vestedQuantity;
  const workIncomeNIS = workIncomeUSD * exchangeRate;
  
  // Part 2: Capital gain = difference between sale price and vesting price
  const capitalGainPerShare = currentStockPrice - rsu.averageVestingPrice;
  const capitalGainUSD = capitalGainPerShare * vestedQuantity;
  const capitalGainNIS = Math.max(0, capitalGainUSD * exchangeRate);
  
  // Calculate income tax on work income portion using proper credit point handling
  // Credit points are applied to TOTAL tax (salary + equity), so if salary already
  // consumes all credit points, equity income tax gets no reduction
  const taxResult = calculateEquityIncomeTax(workIncomeNIS, annualSalary, creditPoints);
  const incomeTax = taxResult.incomeTax;
  const creditPointsReduction = taxResult.creditPointsReduction;
  
  // Bituah Leumi only on work income, considering salary already uses part of ceiling
  // If salary >= 560,280 NIS, no additional Bituah Leumi on equity work income
  const bituahLeumi = calculateBituahLeumi(workIncomeNIS, annualSalary);
  
  // Health Insurance only on work income (no ceiling, applies to all work income)
  const healthInsurance = calculateHealthInsurance(workIncomeNIS);
  
  // Capital gains tax on the appreciation since vesting
  let capitalGainsTax = 0;
  let surtax = 0;
  
  if (capitalGainNIS > 0) {
    const cgTax = calculateCapitalGainsTax(capitalGainNIS);
    capitalGainsTax = cgTax.baseTax;
    surtax = cgTax.surtax;
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
    id: rsu.id,
    name: rsu.name,
    type: 'rsu',
    grossValueUSD: Math.max(0, grossValueUSD),
    grossValueNIS: Math.max(0, grossValueNIS),
    taxBreakdown,
    netValueUSD: Math.max(0, netValueUSD),
    netValueNIS: Math.max(0, netValueNIS),
    workIncomeNIS,
    capitalGainNIS,
  };
}
