import { CalendarDays, CircleAlert, CheckCircle2 } from 'lucide-react';
import { formatDateOfBirth, getTodayIsoDate } from '../../utils/dateUtils';

export function DateSelector({ dateOfBirth, onDateChange, error, hasResult }) {
  const status = error ? 'error' : hasResult ? 'valid' : 'empty';
  return (
    <section className="date-selector card" aria-labelledby="date-selector-title">
      <div className="date-selector-copy">
        <div className="section-icon"><CalendarDays size={18} aria-hidden="true" /></div>
        <div>
          <p className="eyebrow">Analysis input</p>
          <h2 id="date-selector-title">Candidate date of birth</h2>
          <p>Changing this date refreshes the distribution immediately.</p>
        </div>
      </div>
      <div className="date-control-group">
        <label htmlFor="date-of-birth">Date of birth</label>
        <input
          id="date-of-birth"
          className={`date-input date-input-${status}`}
          type="date"
          value={dateOfBirth}
          max={getTodayIsoDate()}
          onChange={(event) => onDateChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby="date-status"
        />
        <p id="date-status" className={`date-status date-status-${status}`} aria-live="polite">
          {error && <CircleAlert size={15} aria-hidden="true" />}
          {hasResult && !error && <CheckCircle2 size={15} aria-hidden="true" />}
          {error || (hasResult ? `Selected: ${formatDateOfBirth(dateOfBirth)}` : 'Choose a valid past date to begin.')}
        </p>
      </div>
    </section>
  );
}
