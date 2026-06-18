import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import calendarAnim from '../assets/nav-calendar.json';
import { overridePrimaryColor, overrideStrokeWidth, BLACK } from '../utils/lottieColor';

const animData = overrideStrokeWidth(overridePrimaryColor(calendarAnim, BLACK), 2.3);

type EventsNavProps = { isActive: boolean };

export default function EventsNav({ isActive }: EventsNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isActive) {
      anim.playSegments([1, 59], true);
    } else {
      anim.goToAndStop(59, true);
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
      initialSegment={[1, 59]}
      onDOMLoaded={applyState}
      style={{ width: 36, height: 36 }}
    />
  );
}
