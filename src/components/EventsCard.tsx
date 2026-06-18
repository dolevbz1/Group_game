import Lottie from 'lottie-react';
import celebrationAnimation from '../assets/celebration.json';
import './EventsCard.css';

const WHITE = [1, 1, 1];

const celebrationWhite = {
  ...celebrationAnimation,
  layers: celebrationAnimation.layers.map((layer: any) =>
    layer.nm === 'control'
      ? {
          ...layer,
          ef: layer.ef.map((effect: any) => ({
            ...effect,
            ef: effect.ef.map((param: any) =>
              param.mn === 'ADBE Color Control-0001'
                ? { ...param, v: { ...param.v, k: WHITE } }
                : param
            ),
          })),
        }
      : layer
  ),
};

const EVENTS = [
  {
    id: 'community-evening',
    dayNum: '20',
    month: 'יוני',
    weekday: 'שישי',
    dateLabel: '20 ביוני ב־18:30',
    title: 'ערב קהילה – שיח תושבים עם הוועד המקומי',
  },
  {
    id: 'volunteer-day',
    dayNum: '28',
    month: 'יוני',
    weekday: 'שבת',
    dateLabel: '28 ביוני ב־09:00 בבוקר',
    title: 'יום התנדבות – טיפוח גינות ציבוריות',
  },
  {
    id: 'residents-meeting',
    dayNum: '05',
    month: 'יולי',
    weekday: 'שבת',
    dateLabel: '05 ביולי ב־10:00 בבוקר',
    title: 'אסיפת תושבים – תכנית הפיתוח הישובית',
  },
  {
    id: 'new-residents',
    dayNum: '18',
    month: 'יולי',
    weekday: 'שישי',
    dateLabel: '18 ביולי ב־17:00 אחה״צ',
    title: 'מפגש קבלת פנים לתושבים חדשים',
  },
];

const [closest, ...upcoming] = EVENTS;

export default function EventsCard() {
  return (
    <div className="events-body" dir="rtl">

      <div className="event-ticket">
        <div className="event-ticket-image">
          <div className="event-ticket-ticker" aria-hidden="true" dir="ltr">
            <div className="event-ticket-ticker-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="event-ticket-ticker-segment">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="event-ticket-ticker-unit">
                      <span className="event-ticket-ticker-text">האירוע הקרוב</span>
                      <Lottie
                        animationData={celebrationWhite}
                        loop
                        autoplay
                        className="event-ticket-ticker-lottie"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="event-ticket-notch" aria-hidden="true">
          <div className="event-ticket-notch-circle" />
          <div className="event-ticket-notch-circle" />
        </div>

        <div className="event-ticket-content">
          <div className="event-ticket-row">
            <div className="event-ticket-date-badge">
              <span className="event-ticket-date-num">{closest.dayNum}</span>
              <span className="event-ticket-date-month">{closest.month}</span>
            </div>
            <div className="event-ticket-info">
              <p className="event-ticket-title text-medium-bold">{closest.title}</p>
              <p className="event-ticket-meta text-small-normal">{closest.weekday}, {closest.dateLabel}</p>
            </div>
          </div>
        </div>

        <div className="event-ticket-divider" aria-hidden="true" />

        <button type="button" className="event-ticket-cta text-medium-normal">
          לפרטים והרשמה
        </button>
      </div>

      <p className="events-agenda-label text-medium-normal">בהמשך חודש אפריל</p>

      <div className="events-agenda">
        {upcoming.map((ev, i) => (
          <div key={ev.id} className="event-row">
            <div className="event-date">
              <span className="event-date-day text-small-bold">{ev.dayNum}</span>
              <span className="event-date-weekday text-tiny-normal">{ev.month}</span>
            </div>
            <div className="event-track">
              <span className="event-track-dot" />
              {i < upcoming.length - 1 && <span className="event-track-line" />}
            </div>
            <div className="event-info">
              <p className="event-title text-medium-bold">{ev.title}</p>
              <p className="event-meta text-small-normal">{ev.weekday}, {ev.dateLabel}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
