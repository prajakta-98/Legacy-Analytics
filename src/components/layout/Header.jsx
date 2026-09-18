import { Download, FileDown, LockKeyhole } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header({ theme, onToggleTheme, hasResult, onExportCsv, onExportPdf }) {
  return (
    <header className="app-header">
      <div className="header-title-block">
        <p className="eyebrow">Dynamic Analysis Logic</p>
        <h1>Parental Legacy &amp; Life Factors</h1>
        <p className="header-description">
          A local, deterministic view of maternal and paternal influence distribution.
        </p>
      </div>
      <div className="header-actions">
        <span className="local-note"><LockKeyhole size={14} aria-hidden="true" /> Local only</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Button className="button-quiet" disabled={!hasResult} onClick={onExportCsv}>
          <Download size={16} aria-hidden="true" /> <span>CSV</span>
        </Button>
        <Button className="button-primary" disabled={!hasResult} onClick={onExportPdf}>
          <FileDown size={16} aria-hidden="true" /> <span>Export PDF</span>
        </Button>
      </div>
    </header>
  );
}
