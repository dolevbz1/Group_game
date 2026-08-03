import { useMemo, useState } from 'react';
import ContentPageHeader from '../../components/ContentPageHeader';
import SidePanel from '../../components/SidePanel';
import {
  ADMIN_POLLS,
  POLL_STATUS_LABELS,
  getPollLeadingOption,
  getPollTotalVotes,
  type AdminPoll,
  type PollStatus,
} from '../../data/contentAdminData';

type PollFilter = 'all' | PollStatus;

const FILTERS: Array<{ id: PollFilter; label: string }> = [
  { id: 'all', label: 'הכול' },
  { id: 'active', label: 'פעילים' },
  { id: 'scheduled', label: 'מתוזמנים' },
  { id: 'closed', label: 'נסגרו' },
  { id: 'draft', label: 'טיוטות' },
];

function PollResultsChart({ poll }: { poll: AdminPoll }) {
  const total = getPollTotalVotes(poll);

  return (
    <div className="content-poll-chart" aria-label={`תוצאות הסקר: ${poll.question}`}>
      {poll.options.map((option) => {
        const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
        return (
          <div key={option.id} className="content-poll-chart-row">
            <div className="content-poll-chart-meta">
              <span className="text-small-bold">{option.label}</span>
              <span className="text-tiny-normal">{option.votes.toLocaleString('he-IL')} קולות · {pct}%</span>
            </div>
            <div className="content-poll-chart-track" aria-hidden="true">
              <span className="content-poll-chart-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PollsContentView() {
  const [filter, setFilter] = useState<PollFilter>('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [polls, setPolls] = useState(ADMIN_POLLS);

  const visiblePolls = useMemo(
    () => polls.filter((poll) => filter === 'all' || poll.status === filter),
    [filter, polls]
  );

  const activePoll = polls.find((poll) => poll.status === 'active');
  const totalResponses = polls.reduce((sum, poll) => sum + getPollTotalVotes(poll), 0);
  const avgParticipation = Math.round(
    polls.filter((poll) => poll.participationPct > 0).reduce((sum, poll) => sum + poll.participationPct, 0) /
      Math.max(polls.filter((poll) => poll.participationPct > 0).length, 1)
  );

  const handleCreatePoll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const question = String(form.get('question') ?? '').trim();
    if (!question) return;

    setPolls((current) => [
      {
        id: `poll-${Date.now()}`,
        question,
        status: 'draft',
        options: [
          { id: 'a', label: 'אפשרות א׳', votes: 0 },
          { id: 'b', label: 'אפשרות ב׳', votes: 0 },
        ],
        endsLabel: 'לא נקבע',
        createdLabel: 'עכשיו',
        audienceLabel: String(form.get('audience') ?? 'כל התושבים'),
        participationPct: 0,
      },
      ...current,
    ]);
    setPanelOpen(false);
  };

  return (
    <div className="admin-view admin-view--content-section admin-view--content-polls">
      <ContentPageHeader
        title="הצבעות"
        subtitle="סקרים שמאפשרים לתושבים להשפיע — תצביע, תשפיע"
        ctaLabel="סקר חדש"
        onCta={() => setPanelOpen(true)}
      />

      <section className="content-summary" aria-label="סיכום סקרים">
        <div className="content-summary-item content-summary-item--polls">
          <strong className="text-h2-bold">{polls.filter((poll) => poll.status === 'active').length}</strong>
          <span className="text-small-normal">סקרים פעילים</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{totalResponses.toLocaleString('he-IL')}</strong>
          <span className="text-small-normal">סה״כ תשובות</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{avgParticipation}%</strong>
          <span className="text-small-normal">השתתפות ממוצעת</span>
        </div>
      </section>

      {activePoll && (
        <section className="content-feature-card content-feature-card--polls" aria-labelledby="active-poll-title">
          <div className="content-feature-card-head">
            <div>
              <p className="content-feature-eyebrow text-tiny-bold">סקר פעיל עכשיו</p>
              <h2 id="active-poll-title" className="text-small-bold">{activePoll.question}</h2>
              <p className="text-tiny-normal">
                {activePoll.audienceLabel} · {activePoll.endsLabel} · {getPollTotalVotes(activePoll).toLocaleString('he-IL')} הצבעות
              </p>
            </div>
            <span className="content-status content-status--active text-tiny-bold">{POLL_STATUS_LABELS.active}</span>
          </div>
          <PollResultsChart poll={activePoll} />
          <p className="content-feature-footnote text-tiny-normal">
            מוביל: {getPollLeadingOption(activePoll)?.label} ({activePoll.participationPct}% מהקהל הגיעו להצביע)
          </p>
        </section>
      )}

      <section className="content-card" aria-labelledby="polls-list-title">
        <div className="content-card-head">
          <div>
            <h2 id="polls-list-title" className="text-small-bold">כל הסקרים</h2>
            <p className="text-tiny-normal">{visiblePolls.length} סקרים בתצוגה</p>
          </div>
          <div className="content-filters" aria-label="סינון סקרים">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`content-filter text-tiny-bold${filter === item.id ? ' is-active' : ''}`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="content-table" role="table" aria-label="רשימת סקרים">
          <div className="content-table-row content-table-row--head text-tiny-bold" role="row">
            <span role="columnheader">שאלה</span>
            <span role="columnheader">סטטוס</span>
            <span role="columnheader">תשובות</span>
            <span role="columnheader">השתתפות</span>
            <span role="columnheader">סיום</span>
          </div>
          {visiblePolls.map((poll) => (
            <div key={poll.id} className="content-table-row" role="row">
              <div className="content-table-primary" role="cell">
                <strong className="text-small-bold">{poll.question}</strong>
                <span className="text-tiny-normal">{poll.audienceLabel} · {poll.createdLabel}</span>
              </div>
              <span className={`content-status content-status--${poll.status} text-tiny-bold`} role="cell">
                {POLL_STATUS_LABELS[poll.status]}
              </span>
              <span className="text-small-normal" role="cell">{getPollTotalVotes(poll).toLocaleString('he-IL')}</span>
              <span className="text-small-normal" role="cell">{poll.participationPct > 0 ? `${poll.participationPct}%` : '—'}</span>
              <span className="text-tiny-normal" role="cell">{poll.endsLabel}</span>
            </div>
          ))}
        </div>
      </section>

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="סקר חדש"
        subtitle="הסקר יופיע באפליקציית התושבים לאחר פרסום"
      >
        <form className="content-form" onSubmit={handleCreatePoll}>
          <label className="content-form-field">
            <span className="text-tiny-bold">שאלת הסקר</span>
            <input name="question" className="content-form-input text-small-normal" placeholder="למשל: מה נאכל בערב הורים?" required />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">קהל יעד</span>
            <select name="audience" className="content-form-input text-small-normal" defaultValue="כל התושבים">
              <option value="כל התושבים">כל התושבים</option>
              <option value="חברי מועדון הבריכה">חברי מועדון הבריכה</option>
              <option value="הורים לילדים">הורים לילדים</option>
            </select>
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">תאריך סיום</span>
            <input name="endDate" type="date" className="content-form-input text-small-normal" />
          </label>
          <div className="content-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost text-small-bold" onClick={() => setPanelOpen(false)}>
              ביטול
            </button>
            <button type="submit" className="admin-btn admin-btn--primary text-small-bold">
              שמירה כטיוטה
            </button>
          </div>
        </form>
      </SidePanel>
    </div>
  );
}
