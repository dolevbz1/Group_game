import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import pizzaAnim from '../assets/poll-pizza.json';
import burgerAnim from '../assets/poll-burger.json';
import './PollsCard.css';

const COLUMN_LOTTIES = [
  { animationData: burgerAnim, loop: false, idleFrame: 89 },
  { animationData: pizzaAnim, loop: false, idleFrame: 200 },
] as const;

const LAST_POLL = {
  question: 'מה נאכל בערב הורים בבריכה?',
  options: [
    { id: 'park' as const, label: 'המבורגרים', votes: 478 },
    { id: 'entrance' as const, label: 'פיצות', votes: 151 },
    { id: 'school' as const, label: 'ליד בית הספר', votes: 1 },
  ],
};

const RISE_DURATION = 5000;
const RISE_STAGGER = 120;

type AnimPhase = 'idle' | 'rising' | 'jumped';

type PollsCardProps = {
  isActive?: boolean;
};

export default function PollsCard({ isActive = false }: PollsCardProps) {
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const pizzaLottieRef = useRef<LottieRefCurrentProps>(null);
  const burgerLottieRef = useRef<LottieRefCurrentProps>(null);
  const lottieRefs = [pizzaLottieRef, burgerLottieRef];

  const fill0Ref = useRef<HTMLDivElement>(null);
  const fill1Ref = useRef<HTMLDivElement>(null);
  const pct0Ref = useRef<HTMLSpanElement>(null);
  const pct1Ref = useRef<HTMLSpanElement>(null);

  const totalVotes = LAST_POLL.options.reduce((sum, o) => sum + o.votes, 0);
  const topTwo = [...LAST_POLL.options]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 2)
    .map((option) => ({
      ...option,
      pct: Math.round((option.votes / totalVotes) * 100),
    }));

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      lottieRefs.forEach((ref, i) => ref.current?.goToAndStop(COLUMN_LOTTIES[i].idleFrame, true));
      return;
    }

    const t1 = window.setTimeout(() => setPhase('rising'), 1500);

    const t2 = window.setTimeout(() => setPhase('jumped'), 1500 + RISE_DURATION + RISE_STAGGER + 400);

    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [isActive]);

  const isRising = phase === 'rising' || phase === 'jumped';

  useEffect(() => {
    const fillRefs = [fill0Ref, fill1Ref];
    const pctRefs = [pct0Ref, pct1Ref];

    const reset = () => {
      fillRefs.forEach(r => { if (r.current) r.current.style.height = ''; });
      pctRefs.forEach(r => { if (r.current) { r.current.style.bottom = ''; r.current.textContent = ''; } });
    };

    if (!isRising) { reset(); return; }

    const targets = topTwo.map(o => o.pct);
    const start = performance.now();
    let rafId: number;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      let done = true;
      targets.forEach((target, i) => {
        const elapsed = Math.max(0, now - start - i * RISE_STAGGER);
        const t = Math.min(elapsed / RISE_DURATION, 1);
        if (t < 1) done = false;
        const value = easeOut(t) * target;
        if (fillRefs[i].current) fillRefs[i].current.style.height = `${value}%`;
        if (pctRefs[i].current) {
          pctRefs[i].current.style.bottom = `${value}%`;
          pctRefs[i].current.textContent = `${Math.round(value)}%`;
        }
      });
      if (!done) {
        rafId = requestAnimationFrame(tick);
      } else {
        // burger is at index 0 (controlled by pizzaLottieRef after the swap)
        // playSegments bypasses the op:90 limit in the JSON
        pizzaLottieRef.current?.playSegments([100, 190], true);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); reset(); };
  }, [isRising]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="polls-body" dir="rtl">
      <div className={`poll-card${isRising ? ' is-rising' : ''}`}>
        <div className="poll-card-body">
          <p className="poll-question text-medium-bold">{LAST_POLL.question}</p>

          <div className="poll-columns">
            {topTwo.map((option, index) => (
              <div
                className={`poll-column${index === 0 ? ' is-leading' : ''}`}
                key={option.id}
              >
                <div className="poll-column-track">
                  <div ref={index === 0 ? fill0Ref : fill1Ref} className="poll-column-fill" />
                  <Lottie
                    lottieRef={lottieRefs[index]}
                    animationData={COLUMN_LOTTIES[index].animationData}
                    loop={COLUMN_LOTTIES[index].loop}
                    autoplay={false}
                    onDOMLoaded={() =>
                      lottieRefs[index].current?.goToAndStop(COLUMN_LOTTIES[index].idleFrame, true)
                    }
                    className="poll-column-lottie"
                  />
                  <span
                    ref={index === 0 ? pct0Ref : pct1Ref}
                    className="poll-column-pct text-h2-bold"
                  />
                </div>
                <span className="poll-column-label text-tiny-normal">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="poll-card-footer">
          <button type="button" className="news-note-footer-btn news-note-footer-btn--cta text-small-normal">
            להצביע בסקר הבא
          </button>
        </footer>
      </div>
    </div>
  );
}
