import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import lottie, { AnimationItem } from 'lottie-web';
import avatarAnim from '../assets/avatar-person.json';
import visibilityAnimRaw from '../assets/visibility.json';
import { overridePrimaryColor } from '../utils/lottieColor';

const visibilityAnim = overridePrimaryColor(visibilityAnimRaw, [34 / 255, 34 / 255, 51 / 255, 1]);
import { getInterestById } from '../data/interests';
import { BackIcon, IconButton, PencilIcon, ScreenTextButton } from './IconButton';
import './PublicProfile.css';

type PublicProfileProps = {
  open: boolean;
  onBack: () => void;
  name: string;
  location: string;
  interestIds: string[];
  avatarPhotoUrl: string | null;
};

type HelpTopic = { emoji: string; label: string };
type JourneyCard = { tone: string; label: string; value: string; suffix?: string; balloons?: boolean };
type Badge = { emoji: string; label: string; tone: string };
type Interest = { emoji: string; label: string };

const HELP_TOPICS: HelpTopic[] = [
  { emoji: '🌿', label: 'גינון ושתילה' },
  { emoji: '🔌', label: 'תיקוני חשמל קטנים' },
  { emoji: '🛠️', label: 'המלצות על בעלי מקצוע' },
  { emoji: '🐕', label: 'שמירה על כלבים' },
];

const JOURNEY: JourneyCard[] = [
  { tone: 'pink', label: 'הזמן שלי בגבעת אלה', value: 'שנתיים', suffix: 'ו-3 חודשים' },
  { tone: 'beige', label: 'שכנים שעזרתי להם', value: '8' },
  { tone: 'coral', label: 'יום הולדת', value: '18 בפברואר', balloons: true },
];

const BADGES: Badge[] = [
  { emoji: '🤝', label: 'מתנדב/ת על', tone: 'pink' },
  { emoji: '🗳️', label: 'קול בקהילה', tone: 'purple' },
  { emoji: '🎉', label: 'פרצוף מוכר', tone: 'blue' },
  { emoji: '🌳', label: 'שומר/ת שכונה', tone: 'lime' },
];

const INTERESTS: Interest[] = [
  { emoji: '🏊', label: 'מועדון הבריכה' },
  { emoji: '🎬', label: 'ערבי קולנוע' },
  { emoji: '🌳', label: 'גינון קהילתי' },
  { emoji: '⚽', label: 'ספורט שכונתי' },
];

const VISIBILITY_BLINK: [number, number] = [41, 69];
const VISIBILITY_START_DELAY_MS = 1750;
const VISIBILITY_LOOP_DELAY_MS = 4300;
const VISIBILITY_SPEED = 0.5;

function VisibilityIcon({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const activeRef = useRef(active);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  activeRef.current = active;

  const clearTimers = () => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
  };

  const playBlink = () => {
    const anim = animRef.current;
    if (!anim) return;
    anim.setSpeed(VISIBILITY_SPEED);
    anim.playSegments(VISIBILITY_BLINK, true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      animationData: visibilityAnim,
      renderer: 'svg',
      loop: false,
      autoplay: false,
    });
    animRef.current = anim;
    anim.goToAndStop(VISIBILITY_BLINK[0], true);

    const onComplete = () => {
      if (!activeRef.current) return;
      loopTimerRef.current = setTimeout(playBlink, VISIBILITY_LOOP_DELAY_MS);
    };

    anim.addEventListener('complete', onComplete);

    return () => {
      clearTimers();
      anim.removeEventListener('complete', onComplete);
      anim.destroy();
      animRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearTimers();
    if (!active) {
      animRef.current?.goToAndStop(VISIBILITY_BLINK[0], true);
      return clearTimers;
    }
    startTimerRef.current = setTimeout(playBlink, VISIBILITY_START_DELAY_MS);
    return clearTimers;
  }, [active]);

  return <div ref={containerRef} className="pub-preview-icon" aria-hidden="true" />;
}

