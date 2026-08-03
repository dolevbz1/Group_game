import type { InboxItem } from '../data/adminMockData';
import {
  METRICS,
  AUTOMATION_SPLIT,
  TOPIC_STATS,
} from '../data/adminMockData';
import InboxCard from '../components/InboxCard';
import MetricCard from '../components/MetricCard';
import TopicStats from '../components/TopicStats';
import AdminCalendarWidget from '../components/AdminCalendarWidget';

type HomeViewProps = {
  inbox: InboxItem[];
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
};

export default function HomeView({ inbox, onApprove, onDismiss }: HomeViewProps) {
  const pending = inbox.filter((i) => i.status !== 'handled');
  const urgent = pending.filter((i) => i.status === 'urgent');

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
        <section className="admin-card admin-card--topics">
          <div className="admin-card-head">
            <div>
              <h2 className="admin-card-title text-medium-bold">נושאים נפוצים בשאלות</h2>
              <p className="admin-card-sub text-tiny-normal">7 ימים אחרונים · כל המקורות</p>
            </div>
            <span className="admin-card-pill text-tiny-bold">117 שאלות</span>
          </div>
          <TopicStats topics={TOPIC_STATS} />
          <div className="admin-widget-cta">
            <p className="admin-widget-cta-text text-tiny-normal">
              34 תושבים שאלו על שעות הבריכה השבוע — פרסום עדכון יפחית פניות חוזרות
            </p>
            <button type="button" className="admin-widget-cta-action text-tiny-bold">
              צור עדכון
            </button>
          </div>
        </section>

        <AdminCalendarWidget />
      </div>

      <section className="admin-card admin-card--inbox">
        <div className="admin-card-head">
          <h2 className="admin-card-title text-medium-bold">תור לאישור</h2>
          <span className="admin-card-count text-tiny-bold">{pending.length}</span>
        </div>
        <div className="admin-inbox-list">
          {pending.length === 0 ? (
            <p className="admin-empty text-small-normal">הכול מעודכן — אין פריטים ממתינים 🎉</p>
          ) : (
            pending.map((item, index) => (
              <InboxCard
                key={item.id}
                item={item}
                defaultExpanded={index === 0}
                onApprove={() => onApprove(item.id)}
                onDismiss={() => onDismiss(item.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
