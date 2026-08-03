type MetricCardProps = {
  value: string;
  label: string;
  sub: string;
  accent: 'urgent' | 'auto' | 'engage';
};

export default function MetricCard({ value, label, sub, accent }: MetricCardProps) {
  return (
    <div className={`admin-metric admin-metric--${accent}`}>
      <span className="admin-metric-value">{value}</span>
      <span className="admin-metric-label text-small-bold">{label}</span>
      <span className="admin-metric-sub text-tiny-normal">{sub}</span>
    </div>
  );
}
