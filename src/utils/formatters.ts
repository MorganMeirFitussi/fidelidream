// Currency formatters
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNIS(value: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Number formatter with thousand separators
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Percentage formatter
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Date formatter
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Parse number from input string (handles currency symbols and separators)
export function parseNumberInput(value: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = value.replace(/[$₪,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Format input value for display
export function formatInputValue(value: number | undefined, prefix?: string): string {
  if (value === undefined || value === 0) return '';
  const formatted = formatNumber(value, 2);
  return prefix ? `${prefix}${formatted}` : formatted;
}

// Calculate vested quantity based on vesting schedule
export function calculateVestedQuantity(
  totalQuantity: number,
  firstVestingDate: string,
  vestingDurationYears: number,
  vestingFrequency: 'monthly' | 'quarterly' | 'annually'
): number {
  if (!firstVestingDate || totalQuantity <= 0 || vestingDurationYears <= 0) {
    return 0;
  }

  const grantDate = new Date(firstVestingDate);
  const today = new Date();
  
  // If grant date is in the future, nothing is vested
  if (grantDate > today) {
    return 0;
  }

  // Calculate days since grant for more precision
  const daysSinceGrant = Math.floor((today.getTime() - grantDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalVestingDays = vestingDurationYears * 365.25; // Account for leap years

  // Determine vesting periods based on frequency
  let periodsPerYear: number;
  switch (vestingFrequency) {
    case 'monthly':
      periodsPerYear = 12;
      break;
    case 'quarterly':
      periodsPerYear = 4;
      break;
    case 'annually':
      periodsPerYear = 1;
      break;
  }

  const daysPerPeriod = 365.25 / periodsPerYear;
  const totalPeriods = vestingDurationYears * periodsPerYear;
  
  // Calculate completed vesting periods based on days
  const completedPeriods = Math.floor(daysSinceGrant / daysPerPeriod);
  const cappedPeriods = Math.min(completedPeriods, totalPeriods);
  
  // Calculate vested quantity (rounded to nearest whole share)
  const vestedQuantity = Math.round(totalQuantity * (cappedPeriods / totalPeriods));
  
  return vestedQuantity;
}
