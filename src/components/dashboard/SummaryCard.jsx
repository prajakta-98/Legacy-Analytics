export function SummaryCard({ label, value, detail, icon: Icon, variant = 'neutral' }) {
  return (
    <article className={`summary-card summary-card-${variant}`}>
      <div className="summary-card-top">
        <span>{label}</span>
        <span className="summary-icon"><Icon size={19} aria-hidden="true" /></span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
