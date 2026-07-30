import { useEffect, useState } from 'react';
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

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default function StoryViewer({ open, storyId, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const story = COMMUNITY_STORIES.find((item) => item.id === storyId) ?? COMMUNITY_STORIES[0];
  const { images } = story;

  useEffect(() => {
    if (open) setCurrentIndex(0);
  }, [open, storyId]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((index) => {
          if (index === images.length - 1) {
            onClose();
            return index;
          }
          return index + 1;
        });
      }
      if (event.key === 'ArrowRight') {
        setCurrentIndex((index) => Math.max(0, index - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, open, onClose]);

  if (!open) return null;

  const showNext = () => {
    if (currentIndex === images.length - 1) {
      onClose();
      return;
    }
    setCurrentIndex((index) => index + 1);
  };

  const showPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

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
        <div className="story-viewer-progress" aria-label={`תמונה ${currentIndex + 1} מתוך ${images.length}`}>
          {images.map((image, index) => (
            <span
              key={image}
              className={`story-viewer-progress-track${index <= currentIndex ? ' is-complete' : ''}`}
            />
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
          aria-label="שליחת הודעה"
          placeholder="שליחת הודעה..."
        />
        <button type="button" className="story-viewer-action" data-hook="story-like" aria-label="אהבתי">
          <HeartIcon />
        </button>
        <button type="button" className="story-viewer-action" data-hook="story-send" aria-label="שיתוף">
          <SendIcon />
        </button>
      </footer>
    </section>
  );
}
