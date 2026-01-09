import type { 
  PersonalInfo, 
  StockOptionPackage, 
  RSUPackage, 
  CalculationResult, 
  TaxBreakdown,
  PackageResult 
} from '../types';
import { 
  getMarginalTaxRate,
  calculateCreditPointsValue
} from './taxCalculations';
import { detectTaxRoute, getAvailableQuantity } from './optionsCalculations';
import { BITUAH_LEUMI, CAPITAL_GAINS } from './constants';

/**
 * Main calculation function that processes all packages
 * Uses marginal rate for work income and flat 30% for capital gains
 */
export function calculateEquity(
  personalInfo: PersonalInfo,
  stockOptions: StockOptionPackage[],
  rsus: RSUPackage[]
): CalculationResult {
  const { stockPrice, exchangeRate, monthlySalary, creditPoints } = personalInfo;
  const annualSalary = monthlySalary * 12;
  
  // Convert stock price to NIS
  const stockPriceNIS = stockPrice * exchangeRate;

  // Step 1: Calculate raw values for each package
  interface PackageData {
    id: string;
    name: string;
    type: 'option' | 'rsu';
    grossValueNIS: number;
    grossValueUSD: number;
    workIncomeNIS: number;
    capitalGainNIS: number;
    route?: 'capital_gain' | 'ordinary_income';
    isUnderwater?: boolean;
  }

  const packagesData: PackageData[] = [];
  let totalWorkIncomeNIS = 0;

  // Process stock options
  for (const option of stockOptions) {
    // Use vestedQuantity if available, otherwise fall back to totalQuantity for backwards compatibility
    const vestedQty = option.vestedQuantity ?? option.totalQuantity;
    const availableQty = getAvailableQuantity(vestedQty, option.usedQuantity);
    
    // Convert prices to NIS
    const exercisePriceNIS = option.exercisePrice * exchangeRate;
    const avgPriceNIS = option.averagePrice * exchangeRate;
    
    // Check if profitable
    const grossProfitPerShareNIS = stockPriceNIS - exercisePriceNIS;
    const route = detectTaxRoute(option.exercisePrice, option.averagePrice);
    
    // Handle underwater options (exercise price > current price)
    if (grossProfitPerShareNIS <= 0) {
      // Still include in results but with zero values
      packagesData.push({
        id: option.id,
        name: option.name,
        type: 'option',
        grossValueNIS: 0,
        grossValueUSD: 0,
        workIncomeNIS: 0,
        capitalGainNIS: 0,
        route,
        isUnderwater: true,
      });
      continue;
    }
    
    const grossValueNIS = grossProfitPerShareNIS * availableQty;
    const grossValueUSD = grossValueNIS / exchangeRate;
    
    let workIncomeNIS = 0;
    let capitalGainNIS = 0;
    
    if (route === 'capital_gain') {
      // Route A: All profit is capital gain (30%)
      capitalGainNIS = grossValueNIS;
    } else {
      // Route B: Split between work income and capital gain
      // Work income = (avgPrice - exercisePrice) × qty
      workIncomeNIS = (avgPriceNIS - exercisePriceNIS) * availableQty;
      // Capital gain = (sellPrice - avgPrice) × qty  
      capitalGainNIS = Math.max(0, (stockPriceNIS - avgPriceNIS) * availableQty);
      totalWorkIncomeNIS += workIncomeNIS;
    }
    
    packagesData.push({
      id: option.id,
      name: option.name,
      type: 'option',
      grossValueNIS,
      grossValueUSD,
      workIncomeNIS,
      capitalGainNIS,
      route,
    });
  }

  // Process RSUs
  for (const rsu of rsus) {
    const vestedQty = rsu.vestedQuantity;
    const usedQty = rsu.usedQuantity || 0;
    const availableQty = Math.max(0, vestedQty - usedQty);
    
    if (availableQty <= 0) continue;
    
    // Convert vesting price to NIS
    const vestingPriceNIS = rsu.averageVestingPrice * exchangeRate;
    
    const grossValueNIS = stockPriceNIS * availableQty;
    const grossValueUSD = grossValueNIS / exchangeRate;
    
    // Work income = vesting price × qty
    const workIncomeNIS = vestingPriceNIS * availableQty;
    totalWorkIncomeNIS += workIncomeNIS;
    
    // Capital gain = (sellPrice - vestingPrice) × qty
    const capitalGainNIS = Math.max(0, (stockPriceNIS - vestingPriceNIS) * availableQty);
    
    packagesData.push({
      id: rsu.id,
      name: rsu.name,
      type: 'rsu',
      grossValueNIS,
      grossValueUSD,
      workIncomeNIS,
      capitalGainNIS,
    });
  }

  // Step 2: Determine marginal tax rate
  // Use the bracket where (salary + half of work income) falls
  // This gives a more representative marginal rate for the work income
  const midpointIncome = annualSalary + (totalWorkIncomeNIS / 2);
  const marginalRate = getMarginalTaxRate(midpointIncome);
  const marginalTaxRate = marginalRate * 100;

  // Step 3: Calculate taxes for each package
  let totalIncomeTax = 0;
  let totalCapitalGainsTax = 0;
  let totalGrossNIS = 0;
  let totalGrossUSD = 0;

  const packageResults: PackageResult[] = packagesData.map(pkg => {
    // Income tax: work income × marginal rate
    const pkgIncomeTax = pkg.workIncomeNIS * marginalRate;
    
    // Capital gains tax: flat 30%
    const pkgCapitalGainsTax = pkg.capitalGainNIS * CAPITAL_GAINS.effectiveRate;
    
    const pkgTotalTax = pkgIncomeTax + pkgCapitalGainsTax;
    const pkgNetNIS = pkg.grossValueNIS - pkgTotalTax;
    const pkgNetUSD = pkgNetNIS / exchangeRate;

    totalIncomeTax += pkgIncomeTax;
    totalCapitalGainsTax += pkgCapitalGainsTax;
    totalGrossNIS += pkg.grossValueNIS;
    totalGrossUSD += pkg.grossValueUSD;

    const taxBreakdown: TaxBreakdown = {
      incomeTax: pkgIncomeTax,
      capitalGainsTax: pkgCapitalGainsTax,
      bituahLeumi: 0, // Calculated separately at total level
      healthInsurance: 0,
      creditPointsReduction: 0,
      surtax: 0, // Included in the 30% rate
      totalTax: pkgTotalTax,
    };

    return {
      id: pkg.id,
      name: pkg.name,
      type: pkg.type,
      grossValueUSD: pkg.grossValueUSD,
      grossValueNIS: pkg.grossValueNIS,
      taxBreakdown,
      netValueUSD: pkgNetUSD,
      netValueNIS: pkgNetNIS,
      route: pkg.route,
      workIncomeNIS: pkg.workIncomeNIS,
      capitalGainNIS: pkg.capitalGainNIS,
      isUnderwater: pkg.isUnderwater,
    };
  });

  // Step 4: Calculate social security on total work income
  const taxableWorkIncome = Math.min(totalWorkIncomeNIS, BITUAH_LEUMI.ceiling);
  const totalBituahLeumi = taxableWorkIncome * BITUAH_LEUMI.generalRate;
  const totalHealthInsurance = totalWorkIncomeNIS * BITUAH_LEUMI.healthRate;

  // Step 5: Calculate total tax before credits
  const totalTaxBeforeCredits = totalIncomeTax + totalCapitalGainsTax + totalBituahLeumi + totalHealthInsurance;

  // Step 6: Apply credit points to reduce total tax
  const creditValue = calculateCreditPointsValue(creditPoints);
  const creditPointsReduction = Math.min(creditValue, totalTaxBeforeCredits);
  const totalTax = totalTaxBeforeCredits - creditPointsReduction;

  // Step 7: Calculate net values
  const totalNetNIS = totalGrossNIS - totalTax;
  const totalNetUSD = totalNetNIS / exchangeRate;

  const combinedTaxBreakdown: TaxBreakdown = {
    incomeTax: totalIncomeTax,
    capitalGainsTax: totalCapitalGainsTax,
    bituahLeumi: totalBituahLeumi,
    healthInsurance: totalHealthInsurance,
    creditPointsReduction,
    surtax: 0, // Included in the 30% capital gains rate
    totalTax,
  };

  const effectiveTaxRate = totalGrossNIS > 0 ? (totalTax / totalGrossNIS) * 100 : 0;

  // Package results keep only income tax + capital gains tax
  // Social security and credits are shown at the total level only
  const updatedPackageResults = packageResults;

  return {
    personalInfo,
    annualSalary,
    marginalTaxRate,
    packages: updatedPackageResults,
    totals: {
      grossValueUSD: totalGrossUSD,
      grossValueNIS: totalGrossNIS,
      taxBreakdown: combinedTaxBreakdown,
      netValueUSD: totalNetUSD,
      netValueNIS: totalNetNIS,
      effectiveTaxRate,
    },
  };
}
