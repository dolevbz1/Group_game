type SourceBar = {
  id: string;
  label: string;
  pct: number;
  color: string;
};

type SourceBarsProps = {
  items: SourceBar[];
};

export default function SourceBars({ items }: SourceBarsProps) {
  return (
    <ul className="admin-source-bars">
      {items.map((item) => (
        <li key={item.id} className="admin-source-bar">
          <div className="admin-source-bar-head">
            <span className="admin-source-bar-label text-tiny-normal">{item.label}</span>
            <span className="admin-source-bar-pct text-tiny-bold">{item.pct}%</span>
          </div>
          <div className="admin-source-bar-track">
            <div
              className="admin-source-bar-fill"
              style={{ width: `${item.pct}%`, background: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
