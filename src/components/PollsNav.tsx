import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import analyticsAnim from '../assets/nav-analytics.json';
import { overridePrimaryColor, overrideStrokeWidth, removeFilledLayers, BLACK } from '../utils/lottieColor';

const animData = overrideStrokeWidth(overridePrimaryColor(removeFilledLayers(analyticsAnim), BLACK), 0.4);

type PollsNavProps = { isActive: boolean };

export default function PollsNav({ isActive }: PollsNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isActive) {
      anim.playSegments([1, 38], true);
    } else {
      anim.goToAndStop(38, true);
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
      initialSegment={[1, 38]}
      onDOMLoaded={applyState}
      style={{ width: 36, height: 36 }}
    />
  );
}
