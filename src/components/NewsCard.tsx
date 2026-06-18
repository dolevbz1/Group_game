import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import swimmingAnim from '../assets/swimming.json';
import noEntryAnim from '../assets/no-entry.json';
import electricAnim from '../assets/electric-power.json';
import snakeAnim from '../assets/snake.json';
import './NewsCard.css';

const INITIAL_NEWS = [
  {
    id: 'street',
    noteClass: 'is-folder-frame',
    scatterClass: 'note-scatter-1',
    urgent: true,
    label: 'דחוף · הרחוב שלך',
    time: 'עכשיו',
    color: '#FFD4A8',
    pin: '#FF9F45',
    anim: noEntryAnim,
    loopAnim: true,
    emoji: '🚗',
    title: 'רחוב האלון יחסם מחר לעבודות בניה',
    desc: 'בין 7:00–14:00 · הזיזו את הרכב מהרחוב עד הבוקר',
  },
  {
    id: 'pool',
    noteClass: 'is-pinned',
    scatterClass: 'note-scatter-2',
    label: '✨ כי אתם חברי מועדון הבריכה',
    time: 'לפני שעתיים',
    color: '#C3ECF6',
    pin: '#4FC3E8',
    hasLottie: true,
    emoji: '🏊',
    title: 'שעות הבריכה לקיץ עודכנו!',
    desc: 'הבריכה הקהילתית פתוחה כעת עד 21:00 בכל ימות השבוע. בואו להתרענן!',
  },
  {
    id: 'snake',
    noteClass: 'is-pinned is-pinned-inset',
    scatterClass: 'note-scatter-3',
    urgent: true,
    label: 'עדכון שכונתי · כללי',
    time: 'לפני 3 שעות',
    color: '#D4F5D4',
    pin: '#5BBF5B',
    anim: snakeAnim,
    loopAnim: true,
    emoji: '🐍',
    title: 'נחש צפע בכניסה לאולם הספורט',
    desc: 'תיאור פלייסהולדר לכרטיס החדש. ניתן להחליף בתוכן אמיתי בהמשך.',
  },
  {
    id: 'movie',
    noteClass: 'is-folder-frame',
    scatterClass: 'note-scatter-4',
    label: '🎬 כי נהניתם בערב הקולנוע הקודם',
    time: 'לפני 1 יום',
    color: '#D8C5FF',
    pin: '#9B7BE8',
    hasElectricLottie: true,
    emoji: '🎬',
    title: 'הפסקת חשמל מתוכננת ל 25/04 בין 09:00 - 13:00',
    desc: 'הצטרפו אלינו לערב סרטים מיוחד בפארק השכונתי, כניסה חופשית לכל התושבים',
  },
];

export default function NewsCard() {
  const [items, setItems] = useState(INITIAL_NEWS);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const lottieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const electricRef = useRef<LottieRefCurrentProps>(null);
  const electricTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLottieComplete = () => {
    lottieTimerRef.current = setTimeout(() => {
      lottieRef.current?.goToAndPlay(0);
    }, 2000);
  };

  const handleElectricComplete = () => {
    electricTimerRef.current = setTimeout(() => {
      electricRef.current?.goToAndPlay(0);
    }, 2000);
  };

  const handleDismiss = (id: string) => {
    if (dismissingId) return;
    setDismissingId(id);
    dismissTimerRef.current = setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id));
      setDismissingId(null);
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (lottieTimerRef.current) clearTimeout(lottieTimerRef.current);
      if (electricTimerRef.current) clearTimeout(electricTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="news-empty" dir="rtl">
        <span className="news-empty-emoji">🎉</span>
        <p className="news-empty-text text-small-normal">אין עדכונים חדשים, הכול מעודכן!</p>
      </div>
    );
  }

  return (
    <div className="news-board" dir="rtl">
      {items.map((item) => {
        const isDismissing = dismissingId === item.id;
        return (
          <div
            key={item.id}
            className={`news-note-wrap${isDismissing ? ' is-collapsing' : ''}`}
          >
          <article
            className={`news-note ${item.noteClass} ${item.scatterClass}${item.urgent ? ' is-urgent' : ''}${isDismissing ? ' is-dismissing' : ''}`}
          >
            <div className="news-note-body">
              <div className="news-note-visual">
                {item.loopAnim ? (
                  <Lottie animationData={item.anim} loop className="news-note-lottie" />
                ) : item.hasLottie ? (
                  <Lottie
                    animationData={swimmingAnim}
                    loop={false}
                    lottieRef={lottieRef}
                    onComplete={handleLottieComplete}
                    className="news-note-lottie"
                  />
                ) : item.hasElectricLottie ? (
                  <Lottie
                    animationData={electricAnim}
                    loop={false}
                    lottieRef={electricRef}
                    onComplete={handleElectricComplete}
                    className="news-note-lottie"
                  />
                ) : (
                  <span className="news-note-emoji">{item.emoji}</span>
                )}
              </div>
              <div className="news-note-text">
                <p className="news-note-title text-medium-bold">{item.title}</p>
                <p className="news-note-timestamp text-tiny-normal">{item.time}</p>
              </div>
            </div>
            <footer className="news-note-footer">
              <button type="button" className="news-note-footer-btn text-small-normal">
                לפרטים נוספים
              </button>
              <button
                type="button"
                className="news-note-footer-btn news-note-footer-btn--cta text-small-normal"
                onClick={() => handleDismiss(item.id)}
                disabled={!!dismissingId}
              >
                <span className="news-note-footer-icon" aria-hidden="true">✓</span>
                סבבה
              </button>
            </footer>
          </article>
          </div>
        );
      })}
    </div>
  );
}
