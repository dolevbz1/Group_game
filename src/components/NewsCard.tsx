import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import swimmingAnim from '../assets/swimming.json';
import electricAnim from '../assets/electric-power.json';
import { NEWS_ITEMS } from '../data/newsItems';
import './NewsCard.css';

type NewsCardProps = {
  onOpenDetails?: (id: string) => void;
};

export default function NewsCard({ onOpenDetails }: NewsCardProps) {
  const [items, setItems] = useState(NEWS_ITEMS);
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
      setItems((prev) => prev.filter((item) => item.id !== id));
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
                <button
                  type="button"
                  className="news-note-footer-btn text-small-normal"
                  onClick={() => onOpenDetails?.(item.id)}
                >
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
