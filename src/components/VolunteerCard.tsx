import { useState, useEffect, useRef } from 'react';
import { LottieRefCurrentProps } from 'lottie-react';
import { GoogleMap, useJsApiLoader, OverlayViewF } from '@react-google-maps/api';
import Lottie from 'lottie-react';
import lottie from 'lottie-web';
import hourglassAnimRaw from '../assets/hourglass.json';
import { overridePrimaryColor } from '../utils/lottieColor';

const hourglassAnim = overridePrimaryColor(hourglassAnimRaw, [34 / 255, 34 / 255, 51 / 255, 0.65]);
import davidAvatarAnim from '../assets/volunteer-avatar-david.json';
import avrahamAvatarAnim from '../assets/volunteer-avatar-avraham.json';
import leviAvatarAnim from '../assets/volunteer-avatar-levi.json';
import rachelAvatarAnim from '../assets/volunteer-avatar-rachel.json';
import beehiveAnim from '../assets/beehive.json';
import cafeAnim from '../assets/cafe.json';
import stadiumAnim from '../assets/stadium.json';
import './VolunteerCard.css';

function HourglassIcon() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    const lastFrame = (hourglassAnim as any).op - 1;
    lottieRef.current?.goToAndStop(lastFrame, true);
  }, []);
  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={hourglassAnim}
      loop={false}
      autoplay={false}
      className="match-meta-icon match-meta-hourglass"
    />
  );
}

function ProfileAvatar({ className, animationData }: { className?: string; animationData: object }) {
  return <Lottie animationData={animationData} loop={false} autoplay className={className} />;
}

function PinAvatar({ animationData }: { animationData: object }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      animationData: animationData as any,
      renderer: 'svg',
      loop: false,
      autoplay: true,
    });
    return () => anim.destroy();
  }, []);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

const MAP_CENTER = { lat: 32.7195, lng: 35.2438 };

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#e8e8e8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#e8e8e8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#cccccc' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const SOCIAL_PROOF = [
  { helper: 'טל', helpee: 'מרים', task: 'קניות מהסופר', time: 'לפני 20 דק׳' },
  { helper: 'גל', helpee: 'שולה', task: 'האייפון החדש', time: 'לפני שעה' },
  { helper: 'נועה', helpee: 'משפחת כהן', task: 'בייביסיטר', time: 'אתמול' },
  { helper: 'אמיר', helpee: 'רחל', task: 'תיקון קטן בבית', time: 'לפני יומיים' },
  { helper: 'שירה', helpee: 'אברהם', task: 'דוגיסיטר', time: 'לפני 3 שעות' },
];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  styles: MAP_STYLES,
  gestureHandling: 'none',
  keyboardShortcuts: false,
};

const HELP_REQUESTS = [
  {
    id: 'david',
    name: 'דוד',
    avatarAnim: davidAvatarAnim,
    taskEmoji: '💻',
    task: 'עזרה במחשב החדש',
    distance: '200 מ׳',
    duration: '30 דק׳',
    position: { lat: 32.7222, lng: 35.2415 },
  },
  {
    id: 'avraham',
    name: 'אברהם',
    avatarAnim: avrahamAvatarAnim,
    taskEmoji: '🐕',
    task: 'הוצאת הכלב',
    distance: '350 מ׳',
    duration: '20 דק׳',
    position: { lat: 32.7200, lng: 35.2458 },
  },
  {
    id: 'levi',
    name: 'משפחת לוי',
    avatarAnim: leviAvatarAnim,
    taskEmoji: '👶',
    task: 'בייביסיטר לערב',
    distance: '450 מ׳',
    duration: '3 שע׳',
    position: { lat: 32.7228, lng: 35.2450 },
  },
  {
    id: 'rachel',
    name: 'רחל',
    avatarAnim: rachelAvatarAnim,
    taskEmoji: '🔌',
    task: 'תיקון חשמל קטן',
    distance: '600 מ׳',
    duration: '45 דק׳',
    position: { lat: 32.7224, lng: 35.2510 },
  },
];


const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

