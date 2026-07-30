import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import calendarAnim from '../assets/qa-calendar.json';
import creditCardAnim from '../assets/qa-creditcard.json';
import boxTimeAnim from '../assets/qa-boxtime-v2.json';
import telephoneAnim from '../assets/qa-telephone.json';
import busStopAnim from '../assets/qa-busstop.json';
import barChartAnim from '../assets/qa-barchart.json';
import './QuickActions.css';

type ActionItem =
  | { lottie: object; label: string; isNew?: boolean }
  | { emoji: string; label: string; isNew?: boolean };

const ACTIONS: ActionItem[] = [
  { lottie: busStopAnim, label: 'פתיחת שער' },
  { lottie: calendarAnim, label: 'הרשמה לאירוע' },
  { lottie: telephoneAnim, label: 'שיחת חירום' },
  { lottie: barChartAnim, label: 'הצבעות' },
  { lottie: boxTimeAnim, label: 'סטטוס חבילות', isNew: true },
  { lottie: creditCardAnim, label: 'תשלום לוועד' },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

type QuickActionsProps = {
  open: boolean;
  onClose: () => void;
  onGateOpen: () => void;
  onEmergencyOpen: () => void;
};

const THEME_META = () => document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

export default function QuickActions({
  open,
  onClose,
  onGateOpen,
  onEmergencyOpen,
}: QuickActionsProps) {
  useEffect(() => {
    const meta = THEME_META();
    if (!meta) return;
    if (open) {
      meta.content = '#ffffff';
    } else {
      meta.content = '#F5F5F5';
    }
  }, [open]);
  const refsMap = useRef(new Map<number, React.RefObject<LottieRefCurrentProps>>());
  const getRef = (i: number) => {
    if (!refsMap.current.has(i)) {
      refsMap.current.set(i, { current: null } as React.RefObject<LottieRefCurrentProps>);
    }
    return refsMap.current.get(i)!;
  };

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = open ? '#ffffff' : '#DAEDFC';
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const START_DELAY = 200;
    const STAGGER = 170;
    const SPEED = 1.7;
    const timers: ReturnType<typeof setTimeout>[] = [];

    ACTIONS.forEach((action, i) => {
      if (!('lottie' in action)) return;
      const ref = getRef(i).current;
      if (!ref) return;
      ref.setSpeed(SPEED);
      ref.goToAndStop(0, true);
      timers.push(
        setTimeout(() => getRef(i).current?.goToAndPlay(0), START_DELAY + i * STAGGER)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [open]);

  const handleActionClick = (label: string) => {
    onClose();
    if (label === 'פתיחת שער') onGateOpen();
    if (label === 'שיחת חירום') onEmergencyOpen();
  };

  return (
    <div className={`qa-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="qa-backdrop" onClick={onClose} />
      <div className="qa-sheet" dir="rtl" role="dialog" aria-label="פעולות מהירות">
        <div className="qa-head">
          <h2 className="qa-title text-h2-bold">פעולות מהירות</h2>
        </div>

        <div className="qa-grid">
          {ACTIONS.map((action, i) => (
            <button
              key={action.label}
              type="button"
              className={`qa-tile${action.isNew ? ' has-badge' : ''}`}
              onClick={() => handleActionClick(action.label)}
              data-hook={action.label === 'שיחת חירום' ? 'emergency-alert-action' : undefined}
              onMouseEnter={() => {
                if ('lottie' in action) getRef(i).current?.goToAndPlay(0);
              }}
            >
              {action.isNew && <span className="qa-tile-badge text-tiny-bold">חדש!</span>}
              {'lottie' in action ? (
                <Lottie
                  lottieRef={getRef(i)}
                  animationData={action.lottie}
                  loop={false}
                  autoplay={false}
                  onDOMLoaded={() => {
                    const ref = getRef(i).current;
                    if (!ref) return;
                    const lastFrame = (ref.getDuration(true) ?? 1) - 1;
                    ref.goToAndStop(lastFrame, true);
                  }}
                  className="qa-tile-lottie"
                />
              ) : (
                <span className="qa-tile-emoji">{action.emoji}</span>
              )}
              <span className="qa-tile-label text-small-bold">{action.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
