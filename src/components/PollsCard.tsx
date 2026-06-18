import './PollsCard.css';

const LAST_POLL = {
  question: 'איפה למקם את מתקן הכושר החדש?',
  endedAt: 'הסתיים לפני יומיים',
  options: [
    { label: 'ליד הפארק המרכזי', votes: 142 },
    { label: 'בכניסה לשכונה', votes: 87 },
    { label: 'ליד בית הספר', votes: 64 },
  ],
};

export default function PollsCard() {
  const totalVotes = LAST_POLL.options.reduce((sum, option) => sum + option.votes, 0);
  const sortedResults = LAST_POLL.options
    .map((o) => ({
    label: o.label,
      votes: o.votes,
    pct: Math.round((o.votes / totalVotes) * 100),
    }))
    .sort((a, b) => b.votes - a.votes);
  const winner = sortedResults[0];
  const winnerRingBackground = `conic-gradient(#d8c5ff 0 ${winner.pct}%, rgba(216, 197, 255, 0.25) ${winner.pct}% 100%)`;

  return (
    <div className="polls-body" dir="rtl">
      <div className="poll-card">
        <div className="poll-head">
          <span className="poll-counter text-tiny-normal">
            הסקר האחרון בקהילה
          </span>
          <span className="poll-status text-tiny-normal">תוצאות סופיות</span>
        </div>
        <p className="poll-question text-medium-bold">{LAST_POLL.question}</p>

        <div className="poll-meta">
          <span className="poll-total text-tiny-normal">{totalVotes} הצביעו</span>
          <span className="poll-ended text-tiny-normal">{LAST_POLL.endedAt}</span>
        </div>

        <div className="poll-hero">
          <div className="poll-hero-copy">
            <span className="poll-hero-kicker text-tiny-bold">הבחירה המובילה</span>
            <p className="poll-hero-title text-medium-bold">{winner.label}</p>
            <p className="poll-hero-sub text-small-normal">
              {winner.votes} קולות מתוך {totalVotes}
            </p>
          </div>
          <div className="poll-hero-ring" style={{ background: winnerRingBackground }}>
            <span className="poll-hero-ring-value text-small-bold">{winner.pct}%</span>
          </div>
        </div>

        <div className="poll-results">
          {sortedResults.map((result, index) => (
            <div
              key={result.label}
              className={`poll-result-row${index === 0 ? ' is-winner' : ''}`}
            >
              <div className="poll-result-headline">
                <span className="poll-rank text-tiny-bold">#{index + 1}</span>
                <span className="poll-result-label text-small-normal">{result.label}</span>
                <span className="poll-result-pct text-small-bold">{result.pct}%</span>
              </div>
              <div className="poll-result-track">
                <span className="poll-result-fill" style={{ width: `${result.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="poll-next-wrap">
          <p className="poll-next-note text-tiny-normal">הקול שלך יקבע את הסקר הבא</p>
          <button type="button" className="poll-next-cta text-small-bold">
            להצביע בסקר הבא
          </button>
        </div>
      </div>
    </div>
  );
}
