import { CalendarPlus, ShieldCheck, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <section className="empty-state card" aria-labelledby="empty-state-heading">
      <div className="empty-orbit empty-orbit-one" aria-hidden="true" />
      <div className="empty-orbit empty-orbit-two" aria-hidden="true" />
      <div className="empty-icon"><CalendarPlus size={28} aria-hidden="true" /></div>
      <p className="eyebrow">Ready when you are</p>
      <h2 id="empty-state-heading">Select a date of birth</h2>
      <p>Choose a valid date to generate the parental legacy analysis and explore the seven life factors.</p>
      <div className="empty-state-notes">
        <span><Sparkles size={15} aria-hidden="true" /> Deterministic results</span>
        <span><ShieldCheck size={15} aria-hidden="true" /> Private to this device</span>
      </div>
    </section>
  );
}
