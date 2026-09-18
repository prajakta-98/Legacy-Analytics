import { lazy, Suspense } from 'react';
import { Crown, HeartPulse, Scale } from 'lucide-react';
import { DateSelector } from '../components/dashboard/DateSelector';
import { EmptyState } from '../components/dashboard/EmptyState';
import { FactorTable } from '../components/dashboard/FactorTable';
import { InsightPanel } from '../components/dashboard/InsightPanel';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { formatValue } from '../utils/formatting';

const FactorChart = lazy(() => import('../components/dashboard/FactorChart'));

export function Analytics({ dateOfBirth, onDateChange, dateError, result }) {
  return (
    <main className="dashboard-content">
      <DateSelector
        dateOfBirth={dateOfBirth}
        onDateChange={onDateChange}
        error={dateError}
        hasResult={Boolean(result)}
      />
      {result ? (
        <div className="analysis-content" key={dateOfBirth}>
          <section className="summary-grid" aria-label="Influence summary">
            <SummaryCard
              label="Mother's influence"
              value={formatValue(result.motherTotal)}
              detail="Combined allocation"
              icon={HeartPulse}
              variant="mother"
            />
            <SummaryCard
              label="Father's influence"
              value={formatValue(result.fatherTotal)}
              detail="Combined allocation"
              icon={Scale}
              variant="father"
            />
            <SummaryCard
              label="Dominant parent"
              value={result.dominantParent}
              detail={`${formatValue(result.difference)}% difference`}
              icon={Crown}
              variant="dominant"
            />
          </section>
          <FactorTable result={result} />
          <div className="lower-dashboard">
            <Suspense fallback={<section className="visualization-card chart-loading card">Loading comparison chart…</section>}>
              <FactorChart result={result} />
            </Suspense>
            <InsightPanel result={result} />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
