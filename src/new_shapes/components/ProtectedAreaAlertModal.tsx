import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import alertLoopAnim from '../assets/alert-loop-cycle.json';
import { overridePrimaryColor } from '../utils/lottieColor';
import './ProtectedAreaAlertModal.css';

const URGENT_RED: number[] = [255 / 255, 66 / 255, 8 / 255, 1];
const ALERT_ANIM = overridePrimaryColor(alertLoopAnim, URGENT_RED);

type View = 'alert' | 'help';

type Props = {
  open: boolean;
  onConfirm: () => void;
};

export default function ProtectedAreaAlertModal({ open, onConfirm }: Props) {
  const [view, setView] = useState<View>('alert');
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setView('alert');
      return;
    }
    const timer = window.setTimeout(() => confirmRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [open, view]);

  return (
    <div className={`protected-area-alert-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="protected-area-alert-backdrop" />
      <div
        className="protected-area-alert-sheet"
        dir="rtl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="protected-area-alert-title"
        aria-describedby="protected-area-alert-desc"
      >
        {view === 'alert' ? (
          <>
            <div className="protected-area-alert-icon" aria-hidden="true">
              <Lottie
                animationData={ALERT_ANIM}
                loop
                autoplay
                className="protected-area-alert-lottie"
              />
            </div>
            <p className="protected-area-alert-badge text-tiny-bold">התרעה פעילה</p>
            <h2 id="protected-area-alert-title" className="protected-area-alert-title text-h2-bold">
              כניסה לשטח מוגן
            </h2>
            <p id="protected-area-alert-desc" className="protected-area-alert-sub text-medium-normal">
              גשו מיד למרחב המוגן הקרוב. אשרו לאחר שנכנסתם למקום מוגן.
            </p>
            <button
              ref={confirmRef}
              type="button"
              className="btn-cta protected-area-alert-confirm text-medium-bold"
              onClick={onConfirm}
            >
              אני במרחב המוגן
            </button>
            <button
              type="button"
              className="btn-secondary protected-area-alert-help text-medium-normal"
              onClick={() => setView('help')}
            >
              אני צריך עזרה
            </button>
          </>
        ) : (
          <>
            <h2 id="protected-area-alert-title" className="protected-area-alert-title text-h2-bold">
              הנחיות בטיחות
            </h2>
            <p id="protected-area-alert-desc" className="protected-area-alert-sub text-medium-normal">
              שמרו על גובה נמוך, התרחקו מחלונות ופעלו לפי הנחיות הבניין. אם אין אפשרות להגיע למרחב מוגן,
              היכנסו לחדר מוגן הקרוב והישארו שם עד לסיום ההתרעה.
            </p>
            <ul className="protected-area-alert-tips">
              <li className="text-small-normal">סגרו דלתות מאחוריכם.</li>
              <li className="text-small-normal">השאירו את הטלפון פועל לקבלת עדכונים.</li>
              <li className="text-small-normal">פנו לאבטחת הקהילה רק אם אתם חסומים או פצועים.</li>
            </ul>
            <button
              ref={confirmRef}
              type="button"
              className="btn-cta protected-area-alert-confirm text-medium-bold"
              onClick={() => setView('alert')}
            >
              חזרה לאישור
            </button>
            <button
              type="button"
              className="btn-secondary protected-area-alert-help text-medium-normal"
              onClick={onConfirm}
            >
              אני במרחב המוגן
            </button>
          </>
        )}
      </div>
    </div>
  );
}
