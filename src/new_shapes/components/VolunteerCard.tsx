import { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, OverlayViewF } from '@react-google-maps/api';
import Lottie from 'lottie-react';
import lottie from 'lottie-web';
import beehiveAnim from '../assets/beehive.json';
import cafeAnim from '../assets/cafe.json';
import stadiumAnim from '../assets/stadium.json';
import { VOLUNTEER_REQUESTS } from '../data/volunteerRequests';
import './VolunteerCard.css';

function HourglassIcon() {
  return (
    <svg
      className="match-meta-icon match-meta-hourglass"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.828V2" />
    </svg>
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

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

export default function VolunteerCard({ isActive = false }: { isActive?: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [justClaimed, setJustClaimed] = useState<string | null>(null);
  const [proofIndex, setProofIndex] = useState(0);
  const [proofVisible, setProofVisible] = useState(true);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setProofVisible(false);
      setTimeout(() => {
        setProofIndex((i) => (i + 1) % SOCIAL_PROOF.length);
        setProofVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);


  const open = VOLUNTEER_REQUESTS.filter((r) => !claimedIds.includes(r.id));
  const featured = open.find((r) => r.id === selectedId) ?? open[0];
  const success = VOLUNTEER_REQUESTS.find((r) => r.id === justClaimed);
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
        {isActive && isLoaded && (
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

            {VOLUNTEER_REQUESTS.filter((r) => !claimedIds.includes(r.id)).map((r) => (
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
                    <ProfileAvatar className="pin-avatar-lottie" animationData={r.avatarAnimation} />
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
              <ProfileAvatar key={featured.id} className="match-avatar-lottie" animationData={featured.avatarAnimation} />
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
                {featured.availability}
                <span className="match-meta-sep">|</span>
                <HourglassIcon />
                בערך {featured.duration}
              </p>
            </div>
          </div>
          <footer className="match-footer">
            <button type="button" className="match-cta text-small-bold" onClick={handleClaim}>
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
