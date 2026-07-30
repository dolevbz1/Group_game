import { useEffect } from 'react';
import Lottie from 'lottie-react';
import checkRevealAnim from '../assets/gate-check-reveal.json';
import { overridePrimaryColor, INK } from '../utils/lottieColor';
import './ReportNewsSuccessModal.css';

const CHECK_REVEAL_SEGMENT: [number, number] = [0, 60];
const CHECK_ANIM = overridePrimaryColor(checkRevealAnim, INK);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ReportNewsSuccessModal({ open, onClose }: Props) {
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
      <div className="report-news-success-sheet" dir="rtl" role="dialog" aria-label="העדכון הועלה בהצלחה">
        <div className="report-news-success-icon" aria-hidden="true">
          <Lottie
            animationData={CHECK_ANIM}
            loop={false}
            autoplay
            initialSegment={CHECK_REVEAL_SEGMENT}
            className="report-news-success-lottie"
          />
        </div>
        <h2 className="report-news-success-title text-h3-bold">העדכון הועלה בהצלחה!</h2>
        <p className="report-news-success-sub text-small-normal">
          תודה טל, עזרת לקהילה להתפתח ולהשאר מעודכנת :)
        </p>
        <button type="button" className="btn-cta report-news-success-close text-medium-bold" onClick={onClose}>
          סגירה
        </button>
      </div>
    </div>
  );
}
