import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import spinnerAnim from '../assets/gate-spinner.json';
import checkAnim from '../assets/gate-check-reveal.json';
import { overridePrimaryColor, BLACK, GREEN } from '../utils/lottieColor';
import './GateSuccessModal.css';

const SPINNER_LOOP: [number, number] = [300, 390];
const CHECK_REVEAL: [number, number] = [0,   60];
const SPINNER_SPEED = 1.5;
const SPINNER_MS    = 2400;
const CHECK_REVEAL_MS = 1000;

const spinnerBlack = overridePrimaryColor(spinnerAnim, BLACK);
const checkGreen   = overridePrimaryColor(checkAnim,   GREEN);

type Phase = 'spinner' | 'check' | 'revealed';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function GateSuccessModal({ open, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('spinner');
  const [retry, setRetry] = useState(0);
  const spinnerRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (!open) { setPhase('spinner'); return; }
    const t1 = setTimeout(() => setPhase('check'), SPINNER_MS);
    const t2 = setTimeout(() => setPhase('revealed'), SPINNER_MS + CHECK_REVEAL_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, retry]);


  const handleRetry = () => {
    setPhase('spinner');
    setRetry(r => r + 1);
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const isRevealed = phase === 'revealed';

  return (
    <div className={`gate-modal-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="gate-modal-backdrop" onClick={onClose} />
      <div className="gate-modal" dir="rtl" role="dialog" aria-label="השער פתוח">

        <div className={`gate-modal-icon${isRevealed ? ' is-top' : ''}`}>
          {phase === 'spinner' && open && (
            <Lottie
              key={retry}
              lottieRef={spinnerRef}
              animationData={spinnerBlack}
              loop
              autoplay={false}
              onDOMLoaded={() => {
                spinnerRef.current?.setSpeed(SPINNER_SPEED);
                spinnerRef.current?.playSegments(SPINNER_LOOP, true);
              }}
              className="gate-modal-lottie gate-modal-lottie-spinner"
            />
          )}
          {(phase === 'check' || phase === 'revealed') && (
            <Lottie
              animationData={checkGreen}
              loop={false}
              autoplay
              initialSegment={CHECK_REVEAL}
              className="gate-modal-lottie gate-modal-lottie-check"
            />
          )}
        </div>

        <div className={`gate-modal-body${isRevealed ? ' is-visible' : ''}`}>
          <h2 className="gate-modal-title text-h2-bold">השער פתוח!</h2>
          <p className="gate-modal-sub text-medium-normal">בבקשה לעבור לאט ובזהירות</p>
          <button
            type="button"
            className="btn-cta gate-modal-close text-medium-bold"
            onClick={onClose}
          >
            סגירה
          </button>
          <button
            type="button"
            className="btn-secondary gate-modal-retry text-medium-normal"
            onClick={handleRetry}
          >
            השער לא נפתח, נסה שוב
          </button>
        </div>

      </div>
    </div>
  );
}
