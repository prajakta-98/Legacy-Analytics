# Legacy-Analytics

# Parental Legacy & Life Factors Calculator

A responsive React dashboard that calculates a deterministic Mother/Father influence distribution from a date of birth. All calculations run in the browser and no date of birth data leaves the device.

## Features

- Native date input with empty, invalid, and future-date handling
- Seven assessment-specified life factors with Mother, Father, and combined values
- Odd DOB day: Mother has the higher overall influence; even DOB day: Father does
- Every factor reconciles to its combined total and all factors reconcile to `100.000`
- Responsive analytics table, grouped comparison chart, overall balance chart, and insight panel
- Last valid date and result, plus display theme, persist with `localStorage`
- Dark mode by default and an accessible light mode
- CSV and PDF exports generated locally
- Vitest coverage for date parity, determinism, boundaries, leap day, and total invariants

## Technology stack

- React + Vite
- Recharts
- Lucide React
- jsPDF + AutoTable (loaded only when exporting a PDF)
- Vitest

## Calculation logic

The supplied assessment defines factor ranges, reference values, and an odd/even day-of-month dominance rule. It does **not** define an official formula to convert every possible date of birth into seven exact values. This project therefore implements a transparent deterministic strategy rather than claiming an unspecified hidden formula.

1. The calculator parses the selected `YYYY-MM-DD` as a local calendar date, avoiding UTC date shifts.
2. It hashes that date into stable factor variations around the supplied baseline/range data.
3. The selected day determines the higher aggregate parent: Mother for odd days, Father for even days.
4. All shares are allocated in integer thousandths, then converted for display. This preserves row reconciliation and ensures the grand total always displays as `100.000`.
5. The engine validates seven factors, finite/non-negative values, parity, row totals, parent totals, and the exact normalized grand total before returning a result.

The result is an assessment implementation and is not a scientific, medical, or diagnostic finding.

## Project structure

```text
src/
  components/      Reusable layout, dashboard, and common UI components
  data/            Centralized life-factor ranges and reference values
  hooks/           Calculator and theme state hooks
  pages/           Analytics page composition
  utils/           Date, storage, export, formatting, and calculation utilities
```

## Installation

```bash
npm install
npm run dev
```

Open the local URL Vite reports in the terminal.

## Quality checks

```bash
npm test
npm run build
```

## Deployment

Build the production bundle with `npm run build`, then deploy the generated `dist` directory to a static host such as Netlify or Vercel. No environment variables or server endpoints are required.

## Assumptions

- The workbook’s values are a baseline/reference, not a complete DOB formula.
- Day parity controls the **overall** dominant parent. Individual factors may vary, matching the reference workbook’s mixed row-level parent values.
- Local storage is optional enhancement only; a blocked or corrupted browser storage value never prevents a new calculation.
