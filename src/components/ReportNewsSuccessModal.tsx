import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import clockHoverAnim from '../assets/clock-hover.json';
import { overridePrimaryColor, BLACK } from '../utils/lottieColor';
import './ReportNewsSuccessModal.css';

const CLOCK_HOVER_SEGMENT: [number, number] = [0, 60];
const CLOCK_REPLAY_DELAY_MS = 1000;
const CLOCK_ANIM = overridePrimaryColor(clockHoverAnim, BLACK);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ReportNewsSuccessModal({ open, onClose }: Props) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReplayTimer = () => {
    if (!replayTimerRef.current) return;
    clearTimeout(replayTimerRef.current);
    replayTimerRef.current = null;
  };

  const playClock = () => {
    lottieRef.current?.playSegments(CLOCK_HOVER_SEGMENT, false);
  };

  const scheduleReplay = () => {
    clearReplayTimer();
    replayTimerRef.current = setTimeout(() => {
      replayTimerRef.current = null;
      playClock();
    }, CLOCK_REPLAY_DELAY_MS);
  };

  useEffect(() => {
    if (!open) {
      clearReplayTimer();
      return;
    }
    playClock();
    return clearReplayTimer;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div className={`report-news-success-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="report-news-success-backdrop" onClick={onClose} />
      <div className="report-news-success-sheet" dir="rtl" role="dialog" aria-label="העדכון בתהליך אישור עם וועדת בטחון">
        <div className="report-news-success-icon" aria-hidden="true">
          <Lottie
            lottieRef={lottieRef}
            animationData={CLOCK_ANIM}
            loop={false}
            autoplay={false}
            initialSegment={CLOCK_HOVER_SEGMENT}
            onDOMLoaded={playClock}
            onComplete={scheduleReplay}
            className="report-news-success-lottie"
          />
        </div>
        <h2 className="report-news-success-title text-h3-bold">העדכון בתהליך אישור עם וועדת בטחון</h2>
        <p className="report-news-success-sub text-small-normal">
          נעדכן אותך ברגע שהעדכון יאושר ויעלה לשאר התושבים
        </p>
        <button type="button" className="btn-cta report-news-success-close text-medium-bold" onClick={onClose}>
          סגירה
        </button>
      </div>
    </div>
  );
}
