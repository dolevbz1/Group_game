import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import homeAnim from '../assets/nav-home.json';
import { overridePrimaryColor, overrideStrokeWidth, BLACK } from '../utils/lottieColor';
import './NewsNav.css';

const animData = overrideStrokeWidth(overridePrimaryColor(homeAnim, BLACK), 2.3);

type NewsNavProps = { isActive: boolean };

export default function NewsNav({ isActive }: NewsNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isActive) {
      anim.playSegments([1, 39], true);
    } else {
      anim.goToAndStop(39, true);
    }
  };

  useEffect(() => {
    applyState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animData}
      loop={false}
      autoplay={false}
      initialSegment={[1, 39]}
      onDOMLoaded={applyState}
      className="news-nav-lottie"
    />
  );
}
