import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import './AISearch.css';

type AISearchProps = {
  onSubmit?: (text: string, rect: DOMRect) => void;
};

function SendArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 5 5 12 12 19" />
    </svg>
  );
}

const PROMPTS = [
  'שעות פתיחה',
  'מתקנים ושירותים',
  'אירועים להורים',
  'התנדבויות ביישוב',
  'סקרים והצבעות',
];

const TYPING_SPEED = 70;
const PAUSE_AFTER = 2500;
const FADE_DURATION = 400;

export default function AISearch({ onSubmit }: AISearchProps) {
  const [index, setIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [washing, setWashing] = useState(false);
  const [fading, setFading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) return;

    const full = PROMPTS[index];
    setFading(false);
    setWashing(false);
    setCharCount(0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= full.length; i++) {
      timers.push(setTimeout(() => setCharCount(i), i * TYPING_SPEED));
    }

    const typingDone = full.length * TYPING_SPEED;
    timers.push(setTimeout(() => setWashing(true), typingDone));
    timers.push(setTimeout(() => setFading(true), typingDone + PAUSE_AFTER));
    timers.push(
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PROMPTS.length);
      }, typingDone + PAUSE_AFTER + FADE_DURATION)
    );

    return () => timers.forEach(clearTimeout);
  }, [index, isEditing]);

  const handleActivate = () => {
    flushSync(() => setIsEditing(true));
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    const rect = cardRef.current?.getBoundingClientRect();
    setIsEditing(false);
    setInputValue('');
    if (rect) onSubmit?.(text, rect);
  };

  const rotatingClass = [
    'ai-search-rotating',
    washing && 'is-washing',
    fading && 'is-fading',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="ai-search">
      <div
        ref={cardRef}
        className={`ai-search-card${isEditing ? ' is-editing' : ''}`}
        dir="rtl"
        onClick={!isEditing ? handleActivate : undefined}
        role={!isEditing ? 'button' : undefined}
        tabIndex={!isEditing ? 0 : undefined}
        onKeyDown={!isEditing ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleActivate(); } : undefined}
      >
        {!isEditing && <span className="ai-search-cursor" aria-hidden="true" />}
        {isEditing ? (
          <form className="ai-search-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="ai-search-input text-h2-normal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              dir="rtl"
              onBlur={handleBlur}
              aria-label="חיפוש"
            />
            <button
              type="submit"
              className="ai-search-send"
              aria-label="שליחה"
              disabled={!inputValue.trim()}
              onMouseDown={(e) => e.preventDefault()}
            >
              <SendArrowIcon />
            </button>
          </form>
        ) : (
          <span className="ai-search-prompt text-h2-normal">
            שאל אותי לגבי{' '}
            <span className={rotatingClass}>{PROMPTS[index].slice(0, charCount)}</span>
          </span>
        )}
      </div>
    </section>
  );
}
