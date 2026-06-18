import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import storeAnim from '../assets/nav-store.json';
import { overridePrimaryColor, overrideStrokeWidth, BLACK } from '../utils/lottieColor';

const animData = overrideStrokeWidth(overridePrimaryColor(storeAnim, BLACK), 2.3);

type MarketplaceNavProps = { isActive: boolean };

export default function MarketplaceNav({ isActive }: MarketplaceNavProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const applyState = () => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (isActive) {
      anim.playSegments([1, 58], true);
    } else {
      anim.goToAndStop(58, true);
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
      initialSegment={[1, 58]}
      onDOMLoaded={applyState}
      style={{ width: 36, height: 36 }}
    />
  );
}
