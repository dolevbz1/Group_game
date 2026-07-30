import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import homeAnim from '../assets/nav-home-partial-roll.json';
import './NewsNav.css';

type NewsNavProps = { isActive: boolean; isReady?: boolean };

const REVEAL: [number, number] = [0, 82.5];
const PINCH: [number, number] = [0, 82.5];

export default function NewsNav({ isActive, isReady = true }: NewsNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const hasRevealedRef = useRef(false);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isReady && !hasRevealedRef.current) {
      hasRevealedRef.current = true;
      anim.playSegments(REVEAL, true);
      return;
    }
    if (!isReady) return;
    if (isActive) {
      anim.playSegments(PINCH, true);
    }
    // Deselecting doesn't interrupt playback: the pinch finishes on its own.
  };

  useEffect(() => {
    if (isReady && !hasRevealedRef.current) {
      const t = window.setTimeout(applyState, 750);
      return () => window.clearTimeout(t);
    }
    applyState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isReady]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={homeAnim}
      loop={false}
      autoplay={false}
      initialSegment={REVEAL}
      onDOMLoaded={applyState}
      className="news-nav-lottie"
    />
  );
}
