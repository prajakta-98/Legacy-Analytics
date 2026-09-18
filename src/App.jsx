import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { useLifeFactorCalculator } from './hooks/useLifeFactorCalculator';
import { useTheme } from './hooks/useTheme';
import { Analytics } from './pages/Analytics';
import { exportCalculationCsv } from './utils/csvExport';
import { exportCalculationPdf } from './utils/pdfExport';

export default function App() {
  const { dateOfBirth, setDateOfBirth, result, dateError } = useLifeFactorCalculator();
  const { theme, toggleTheme } = useTheme();
  const [exportError, setExportError] = useState('');

  async function runExport(exporter) {
    try {
      await exporter(dateOfBirth, result);
      setExportError('');
    } catch {
      setExportError('The report could not be exported. Please try again.');
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          hasResult={Boolean(result)}
          onExportCsv={() => runExport(exportCalculationCsv)}
          onExportPdf={() => runExport(exportCalculationPdf)}
        />
        {exportError && <p className="export-error" role="status">{exportError}</p>}
        <Analytics
          dateOfBirth={dateOfBirth}
          onDateChange={setDateOfBirth}
          dateError={dateError}
          result={result}
        />
      </div>
    </div>
  );
}
