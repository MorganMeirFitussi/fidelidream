# 🇮🇱 Israeli Equity Calculator

A comprehensive web application to calculate net gains on RSUs (Restricted Stock Units) and Stock Options for Israeli high-tech employees, accounting for all Israeli tax rules including Article 102, Bituah Leumi, and credit points.

## ✨ Features

- **Stock Options Calculator** - Support for both Capital Gain Route (102-A) and Ordinary Income Route (102-B)
- **RSU Calculator** - Full RSU taxation with work income and capital gains split
- **Automatic Vesting Calculation** - Based on grant date, duration, and frequency
- **Simulator** - Project future equity values with hypothetical stock prices and dates
- **Dark Mode** - Automatic theme based on system preference
- **Drag & Drop** - Reorder packages within sections
- **Local Storage** - All data persists in your browser (no server)
- **Real-time Exchange Rate** - Fetch current USD/NIS rate from Frankfurter API

---

## 📊 Tax Calculations Explained

### Israeli Tax System Overview (2025)

#### Progressive Income Tax Brackets

| Income Range (NIS/year) | Tax Rate |
|------------------------|----------|
| 0 - 84,120 | 10% |
| 84,121 - 120,720 | 14% |
| 120,721 - 193,800 | 20% |
| 193,801 - 269,280 | 31% |
| 269,281 - 560,280 | 35% |
| 560,281 - 721,560 | 47% |
| 721,561+ | 50% |

#### Credit Points (נקודות זיכוי)

- Each credit point reduces tax by **₪2,904/year** (2025)
- Default: 2.25 points for Israeli residents
- Applied against total tax liability

---

### Stock Options - Article 102

Israeli stock options are taxed under Article 102, with two possible routes:

#### Capital Gain Route (102-A) ✅
**Condition:** Exercise Price ≥ 30-day Average Price at Grant

```
Profit = (Sale Price - Exercise Price) × Quantity
Tax = Profit × 30%
```

- ✅ Flat 30% capital gains tax (25% base + 5% surtax)
- ✅ No Bituah Leumi
- ✅ No Health Insurance
- ✅ Most favorable route

#### Ordinary Income Route (102-B) ⚠️
**Condition:** Exercise Price < 30-day Average Price at Grant

The profit is split into two components:

```
Work Income = (Average Price - Exercise Price) × Quantity
Capital Gain = (Sale Price - Average Price) × Quantity
```

**Taxes on Work Income:**
- Progressive income tax (10-50% based on bracket)
- Bituah Leumi: 7.6% (up to ceiling of ₪556,344/year)
- Health Insurance: 5%

**Taxes on Capital Gain:**
- Flat 30% (25% + 5% surtax)

---

### RSUs (Restricted Stock Units)

RSUs are taxed in two parts:

#### 1. Work Income (at Vesting)
```
Work Income = Vesting Price × Quantity
```
- Progressive income tax (10-50%)
- Bituah Leumi: 7.6%
- Health Insurance: 5%

#### 2. Capital Gain (at Sale)
```
Capital Gain = (Sale Price - Vesting Price) × Quantity
```
- Flat 30% capital gains tax

---

### Social Security (Bituah Leumi)

| Type | Rate | Ceiling (2025) |
|------|------|----------------|
| Bituah Leumi | 7.6% | ₪556,344/year |
| Health Insurance | 5% | None |

---

### Capital Gains Tax

```
Effective Rate = 30%
  └── 25% base rate
  └── 5% Smotrich Surtax (2025)
```

---

### Calculation Flow

```
1. Calculate gross profit per package
2. Determine tax route (for options)
3. Split into Work Income and Capital Gain
4. Apply marginal tax rate to Work Income
5. Apply 30% to Capital Gains
6. Calculate Bituah Leumi on total Work Income
7. Calculate Health Insurance
8. Apply Credit Points reduction
9. Net = Gross - Total Taxes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MorganMeirFitussi/fidelidream.git
cd fidelidream

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management with localStorage persistence
- **Vanilla Extract** - Type-safe CSS-in-JS
- **Zod** - Schema validation
- **Vitest** - Testing framework (100% coverage)

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── PackageCard.tsx
│   ├── PackageForm.tsx
│   ├── PackageSection.tsx
│   ├── PersonalInfoForm.tsx
│   ├── Results.tsx
│   └── SimulatorModal.tsx
├── hooks/              # Custom React hooks
│   ├── useDragAndDrop.ts
│   ├── useExchangeRate.ts
│   ├── useModal.ts
│   ├── usePackageForm.ts
│   └── useTheme.ts
├── lib/                # Core calculation logic
│   ├── calculator.ts   # Main calculation orchestrator
│   ├── constants.ts    # Tax rates and brackets
│   ├── optionsCalculations.ts
│   ├── rsusCalculations.ts
│   └── taxCalculations.ts
├── store/              # Zustand store
│   └── useEquityStore.ts
├── styles/             # Vanilla Extract styles
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
    ├── exchangeRate.ts
    ├── formatters.ts
    └── validators.ts
```

---

## ⚠️ Disclaimer

This tool is provided for **informational purposes only**. Calculations are estimates based on 2025 Israeli tax laws. This calculator **does not replace** professional tax advice from a licensed Israeli accountant (רואה חשבון).

---

## 🔒 Privacy

This application does not collect or store your data on any server. All data is stored locally in your browser using localStorage.

---

## 📄 License

MIT
