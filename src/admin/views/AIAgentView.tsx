import { useState } from 'react';
import {
  TOPIC_STATS,
  AI_ADVICE,
  AI_ACTIVITY,
  SOURCE_LABELS,
} from '../data/adminMockData';
import TopicStats from '../components/TopicStats';
import AIAdviceCard from '../components/AIAdviceCard';

export default function AIAgentView() {
  const [dismissedAdvice, setDismissedAdvice] = useState<string[]>([]);
  const visibleAdvice = AI_ADVICE.filter((a) => !dismissedAdvice.includes(a.id));

  return (
    <div className="admin-view">
      <header className="admin-view-header">
        <h1 className="admin-view-title text-h2-bold">סוכן AI</h1>
        <p className="admin-view-sub text-small-normal">
          נושאים שתושבים שואלים עליהם · המלצות לפעולה
        </p>
      </header>

      <div className="admin-ai-top-row">
        <section className="admin-card admin-card--topics">
          <div className="admin-card-head">
            <div>
              <h2 className="admin-card-title text-small-bold">נושאים נפוצים בשאלות</h2>
              <p className="admin-card-sub text-tiny-normal">7 ימים אחרונים · כל המקורות</p>
            </div>
            <span className="admin-card-pill text-tiny-bold">117 שאלות</span>
          </div>
          <TopicStats topics={TOPIC_STATS} />
          <p className="admin-topics-hint text-tiny-normal">
            נושאים עם עלייה חדה מסומנים — שקול לפרסם עדכון קבוע
          </p>
        </section>

        <section className="admin-card admin-card--advice">
          <div className="admin-card-head">
            <h2 className="admin-card-title text-small-bold">המלצות AI לפעולה</h2>
            <span className="admin-card-count text-tiny-bold">{visibleAdvice.length}</span>
          </div>
          <div className="admin-advice-list">
            {visibleAdvice.length === 0 ? (
              <p className="admin-empty text-small-normal">אין המלצות חדשות כרגע</p>
            ) : (
              visibleAdvice.map((advice) => (
                <AIAdviceCard
                  key={advice.id}
                  advice={advice}
                  onDismiss={() => setDismissedAdvice((ids) => [...ids, advice.id])}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <section className="admin-card admin-card--activity">
        <h2 className="admin-card-title text-small-bold">יומן פעילות הסוכן</h2>
        <p className="admin-card-sub text-tiny-normal">היום</p>
        <ul className="admin-activity-list">
          {AI_ACTIVITY.map((entry) => (
            <li key={entry.id} className="admin-activity-row">
              <span className="admin-activity-time text-tiny-normal">{entry.time}</span>
              <span className={`admin-activity-dot${entry.auto ? ' is-auto' : ' is-escalated'}`} aria-hidden="true" />
              <span className="admin-activity-action text-small-normal">{entry.action}</span>
              <span className="admin-activity-source text-tiny-normal">{SOURCE_LABELS[entry.source]}</span>
              <span className={`admin-activity-badge text-tiny-bold${entry.auto ? '' : ' is-escalated'}`}>
                {entry.auto ? 'אוטומטי' : 'הועלה'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
