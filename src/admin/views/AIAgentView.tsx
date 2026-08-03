import { useState } from 'react';
import {
  TOPIC_STATS,
  AI_ADVICE,
  AI_ACTIVITY,
  SOURCE_LABELS,
  SOURCE_BREAKDOWN,
} from '../data/adminMockData';
import SourceBars from '../components/SourceBars';
import AIAdviceCard from '../components/AIAdviceCard';
import ResidentAIBotPreview from '../components/ResidentAIBotPreview';

export default function AIAgentView() {
  const [dismissedAdvice, setDismissedAdvice] = useState<string[]>([]);
  const visibleAdvice = AI_ADVICE.filter((a) => !dismissedAdvice.includes(a.id));

  return (
    <div className="admin-view">
      <header className="admin-view-header">
        <h1 className="admin-view-title text-h2-bold">סוכן AI</h1>
        <p className="admin-view-sub text-small-normal">
          מקורות מידע לסוכן · המלצות לפעולה
        </p>
      </header>

      <div className="admin-ai-split-row">
        <section className="admin-card admin-card--bars">
          <div className="admin-card-head">
            <div>
              <h2 className="admin-card-title text-medium-bold">מקורות מידע</h2>
              <p className="admin-card-sub text-tiny-normal">מאיפה מגיע המידע לסוכן</p>
            </div>
          </div>
          <SourceBars items={SOURCE_BREAKDOWN} />
          <div className="admin-widget-cta">
            <p className="admin-widget-cta-text text-tiny-normal">
              WhatsApp מספק 38% מהפניות — ודא שכל קבוצות השכונה מחוברות
            </p>
            <button type="button" className="admin-widget-cta-action text-tiny-bold">
              נהל מקורות
            </button>
          </div>
        </section>

        <section className="admin-card admin-card--bot-preview">
          <div className="admin-card-head">
            <div>
              <h2 className="admin-card-title text-medium-bold">תצוגת העוזר באפליקציה</h2>
              <p className="admin-card-sub text-tiny-normal">כפי שתושבים רואים בעוזר החכם</p>
            </div>
          </div>
          <ResidentAIBotPreview />
        </section>
      </div>

      <section className="admin-card admin-card--advice">
        <div className="admin-card-head">
          <h2 className="admin-card-title text-medium-bold">המלצות AI לפעולה</h2>
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

      <section className="admin-card admin-card--activity">
        <h2 className="admin-card-title text-medium-bold">יומן פעילות הסוכן</h2>
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
