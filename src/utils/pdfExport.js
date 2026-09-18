import { formatDateOfBirth } from './dateUtils';
import { formatValue } from './formatting';

export async function exportCalculationPdf(dateOfBirth, result) {
  if (!result) return;
  // Keep the main dashboard fast: PDF libraries load only when a report is requested.
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const document = new jsPDF({ unit: 'pt', format: 'a4' });
  document.setFillColor(18, 18, 30);
  document.rect(0, 0, 595, 842, 'F');
  document.setTextColor(246, 245, 255);
  document.setFontSize(21);
  document.text('Parental Legacy & Life Factors Report', 42, 55);
  document.setFontSize(10);
  document.setTextColor(188, 185, 212);
  document.text(`Date of birth: ${formatDateOfBirth(dateOfBirth)}`, 42, 82);
  document.text(`Dominant parent: ${result.dominantParent}`, 42, 100);
  document.text(`Mother: ${formatValue(result.motherTotal)}   Father: ${formatValue(result.fatherTotal)}   Total: ${formatValue(result.grandTotal)}`, 42, 118);
  autoTable(document, {
    startY: 145,
    head: [['Life Factor', 'Mother', 'Father', 'Total']],
    body: [
      ...result.factors.map((factor) => [
        factor.name,
        formatValue(factor.mother),
        formatValue(factor.father),
        formatValue(factor.total),
      ]),
      ['TOTAL', formatValue(result.motherTotal), formatValue(result.fatherTotal), formatValue(result.grandTotal)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [105, 71, 210], textColor: [255, 255, 255] },
    bodyStyles: { fillColor: [28, 27, 43], textColor: [242, 241, 252], lineColor: [74, 70, 98] },
    alternateRowStyles: { fillColor: [36, 34, 53] },
    footStyles: { fillColor: [36, 34, 53] },
  });
  const pageHeight = document.internal.pageSize.getHeight();
  document.setTextColor(188, 185, 212);
  document.setFontSize(9);
  document.text(`Generated locally on ${new Date().toLocaleString()}`, 42, pageHeight - 34);
  document.save(`parental-legacy-report-${dateOfBirth}.pdf`);
}