function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function PublicProfile({
  open,
  onBack,
  name,
  location,
  interestIds,
  avatarPhotoUrl,
}: PublicProfileProps) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      const t = setTimeout(() => setVisible(true), 16);
      return () => clearTimeout(t);
    }
    if (!render) return;
    setVisible(false);
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
    }, 380);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [render, onBack]);

  if (!render) return null;

  return (
    <div
      className={`pub${visible ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="תצוגה מקדימה של הפרופיל"
      dir="rtl"
    >
      <div className="pub-top">
        <IconButton ariaLabel="חזרה" onClick={onBack}>
          <BackIcon />
        </IconButton>
        <span className="pub-top-title text-small-bold">תצוגה מקדימה</span>
        <ScreenTextButton ariaLabel="עריכה" onClick={onBack} icon={<PencilIcon />}>
          עריכה
        </ScreenTextButton>
      </div>

      <div className="pub-preview-banner" aria-live="polite">
        <VisibilityIcon active={visible} />
        <span className="text-small-bold">ככה הגבעתים רואים את הפרופיל שלך</span>
      </div>

      <div className="pub-scroll">
        <div className="pub-hero pub-reveal">
          <div className="pub-blobs" aria-hidden="true">
            <span className="pub-blob tone-lime" />
            <span className="pub-blob tone-pink" />
            <span className="pub-blob tone-purple" />
            <span className="pub-blob tone-orange" />
          </div>
          <div className="pub-avatar" aria-hidden="true">
            {avatarPhotoUrl ? (
              <img src={avatarPhotoUrl} alt="" className="pub-avatar-photo" />
            ) : (
              <Lottie animationData={avatarAnim} loop={false} autoplay className="pub-avatar-lottie" />
            )}
          </div>
        </div>

        <div className="pub-identity pub-reveal">
          <h1 className="pub-name text-h2-bold">{name}</h1>
          <p className="pub-location text-small-normal">{location}</p>
          <div className="pub-action-row">
            <div className="pub-action-item">
              <button type="button" className="pub-message-btn" aria-label="שיחת טלפון">
                <PhoneIcon />
              </button>
              <span className="pub-action-label text-tiny-normal">שיחה</span>
            </div>
            <div className="pub-action-item">
              <button type="button" className="pub-message-btn pub-message-btn--whatsapp" aria-label="WhatsApp">
                <WhatsAppIcon />
              </button>
              <span className="pub-action-label text-tiny-normal">וואטסאפ</span>
            </div>
          </div>
        </div>

        <section className="pub-block pub-reveal">
          <h2 className="pub-block-title text-medium-bold">קצת עליי</h2>
          <p className="pub-about text-medium-normal">
            אבא לשניים, גר בגבעת אלה כבר שנתיים ואוהב כל רגע. תמיד שמח לעזור לשכנים,
            להמליץ על בעל מקצוע טוב או פשוט לקשקש על קפה בשכונה. ☕
          </p>
        </section>

        <section className="pub-block pub-reveal">
          <h2 className="pub-block-title text-medium-bold">תחומי העניין שלי</h2>
          <div className="pub-tags">
            {interestIds.map((id) => {
              const item = getInterestById(id);
              if (!item) return null;
              return (
                <span className="pub-tag" key={id}>
                  <span className="pub-tag-emoji" aria-hidden="true">{item.emoji}</span>
                  <span className="text-small-normal">{item.label}</span>
                </span>
              );
            })}
          </div>
        </section>

        <section className="pub-block pub-reveal">
          <h2 className="pub-block-title text-medium-bold">תחומי העניין המשותפים לך ול{name.split(' ')[0]}</h2>
          <div className="pub-tags">
            {HELP_TOPICS.map((t) => (
              <span className="pub-tag" key={t.label}>
                <span className="pub-tag-emoji" aria-hidden="true">{t.emoji}</span>
                <span className="text-small-normal">{t.label}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="pub-block pub-reveal">
          <h2 className="pub-block-title text-medium-bold">המסע שלי בגבעת אלה</h2>
          <div className="pub-journey">
            {JOURNEY.map((c) => (
              <div className={`pub-journey-card tone-${c.tone}`} key={c.label}>
                {c.balloons && (
                  <span className="pub-balloons" aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span className="pub-balloon" key={i}>
                        <span className="pub-balloon-body" />
                      </span>
                    ))}
                  </span>
                )}
                <span className="pub-journey-label text-small-normal">{c.label}</span>
                <span className="pub-journey-value-row">
                  <span className="pub-journey-value text-h1-bold">{c.value}</span>
                  {c.suffix && <span className="pub-journey-suffix text-small-bold">{c.suffix}</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
