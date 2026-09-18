import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatValue } from '../../utils/formatting';

const MOTHER_COLOR = '#f281c9';
const FATHER_COLOR = '#64c9ff';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatValue(entry.value)}
        </span>
      ))}
    </div>
  );
}

export default function FactorChart({ result }) {
  const chartData = result.factors.map((factor) => ({
    name: factor.name,
    Mother: factor.mother,
    Father: factor.father,
  }));
  const pieData = [
    { name: 'Mother', value: result.motherTotal, color: MOTHER_COLOR },
    { name: 'Father', value: result.fatherTotal, color: FATHER_COLOR },
  ];

  return (
    <section className="visualization-card card" aria-labelledby="comparison-heading">
      <div className="section-heading-row visualization-heading">
        <div>
          <p className="eyebrow">Visual comparison</p>
          <h2 id="comparison-heading">Influence by life factor</h2>
        </div>
        <p className="chart-caption">Values update with each valid date.</p>
      </div>
      <div className="chart-grid">
        <div className="bar-chart-wrap" role="img" aria-label="Grouped bar chart comparing Mother and Father influence across seven life factors">
          <ResponsiveContainer width="100%" height={342}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 2, right: 16, bottom: 2, left: 0 }} barCategoryGap="20%">
              <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-label)', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={144}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--chart-label)', fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--chart-hover)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: 'var(--text-muted)' }} />
              <Bar dataKey="Mother" fill={MOTHER_COLOR} radius={[0, 5, 5, 0]} maxBarSize={14} />
              <Bar dataKey="Father" fill={FATHER_COLOR} radius={[0, 5, 5, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-panel">
          <p className="donut-label">Overall balance</p>
          <div className="donut-chart" role="img" aria-label={`Overall total: Mother ${formatValue(result.motherTotal)}, Father ${formatValue(result.fatherTotal)}`}>
            <ResponsiveContainer width="100%" height={174}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={53}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="transparent"
                  isAnimationActive
                >
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatValue(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center"><strong>100</strong><span>Total</span></div>
          </div>
          <div className="donut-key"><span><i className="mother-dot" />Mother <b>{formatValue(result.motherTotal)}</b></span><span><i className="father-dot" />Father <b>{formatValue(result.fatherTotal)}</b></span></div>
        </div>
      </div>
    </section>
  );
}
