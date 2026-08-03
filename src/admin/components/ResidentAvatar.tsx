import { useRef } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import type { ResidentEngagement } from '../data/residentsMockData';

type ResidentAvatarProps = {
  animationData: object;
  engagement: ResidentEngagement;
  size?: 'table' | 'panel';
};

export default function ResidentAvatar({
  animationData,
  engagement,
  size = 'table',
}: ResidentAvatarProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <span
      className={`resident-avatar resident-avatar--${engagement}${size === 'panel' ? ' resident-avatar--panel' : ''}`}
      aria-hidden="true"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        onDOMLoaded={() => lottieRef.current?.goToAndStop(0, true)}
        className="resident-avatar-lottie"
      />
    </span>
  );
}
