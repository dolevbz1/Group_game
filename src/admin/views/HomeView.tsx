import type { InboxItem } from '../data/adminMockData';
import {
  METRICS,
  SOURCE_BREAKDOWN,
  AUTOMATION_SPLIT,
  generateHeatmapData,
} from '../data/adminMockData';
import InboxCard from '../components/InboxCard';
import MetricCard from '../components/MetricCard';
import SourceBars from '../components/SourceBars';
import ActivityHeatmap from '../components/ActivityHeatmap';

type HomeViewProps = {
  inbox: InboxItem[];
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
};

export default function HomeView({ inbox, onApprove, onDismiss }: HomeViewProps) {
  const pending = inbox.filter((i) => i.status !== 'handled');
  const urgent = pending.filter((i) => i.status === 'urgent');
  const heatmap = generateHeatmapData();

  return (
    <div className="admin-view">
      <header className="admin-view-header">
        <h1 className="admin-view-title text-h2-bold">תיבת פעולות</h1>
        <p className="admin-view-sub text-small-normal">
          {pending.length} ממתינים לאישורך · {urgent.length} דחופים
        </p>
      </header>

      <div className="admin-metrics-row">
        <MetricCard
          value={String(pending.length)}
          label="ממתין לאישורך"
          sub="דורשים את תשומת לבך"
          accent="urgent"
        />
        <MetricCard
          value={String(METRICS.autoHandledToday)}
          label="טופל אוטומטית היום"
          sub={`${AUTOMATION_SPLIT.autoPublished} עדכונים · ${AUTOMATION_SPLIT.autoClosed} סגירות`}
          accent="auto"
        />
        <MetricCard
          value={`${METRICS.engagementPct}%`}
          label="מעורבות קהילתית"
          sub="שבוע אחרון"
          accent="engage"
        />
      </div>

      <div className="admin-cards-row">
        <section className="admin-card admin-card--bars">
          <h2 className="admin-card-title text-small-bold">מקורות מידע</h2>
          <p className="admin-card-sub text-tiny-normal">מאיפה מגיע המידע לסוכן</p>
          <SourceBars items={SOURCE_BREAKDOWN} />
        </section>

        <section className="admin-card admin-card--split">
          <h2 className="admin-card-title text-small-bold">פירוק אוטומציה היום</h2>
          <div className="admin-split-stats">
            <div className="admin-split-stat">
              <span className="admin-split-value text-h2-bold">{AUTOMATION_SPLIT.autoPublished}</span>
              <span className="admin-split-label text-tiny-normal">עדכונים פורסמו</span>
            </div>
            <div className="admin-split-stat">
              <span className="admin-split-value text-h2-bold">{AUTOMATION_SPLIT.autoClosed}</span>
              <span className="admin-split-label text-tiny-normal">סקרים נסגרו</span>
            </div>
            <div className="admin-split-stat admin-split-stat--escalated">
              <span className="admin-split-value text-h2-bold">{AUTOMATION_SPLIT.escalated}</span>
              <span className="admin-split-label text-tiny-normal">הועברו אליך</span>
            </div>
          </div>
        </section>
      </div>

      <div className="admin-bottom-row">
        <section className="admin-card admin-card--inbox">
          <div className="admin-card-head">
            <h2 className="admin-card-title text-small-bold">תור לאישור</h2>
            <span className="admin-card-count text-tiny-bold">{pending.length}</span>
          </div>
          <div className="admin-inbox-list">
            {pending.length === 0 ? (
              <p className="admin-empty text-small-normal">הכול מעודכן — אין פריטים ממתינים 🎉</p>
            ) : (
              pending.map((item) => (
                <InboxCard
                  key={item.id}
                  item={item}
                  onApprove={() => onApprove(item.id)}
                  onDismiss={() => onDismiss(item.id)}
                />
              ))
            )}
          </div>
        </section>

        <section className="admin-card admin-card--heatmap">
          <h2 className="admin-card-title text-small-bold">פעילות קהילתית</h2>
          <p className="admin-card-sub text-tiny-normal">12 שבועות אחרונים</p>
          <ActivityHeatmap data={heatmap} />
        </section>
      </div>
    </div>
  );
}
