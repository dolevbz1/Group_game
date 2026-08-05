import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import checkRevealAnim from '../assets/gate-check-reveal.json';
import { overridePrimaryColor, INK } from '../utils/lottieColor';
import type { VolunteerRequest } from '../data/volunteerRequests';
import './VolunteerHelpSheet.css';

const CHECK_REVEAL_SEGMENT: [number, number] = [0, 60];
const CHECK_ANIM = overridePrimaryColor(checkRevealAnim, INK);

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.828V2" />
    </svg>
  );
}

type Step = 'confirm' | 'done';

type VolunteerHelpSheetProps = {
  request: VolunteerRequest | null;
  step: Step;
  onConfirm: () => void;
  onClose: () => void;
  onAddToCalendar: () => void;
};

export default function VolunteerHelpSheet({
  request,
  step,
  onConfirm,
  onClose,
  onAddToCalendar,
}: VolunteerHelpSheetProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const open = request !== null;

  useEffect(() => {
    if (open) {
      setRender(true);
      const timer = window.setTimeout(() => setVisible(true), 16);
      return () => window.clearTimeout(timer);
    }
    if (!render) return;
    setVisible(false);
    const timer = window.setTimeout(() => setRender(false), 380);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onClose]);

  if (!render || !request) return null;

  return (
    <div className={`volunteer-help-root${visible ? ' is-open' : ''}`} aria-hidden={!visible}>
      <button type="button" className="volunteer-help-backdrop" onClick={onClose} aria-label="סגירה" />
      <div
        className={`volunteer-help-sheet${step === 'done' ? ' is-done' : ''}`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label={step === 'confirm' ? 'אישור עזרה' : 'העזרה נקבעה'}
      >
        <div className="volunteer-help-handle" aria-hidden="true" />

        {step === 'confirm' ? (
          <>
            <div className="volunteer-help-person">
              <span className="volunteer-help-avatar" aria-hidden="true">
                <Lottie
                  animationData={request.avatarAnimation}
                  loop={false}
                  autoplay
                  className="volunteer-help-avatar-lottie"
                />
              </span>
              <div className="volunteer-help-copy">
                <h2 className="volunteer-help-title text-h2-bold">לעזור ל{request.name}?</h2>
                <p className="volunteer-help-task text-medium-normal">{request.task}</p>
              </div>
            </div>

            <dl className="volunteer-help-meta text-small-normal">
              <div>
                <dt><ClockIcon /> מתי</dt>
                <dd>{request.availability}</dd>
              </div>
              <div>
                <dt><HourglassIcon /> משך</dt>
                <dd>בערך {request.duration}</dd>
              </div>
            </dl>

            <p className="volunteer-help-note text-small-normal">
              אחרי האישור {request.name} יידע/תדע שאתם בדרך, ותוכלו להוסיף את הפגישה ליומן שלכם.
            </p>

            <button type="button" className="volunteer-help-cta volunteer-help-cta--primary text-medium-bold" onClick={onConfirm}>
              כן אני מאשר
            </button>
            <button type="button" className="volunteer-help-cta volunteer-help-cta--secondary text-medium-bold" onClick={onClose}>
              לא כרגע
            </button>
          </>
        ) : (
          <>
            <div className="volunteer-help-success-icon" aria-hidden="true">
              <Lottie
                animationData={CHECK_ANIM}
                loop={false}
                autoplay
                initialSegment={CHECK_REVEAL_SEGMENT}
                className="volunteer-help-success-lottie"
              />
            </div>
            <h2 className="volunteer-help-title text-h2-bold">קבעתם! {request.name} כבר מחכה לכם</h2>
            <p className="volunteer-help-sub text-small-normal">
              {request.availability} · בערך {request.duration}
            </p>

            <button
              type="button"
              className="volunteer-help-cta volunteer-help-cta--primary text-medium-bold"
              onClick={onAddToCalendar}
            >
              הוספה ליומן גוגל
            </button>
            <button type="button" className="volunteer-help-cta volunteer-help-cta--secondary text-medium-bold" onClick={onClose}>
              סגירה
            </button>
          </>
        )}
      </div>
    </div>
  );
}
