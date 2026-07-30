import { useState } from 'react';
import {
  RESIDENT_ENGAGEMENT_LABELS,
  type Resident,
} from '../data/residentsMockData';

type ResidentPanelContentProps = {
  resident: Resident;
};

export default function ResidentPanelContent({ resident }: ResidentPanelContentProps) {
  const [followUpCreated, setFollowUpCreated] = useState(false);

  return (
    <div className="resident-panel-content">
      <div className="resident-panel-identity">
        <div className={`resident-avatar resident-avatar--${resident.engagement}`} aria-hidden="true">
          {resident.initials}
        </div>
        <div>
          <p className="resident-panel-address text-small-bold">
            {resident.street} {resident.houseNumber}
          </p>
          <p className="resident-panel-meta text-tiny-normal">
            {resident.verified ? 'פרטים מאומתים' : 'פרטים דורשים אימות'} · תושב/ת מאז {resident.joinedAt}
          </p>
        </div>
      </div>

      <div className="resident-panel-actions">
        <a className="admin-btn admin-btn--primary text-small-bold" href={`mailto:${resident.email}`}>
          שליחת הודעה
        </a>
        <a className="admin-btn admin-btn--ghost text-small-normal" href={`tel:${resident.phone}`}>
          התקשרות
        </a>
      </div>

      {resident.openItems.length > 0 && (
        <section className="resident-panel-section resident-panel-attention">
          <div className="resident-panel-section-head">
            <h3 className="text-small-bold">דורש תשומת לב</h3>
            <span className="resident-panel-count text-tiny-bold">{resident.openItems.length}</span>
          </div>
          <ul className="resident-panel-list">
            {resident.openItems.map((item) => (
              <li key={item} className="text-small-normal">{item}</li>
            ))}
          </ul>
          <button
            type="button"
            className="admin-btn admin-btn--primary resident-followup-btn text-small-bold"
            onClick={() => setFollowUpCreated(true)}
            disabled={followUpCreated}
          >
            {followUpCreated ? 'משימת מעקב נוספה' : 'יצירת משימת מעקב'}
          </button>
        </section>
      )}

      {resident.importantNote && (
        <section className="resident-panel-section resident-panel-note">
          <h3 className="text-small-bold">חשוב לדעת</h3>
          <p className="text-small-normal">{resident.importantNote}</p>
        </section>
      )}

      <section className="resident-panel-stats" aria-label="נתוני תושב">
        <div>
          <span className="resident-panel-stat-value text-h3-bold">{resident.engagementScore}</span>
          <span className="text-tiny-normal">מדד מעורבות</span>
        </div>
        <div>
          <span className="resident-panel-stat-value text-h3-bold">{resident.householdSize}</span>
          <span className="text-tiny-normal">במשק הבית</span>
        </div>
        <div>
          <span className="resident-panel-stat-value text-h3-bold">{resident.lastActiveLabel}</span>
          <span className="text-tiny-normal">פעילות אחרונה</span>
        </div>
      </section>

      <p className="resident-panel-score-note text-tiny-normal">
        מדד המעורבות הוא כלי עזר המבוסס על פעילות באפליקציה ואינו הערכה אישית.
      </p>

      <section className="resident-panel-section">
        <h3 className="text-small-bold">פרטי קשר והעדפות</h3>
        <dl className="resident-panel-details">
          <div>
            <dt className="text-tiny-normal">טלפון</dt>
            <dd className="text-small-normal">{resident.phone}</dd>
          </div>
          <div>
            <dt className="text-tiny-normal">מייל</dt>
            <dd className="text-small-normal">{resident.email}</dd>
          </div>
          <div>
            <dt className="text-tiny-normal">ערוץ מועדף</dt>
            <dd className="text-small-normal">{resident.preferredChannel}</dd>
          </div>
          <div>
            <dt className="text-tiny-normal">הופעה במדריך</dt>
            <dd className="text-small-normal">{resident.directoryOptIn ? 'אושר על ידי התושב/ת' : 'לא אושר'}</dd>
          </div>
        </dl>
      </section>

      <section className="resident-panel-section">
        <h3 className="text-small-bold">תחומי עניין</h3>
        <div className="resident-panel-interests">
          {resident.interests.map((interest) => (
            <span key={interest} className="resident-panel-interest text-tiny-normal">{interest}</span>
          ))}
        </div>
      </section>

      <section className="resident-panel-section">
        <div className="resident-panel-section-head">
          <h3 className="text-small-bold">פעילות אחרונה</h3>
          <span className="text-tiny-normal">
            {RESIDENT_ENGAGEMENT_LABELS[resident.engagement]} מעורבות
          </span>
        </div>
        <ol className="resident-timeline">
          {resident.recentActions.map((action) => (
            <li key={action.id} className="resident-timeline-item">
              <span className={`resident-timeline-dot tone-${action.tone}`} aria-hidden="true" />
              <div>
                <p className="text-small-normal">{action.title}</p>
                <p className="resident-panel-meta text-tiny-normal">{action.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
