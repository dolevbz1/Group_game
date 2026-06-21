const LEVEL_COLORS = [
  'var(--admin-heat-0)',
  'var(--admin-heat-1)',
  'var(--admin-heat-2)',
  'var(--admin-heat-3)',
  'var(--admin-heat-4)',
];

const DAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

type ActivityHeatmapProps = {
  data: number[][];
};

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  return (
    <div className="admin-heatmap">
      <div className="admin-heatmap-days">
        {DAY_LABELS.map((d) => (
          <span key={d} className="admin-heatmap-day text-tiny-normal">{d}</span>
        ))}
      </div>
      <div className="admin-heatmap-grid">
        {data.map((week, wi) => (
          <div key={wi} className="admin-heatmap-week">
            {week.map((level, di) => (
              <span
                key={di}
                className="admin-heatmap-cell"
                style={{ background: LEVEL_COLORS[level] }}
                title={`רמה ${level}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="admin-heatmap-legend">
        <span className="text-tiny-normal">פחות</span>
        {LEVEL_COLORS.map((color, i) => (
          <span key={i} className="admin-heatmap-legend-cell" style={{ background: color }} />
        ))}
        <span className="text-tiny-normal">יותר</span>
      </div>
    </div>
  );
}
