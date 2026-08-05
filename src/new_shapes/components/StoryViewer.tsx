import { useCallback, useEffect, useState } from 'react';
import eventsShape from '../assets/SVG nav/Frame 75.svg';
import { COMMUNITY_STORIES } from '../data/communityStories';
import './StoryViewer.css';

type StoryViewerProps = {
  open: boolean;
  storyId: string | null;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

const STORY_DURATION_MS = 5000;

export default function StoryViewer({ open, storyId, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const story = COMMUNITY_STORIES.find((item) => item.id === storyId) ?? COMMUNITY_STORIES[0];
  const { images } = story;

  useEffect(() => {
    if (open) setCurrentIndex(0);
  }, [open, storyId]);

  const showNext = useCallback(() => {
    if (currentIndex === images.length - 1) {
      onClose();
      return;
    }
    setCurrentIndex((index) => index + 1);
  }, [currentIndex, images.length, onClose]);

  const showPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') showNext();
      if (event.key === 'ArrowRight') showPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, showNext, showPrevious]);

  if (!open) return null;

  return (
    <section className="story-viewer" role="dialog" aria-modal="true" aria-label={story.title}>
      <img
        key={images[currentIndex]}
        className="story-viewer-image"
        src={images[currentIndex]}
        alt={`${story.title}, תמונה ${currentIndex + 1} מתוך ${images.length}`}
      />

      <button
        type="button"
        className="story-viewer-tap-zone story-viewer-tap-zone--next"
        data-hook="story-next"
        aria-label="לתמונה הבאה"
        onClick={showNext}
      />
      <button
        type="button"
        className="story-viewer-tap-zone story-viewer-tap-zone--previous"
        data-hook="story-previous"
        aria-label="לתמונה הקודמת"
        onClick={showPrevious}
      />

      <header className="story-viewer-header">
        <div
          className="story-viewer-progress"
          dir="rtl"
          aria-label={`תמונה ${currentIndex + 1} מתוך ${images.length}`}
          style={{ '--story-duration': `${STORY_DURATION_MS}ms` } as React.CSSProperties}
        >
          {images.map((image, index) => (
            <span key={image} className="story-viewer-progress-track">
              <span
                key={index === currentIndex ? `active-${currentIndex}` : `track-${index}`}
                className={[
                  'story-viewer-progress-fill',
                  index < currentIndex && 'is-complete',
                  index === currentIndex && 'is-active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onAnimationEnd={
                  index === currentIndex
                    ? (event) => {
                        if (event.currentTarget !== event.target) return;
                        showNext();
                      }
                    : undefined
                }
              />
            </span>
          ))}
        </div>

        <div className="story-viewer-meta" dir="rtl">
          <img className="story-viewer-avatar" src={eventsShape} alt="" />
          <span className="story-viewer-title text-small-bold">{story.title}</span>
          <span className="story-viewer-time text-tiny-normal">{story.time}</span>
        </div>

        <button
          type="button"
          className="story-viewer-close"
          data-hook="story-close"
          aria-label="סגירת הסיפור"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </header>

      <footer className="story-viewer-actions" dir="rtl">
        <input
          className="story-viewer-reply text-small-normal"
          data-hook="story-reply"
          aria-label="הוספת תגובה"
          placeholder="הוספת תגובה..."
        />
        <button type="button" className="story-viewer-action" data-hook="story-like" aria-label="אהבתי">
          <HeartIcon />
        </button>
      </footer>
    </section>
  );
}
