import { formatValue } from '../../utils/formatting';

export function FactorTable({ result }) {
  return (
    <section className="table-card card" aria-labelledby="factor-table-heading">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Detailed distribution</p>
          <h2 id="factor-table-heading">Life factor breakdown</h2>
        </div>
        <span className="calculation-badge">Normalized to 100.000</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Life factor</th>
              <th scope="col" className="mother-column">Mother influence</th>
              <th scope="col" className="father-column">Father influence</th>
              <th scope="col">Total combined</th>
            </tr>
          </thead>
          <tbody>
            {result.factors.map((factor, index) => (
              <tr key={factor.id}>
                <td className="row-number">{String(index + 1).padStart(2, '0')}</td>
                <th scope="row">{factor.name}</th>
                <td className="mother-value">{formatValue(factor.mother)}</td>
                <td className="father-value">{formatValue(factor.father)}</td>
                <td>{formatValue(factor.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2" scope="row">Total</th>
              <td className="mother-value">{formatValue(result.motherTotal)}</td>
              <td className="father-value">{formatValue(result.fatherTotal)}</td>
              <td>{formatValue(result.grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