export default function VolunteerCard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [justClaimed, setJustClaimed] = useState<string | null>(null);
  const [proofIndex, setProofIndex] = useState(0);
  const [proofVisible, setProofVisible] = useState(true);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });

  useEffect(() => {
    const interval = setInterval(() => {
      setProofVisible(false);
      setTimeout(() => {
        setProofIndex((i) => (i + 1) % SOCIAL_PROOF.length);
        setProofVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const open = HELP_REQUESTS.filter((r) => !claimedIds.includes(r.id));
  const featured = open.find((r) => r.id === selectedId) ?? open[0];
  const success = HELP_REQUESTS.find((r) => r.id === justClaimed);
  const isNearest = featured && featured.id === open[0]?.id && !selectedId;

  const handlePinClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setJustClaimed(null);
    setSelectedId(id);
  };

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!featured) return;
    setClaimedIds((ids) => [...ids, featured.id]);
    setJustClaimed(featured.id);
    setSelectedId(null);
  };

  const proof = SOCIAL_PROOF[proofIndex];

  return (
    <div className="volunteer-body" dir="rtl">
      <div className="volunteer-ticker-strip">
        <p className={`volunteer-ticker-text text-small-normal${proofVisible ? ' is-visible' : ''}`}>
          <strong>{proof.helper}</strong> עזר/ה ל{proof.helpee} עם {proof.task}
          <span className="volunteer-ticker-time"> · {proof.time}</span>
        </p>
      </div>
      <div className="volunteer-map">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={MAP_CENTER}
            zoom={15}
            options={MAP_OPTIONS}
          >
            <OverlayViewF
              position={{ lat: 32.7200, lng: 35.2510 }}
              mapPaneName="overlayMouseTarget"
            >
              <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', width: 44, height: 44, pointerEvents: 'none' }}>
                <Lottie animationData={beehiveAnim} loop autoplay style={{ width: 44, height: 44 }} />
              </div>
            </OverlayViewF>

            <OverlayViewF
              position={{ lat: 32.7205, lng: 35.2476 }}
              mapPaneName="overlayMouseTarget"
            >
              <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', width: 44, height: 44, pointerEvents: 'none' }}>
                <Lottie animationData={stadiumAnim} loop={false} autoplay={false} style={{ width: 44, height: 44 }} />
              </div>
            </OverlayViewF>

            <OverlayViewF
              position={{ lat: 32.7248, lng: 35.2425 }}
              mapPaneName="overlayMouseTarget"
            >
              <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', width: 44, height: 44, pointerEvents: 'none' }}>
                <Lottie animationData={cafeAnim} loop autoplay style={{ width: 44, height: 44 }} />
              </div>
            </OverlayViewF>

            {HELP_REQUESTS.filter((r) => !claimedIds.includes(r.id)).map((r) => (
              <OverlayViewF
                key={r.id}
                position={r.position}
                mapPaneName="overlayMouseTarget"
              >
                <button
                  type="button"
                  className={`map-pin${featured?.id === r.id ? ' is-selected' : ''}`}
                  onClick={(e) => handlePinClick(e, r.id)}
                >
                  <div className="pin-ring" />
                  <div className="pin-avatar">
                    <ProfileAvatar className="pin-avatar-lottie" animationData={r.avatarAnim} />
                  </div>
                  <span className="pin-name text-small-normal">{r.name}</span>
                </button>
              </OverlayViewF>
            ))}
          </GoogleMap>
        )}
      </div>

      {success ? (
        <div className="match-strip is-success" key={`success-${success.id}`}>
          <span className="match-avatar">🎉</span>
          <div className="match-text">
            <p className="match-title text-medium-bold">קבעתם! {success.name} כבר מחכה לכם</p>
            <p className="match-meta text-small-normal">כל הפרטים יחכו לכם במסך הבקשות</p>
          </div>
        </div>
      ) : featured ? (
        <div className="match-strip" key={featured.id}>
          <div className="match-strip-body">
            <span className="match-avatar">
              <ProfileAvatar key={featured.id} className="match-avatar-lottie" animationData={featured.avatarAnim} />
            </span>
            <div className="match-text">
              <p className="match-title text-medium-bold">
                {featured.name} · {featured.task}
              </p>
              <p className="match-meta text-small-normal">
                <svg className="match-meta-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9.5" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
                מחר ב 14:00
                <span className="match-meta-sep">|</span>
                <HourglassIcon />
                בערך {featured.duration}
              </p>
            </div>
          </div>
          <footer className="match-footer">
            <button type="button" className="news-note-footer-btn news-note-footer-btn--cta text-small-normal" onClick={handleClaim}>
              לפרטים נוספים ותיאום
            </button>
          </footer>
        </div>
      ) : (
        <div className="match-strip is-success">
          <span className="match-avatar">💪</span>
          <div className="match-text">
            <p className="match-title text-medium-bold">כל השכנים קיבלו עזרה!</p>
            <p className="match-meta text-small-normal">נעדכן אתכם כשמישהו יצטרך אתכם</p>
          </div>
        </div>
      )}

    </div>
  );
}
