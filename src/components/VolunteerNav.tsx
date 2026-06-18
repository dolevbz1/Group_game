import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import heartAnim from '../assets/nav-heart.json';
import { overridePrimaryColor, overrideStrokeWidth, BLACK } from '../utils/lottieColor';

const animData = overrideStrokeWidth(overridePrimaryColor(heartAnim, BLACK), 2.3);

type VolunteerNavProps = { isActive: boolean };

export default function VolunteerNav({ isActive }: VolunteerNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isActive) {
      anim.playSegments([1, 42], true);
    } else {
      anim.goToAndStop(42, true);
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
      initialSegment={[1, 42]}
      onDOMLoaded={applyState}
      style={{ width: 36, height: 36 }}
    />
  );
}
