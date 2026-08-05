import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import swimmingAnim from '../assets/swimming.json';
import electricAnim from '../assets/electric-power.json';
import volunteerShape from '../assets/SVG nav/Frame 61.svg';
import eventsShape from '../assets/SVG nav/Frame 75.svg';
import pollsShape from '../assets/SVG nav/wired-flat-1213-snake-hover-crawl 1.svg';
import marketplaceShape from '../assets/SVG nav/Frame 73.svg';
import avrahamAvatarAnim from '../assets/volunteer-avatar-avraham.json';
import { COMMUNITY_STORIES } from '../data/communityStories';
import { NEWS_ITEMS, type NewsItem } from '../data/newsItems';
import './NewsCard.css';

const STORY_SLIDESHOW_INTERVAL_MS = 3000;

type NewsCardProps = {
  onOpenDetails?: (id: string) => void;
  onStoryOpen?: (id: string) => void;
  onEventsOpen?: () => void;
  onPollsOpen?: () => void;
  onVolunteerOpen?: () => void;
  onMarketplaceOpen?: () => void;
  isActive?: boolean;
  newItems?: NewsItem[];
};

function ChevronIcon() {
  return (
    <svg className="news-highlight-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function StoryArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function NewsCard({
  onOpenDetails,
  onStoryOpen,
  onEventsOpen,
  onPollsOpen,
  onVolunteerOpen,
  onMarketplaceOpen,
  isActive = false,
  newItems,
}: NewsCardProps) {
  const [items, setItems] = useState(NEWS_ITEMS);

  useEffect(() => {
    if (!newItems || newItems.length === 0) return;
    setItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const freshItems = newItems.filter((item) => !existingIds.has(item.id));
      if (freshItems.length === 0) return prev;
      return [...freshItems, ...prev];
    });
  }, [newItems]);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const lottieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const electricRef = useRef<LottieRefCurrentProps>(null);
  const electricTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const handleLottieComplete = () => {
    lottieTimerRef.current = setTimeout(() => {
      lottieRef.current?.goToAndPlay(0);
    }, 2000);
  };

  const handleElectricComplete = () => {
    electricTimerRef.current = setTimeout(() => {
      electricRef.current?.goToAndPlay(0);
    }, 2000);
  };

  const handleDismiss = (id: string) => {
    if (dismissingId) return;
    setDismissingId(id);
    dismissTimerRef.current = setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDismissingId(null);
    }, 450);
  };

  const handleNextStory = () => {
    const nextIndex = Math.min(activeStoryIndex + 1, COMMUNITY_STORIES.length - 1);
    storyRefs.current[nextIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
    setActiveStoryIndex(nextIndex);
  };

  useEffect(() => {
    return () => {
      if (lottieTimerRef.current) clearTimeout(lottieTimerRef.current);
      if (electricTimerRef.current) clearTimeout(electricTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideshowIndex((prev) => prev + 1);
    }, STORY_SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="news-board" dir="rtl">
      <section className="news-stories" aria-label="סיפורים מהקהילה">
        <div className="news-stories-track">
          {COMMUNITY_STORIES.map((story, index) => (
            <button
              key={story.id}
              ref={(element) => { storyRefs.current[index] = element; }}
              type="button"
              data-hook={`news-story-${story.id}`}
              className="news-story-card"
              onClick={() => onStoryOpen?.(story.id)}
              aria-label={story.title}
            >
              <span className="news-story-slideshow" aria-hidden="true">
                {story.images.map((src, slide) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={`news-story-slide${slide === slideshowIndex % story.images.length ? ' is-visible' : ''}`}
                  />
                ))}
              </span>
              <span className="news-story-overlay" />
              <span className="news-story-copy">
                <span className="news-story-title text-small-bold">{story.title}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="news-stories-next"
          data-hook="news-stories-next"
          aria-label="לסיפור הבא"
          onClick={handleNextStory}
        >
          <StoryArrowIcon />
        </button>
      </section>

      <span className="news-section-subtitle">עדכונים חשובים</span>
      {items.length === 0 ? (
        <div className="news-empty">
          <span className="news-empty-emoji">✓</span>
          <p className="news-empty-text text-small-normal">אין עדכונים דחופים כרגע</p>
        </div>
      ) : (
        <>
          {items.slice(0, 1).map((item) => {
            const isDismissing = dismissingId === item.id;
            return (
              <div
                key={item.id}
                className={`news-note-wrap${isDismissing ? ' is-collapsing' : ''}`}
              >
                <article
                  className={`news-note${isDismissing ? ' is-dismissing' : ''}`}
                >
                  <div className="news-note-body">
                    <div className="news-note-visual">
                      {item.loopAnim ? (
                        <Lottie animationData={item.anim} loop={isActive} className="news-note-lottie" />
                      ) : item.hasLottie ? (
                        <Lottie
                          animationData={swimmingAnim}
                          loop={false}
                          lottieRef={lottieRef}
                          onComplete={handleLottieComplete}
                          className="news-note-lottie"
                        />
                      ) : item.hasElectricLottie ? (
                        <Lottie
                          animationData={electricAnim}
                          loop={false}
                          lottieRef={electricRef}
                          onComplete={handleElectricComplete}
                          className="news-note-lottie"
                        />
                      ) : (
                        <span className="news-note-emoji">{item.emoji}</span>
                      )}
                    </div>
                    <div className="news-note-text">
                      <p className="news-note-title text-medium-bold">{item.title}</p>
                      <p className="news-note-timestamp text-small-normal">{item.author.name} · {item.time}</p>
                    </div>
                  </div>
                  <footer className="news-note-footer">
                    <button
                      type="button"
                      data-hook={`news-details-${item.id}`}
                      className="news-note-footer-btn text-small-normal"
                      onClick={() => onOpenDetails?.(item.id)}
                    >
                      לפרטים נוספים
                    </button>
                    <button
                      type="button"
                      data-hook={`news-dismiss-${item.id}`}
                      className="news-note-footer-btn news-note-footer-btn--cta text-small-normal"
                      onClick={() => handleDismiss(item.id)}
                      disabled={!!dismissingId}
                    >
                      הבנתי
                    </button>
                  </footer>
                </article>
              </div>
            );
          })}
          {items.length > 1 && (
            <div className="news-stack-indicators" aria-hidden="true">
              <span />
              <span />
            </div>
          )}
        </>
      )}

      <span className="news-section-subtitle">אירועים בשבילך</span>
      <article className="news-highlight-card news-highlight-card--event">
        <img className="news-highlight-shape news-highlight-shape--event" src={eventsShape} alt="" aria-hidden="true" />
        <div className="news-event-date" aria-label="20 ביוני">
          <strong>20</strong>
          <span>יוני</span>
        </div>
        <div className="news-highlight-content">
          <span className="news-highlight-kicker text-tiny-bold">שישי · 18:30</span>
          <h4 className="news-highlight-title text-medium-bold">ערב קהילה עם הוועד המקומי</h4>
          <p className="news-highlight-meta text-small-normal">בית העם · 42 שכנים מגיעים</p>
          <button type="button" className="news-highlight-cta text-small-bold" data-hook="news-highlight-event" onClick={onEventsOpen}>
            לפרטים והרשמה
            <ChevronIcon />
          </button>
        </div>
      </article>

      <span className="news-section-subtitle">סקר שמחכה לך</span>
      <article className="news-highlight-card news-highlight-card--poll">
        <img className="news-highlight-shape news-highlight-shape--poll" src={pollsShape} alt="" aria-hidden="true" />
        <div className="news-highlight-content">
          <span className="news-highlight-kicker text-tiny-bold">עוד לא הצבעת</span>
          <h4 className="news-highlight-title text-medium-bold">מה נאכל בערב הורים בבריכה?</h4>
          <div className="news-poll-progress" aria-label="630 שכנים כבר הצביעו">
            <span className="news-poll-progress-fill" />
          </div>
          <p className="news-highlight-meta text-small-normal">630 שכנים כבר הצביעו</p>
          <button type="button" className="news-highlight-cta text-small-bold" data-hook="news-highlight-poll" onClick={onPollsOpen}>
            להצביע עכשיו
            <ChevronIcon />
          </button>
        </div>
      </article>

      <span className="news-section-subtitle">אפשר לעזור עכשיו</span>
      <article className="news-highlight-card news-highlight-card--volunteer">
        <img className="news-highlight-shape news-highlight-shape--volunteer" src={volunteerShape} alt="" aria-hidden="true" />
        <div className="news-highlight-avatar">
          <Lottie animationData={avrahamAvatarAnim} loop={false} autoplay />
        </div>
        <div className="news-highlight-content">
          <span className="news-highlight-kicker text-tiny-bold">350 מטר ממך</span>
          <h4 className="news-highlight-title text-medium-bold">אברהם צריך הסעה לקופת חולים</h4>
          <p className="news-highlight-meta text-small-normal">מחר, 14:00 · בערך 20 דקות</p>
          <button type="button" className="news-highlight-cta text-small-bold" data-hook="news-highlight-volunteer" onClick={onVolunteerOpen}>
            אני יכול/ה לעזור
            <ChevronIcon />
          </button>
        </div>
      </article>

      <span className="news-section-subtitle">חדש במרקטפלייס</span>
      <article className="news-highlight-card news-highlight-card--marketplace">
        <img className="news-highlight-shape news-highlight-shape--marketplace" src={marketplaceShape} alt="" aria-hidden="true" />
        <div className="news-marketplace-photo">
          <img src="/baby thing/725085039_27380358251583605_5495266966152367353_n.jpg" alt="בגדי תינוקות גיל 0 עד 6 חודשים" />
          <span className="news-marketplace-badge text-tiny-bold">חינם</span>
        </div>
        <div className="news-highlight-content">
          <span className="news-highlight-kicker text-tiny-bold">פורסם לפני 5 שעות</span>
          <h4 className="news-highlight-title text-medium-bold">בגדי תינוקות גיל 0–6</h4>
          <p className="news-highlight-meta text-small-normal">מיכל רוזן · קרוב אליך</p>
          <button type="button" className="news-highlight-cta text-small-bold" data-hook="news-highlight-marketplace" onClick={onMarketplaceOpen}>
            לצפייה במודעה
            <ChevronIcon />
          </button>
        </div>
      </article>
    </div>
  );
}
