import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import avatarAnim from '../assets/avatar-person.json';
import './Header.css';

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <g fill="#121331" stroke="#121331" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5">
        <circle cx="12" cy="5.5" r="1.75" />
        <circle cx="5.5" cy="5.5" r="1.75" />
        <circle cx="18.5" cy="5.5" r="1.75" />
        <circle cx="12" cy="18.5" r="1.75" />
        <circle cx="5.5" cy="18.5" r="1.75" />
        <circle cx="18.5" cy="18.5" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="5.5" cy="12" r="1.75" />
        <circle cx="18.5" cy="12" r="1.75" />
      </g>
    </svg>
  );
}

type HeaderProps = {
  onMenuClick: () => void;
  onAddClick: () => void;
  onSearchClick?: (rect: DOMRect) => void;
  onProfileClick: (rect: DOMRect) => void;
};

export default function Header({ onMenuClick, onAddClick, onProfileClick }: HeaderProps) {
  const avatarRef = useRef<HTMLButtonElement>(null);
  const avatarLottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const lastFrame = (avatarAnim as any).op - 1;
    const t = setTimeout(() => {
      avatarLottieRef.current?.goToAndStop(lastFrame, true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleProfileClick = () => {
    const rect = avatarRef.current?.getBoundingClientRect();
    if (rect) onProfileClick(rect);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="icon-btn" aria-label="פעולות מהירות" onClick={onMenuClick}>
          <GridIcon />
        </button>
        <button type="button" className="icon-btn" aria-label="הוספה" onClick={onAddClick}>
          <svg className="header-plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="4" x2="12" y2="20" stroke="#121331" strokeWidth="3" strokeLinecap="round"/>
            <line x1="4" y1="12" x2="20" y2="12" stroke="#121331" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="header-right">
        <button
          type="button"
          className="avatar"
          ref={avatarRef}
          onClick={handleProfileClick}
          aria-label="הפרופיל שלי"
        >
          <Lottie
            lottieRef={avatarLottieRef}
            animationData={avatarAnim}
            autoplay={false}
            loop={false}
            className="header-avatar-lottie"
          />
        </button>
      </div>
    </header>
  );
}
