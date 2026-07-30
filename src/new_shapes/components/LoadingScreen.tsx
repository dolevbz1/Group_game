import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import spinnerAnimation from '../assets/spinner-sun.json';
import logo from '../assets/givat-elah-logo.png';
import './LoadingScreen.css';

const SPINNER_SEGMENT: [number, number] = [70, 250];
const TOTAL_MS  = 4300;
const FADE_MS   = 600;

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [screenPhase, setScreenPhase]   = useState<'in' | 'hold' | 'out'>('in');
  const [fadingOut,   setFadingOut]     = useState(false);
  const spinnerRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    spinnerRef.current?.playSegments(SPINNER_SEGMENT, true);
  }, []);

  useEffect(() => {
    const toHold  = setTimeout(() => setScreenPhase('hold'),             400);
    const toFade  = setTimeout(() => setFadingOut(true),                 TOTAL_MS - FADE_MS);
    const toOut   = setTimeout(() => setScreenPhase('out'),              TOTAL_MS);
    const toDone  = setTimeout(() => onDone(),                           TOTAL_MS);
    return () => { clearTimeout(toHold); clearTimeout(toFade); clearTimeout(toOut); clearTimeout(toDone); };
  }, [onDone]);

  return (
    <div className={`loading-screen phase-${screenPhase}`} dir="rtl">
      <div className={`loading-center${fadingOut ? ' is-fading' : ''}`}>
        <img src={logo} alt="גבעת אלה" className="loading-logo" />
        <div className="loading-progress-track">
          <div className="loading-progress-fill" />
        </div>
      </div>

      <div className="loading-footer">
        <Lottie
          lottieRef={spinnerRef}
          animationData={spinnerAnimation}
          loop
          autoplay={false}
          className="loading-spinner"
        />
        <p className="loading-footer-text text-tiny-normal">מופעל באמצעות גרופס בע״מ</p>
      </div>
    </div>
  );
}
