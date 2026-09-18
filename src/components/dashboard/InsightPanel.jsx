import { ArrowRight, Info, Sparkles } from 'lucide-react';
import { formatValue } from '../../utils/formatting';

export function InsightPanel({ result }) {
  const otherParent = result.dominantParent === 'Mother' ? 'Father' : 'Mother';
  const dominantTotal = result.dominantParent === 'Mother' ? result.motherTotal : result.fatherTotal;
  const otherTotal = result.dominantParent === 'Mother' ? result.fatherTotal : result.motherTotal;

  return (
    <section className="insight-panel" aria-labelledby="insight-heading">
      <div className="insight-icon"><Sparkles size={20} aria-hidden="true" /></div>
      <div className="insight-main">
        <p className="eyebrow">Parental legacy insight</p>
        <h2 id="insight-heading">{result.dominantParent} has the higher overall legacy influence for this date.</h2>
        <p>
          The day-of-month rule assigns the higher aggregate to {result.dominantParent}. This is a local assessment calculation, not a scientific or medical finding.
        </p>
      </div>
      <div className="insight-values" aria-label="Influence totals">
        <div><span>{result.dominantParent}</span><strong>{formatValue(dominantTotal)}</strong></div>
        <ArrowRight size={16} aria-hidden="true" />
        <div><span>{otherParent}</span><strong>{formatValue(otherTotal)}</strong></div>
        <div className="difference"><Info size={14} aria-hidden="true" /><span>Difference</span><strong>{formatValue(result.difference)}</strong></div>
      </div>
    </section>
  );
}
