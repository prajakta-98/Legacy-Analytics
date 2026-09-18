import { formatDateOfBirth } from './dateUtils';
import { formatValue } from './formatting';

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function exportCalculationCsv(dateOfBirth, result) {
  if (!result) return;
  const rows = [
    ['Parental Legacy & Life Factors Report'],
    ['Date of Birth', formatDateOfBirth(dateOfBirth)],
    ['Dominant Parent', result.dominantParent],
    [],
    ['Life Factor', 'Mother Value', 'Father Value', 'Total'],
    ...result.factors.map((factor) => [
      factor.name,
      formatValue(factor.mother),
      formatValue(factor.father),
      formatValue(factor.total),
    ]),
    ['TOTAL', formatValue(result.motherTotal), formatValue(result.fatherTotal), formatValue(result.grandTotal)],
  ];
  const content = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `parental-legacy-report-${dateOfBirth}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
